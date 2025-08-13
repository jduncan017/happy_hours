/**
 * API Route for extracting restaurant data from URLs
 * Uses web scraping to extract restaurant information
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ExtractDataSchema = z.object({
  url: z.string().url('Please provide a valid URL')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🕷️ Data extraction request received:', body);

    // Validate the request body
    const { url } = ExtractDataSchema.parse(body);

    // Basic URL validation and normalization
    const normalizedUrl = new URL(url);
    
    // For now, we'll implement a basic version that extracts OpenGraph data
    // In the future, this could be enhanced with AI or more sophisticated scraping
    const restaurantData = await extractBasicData(normalizedUrl.href);

    console.log('✅ Extracted restaurant data:', restaurantData);

    return NextResponse.json({
      success: true,
      restaurant: restaurantData
    });

  } catch (error) {
    console.error('❌ Data extraction error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid URL provided',
        details: error.issues
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to extract restaurant data. Please try manual entry.'
    }, { status: 500 });
  }
}

/**
 * Extract basic restaurant data from a website
 * This is a simplified version - could be enhanced with AI/ML
 */
async function extractBasicData(url: string) {
  try {
    // Fetch the webpage with timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Extract meta tags and basic information
    const extractedData: any = {
      source_url: url,
      extracted_at: new Date().toISOString(),
    };

    // Set website URL to base URL from the provided URL (user's happy hour URL)
    const baseUrl = new URL(url);
    extractedData.website = `${baseUrl.protocol}//${baseUrl.hostname}`;

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      extractedData.name = cleanText(titleMatch[1]);
    }

    // Extract OpenGraph data - match title with double quotes OR single quotes separately
    let ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i);
    if (!ogTitleMatch) {
      ogTitleMatch = html.match(/<meta[^>]*property='og:title'[^>]*content='([^']*)'[^>]*>/i);
    }
    if (ogTitleMatch) {
      extractedData.name = cleanText(ogTitleMatch[1]);
    }

    // Match description with double quotes OR single quotes separately
    let ogDescriptionMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i);
    if (!ogDescriptionMatch) {
      ogDescriptionMatch = html.match(/<meta[^>]*property='og:description'[^>]*content='([^']*)'[^>]*>/i);
    }
    if (ogDescriptionMatch) {
      extractedData.description = cleanText(ogDescriptionMatch[1]);
    }

    // Try to extract phone number with multiple patterns
    const phonePatterns = [
      /tel:[\s]*([+1\s\-().\d]+)/i,
      /phone[\s:]*([+1\s\-().\d]{10,})/i,
      /call[\s:]*([+1\s\-().\d]{10,})/i,
      /([\(\s]*\d{3}[\)\s\-\.]*\d{3}[\s\-\.]*\d{4})/g,
      /(\d{3}[\s\-\.]\d{3}[\s\-\.]\d{4})/g,
      /(\+?1[\s\-\.]?\d{3}[\s\-\.]?\d{3}[\s\-\.]?\d{4})/g,
      // More flexible patterns for various formats
      /(\d{10})/g, // Simple 10 digit
      /(\(\d{3}\)\s*\d{3}[\-\.\s]\d{4})/g, // (303) 555-1234
      /(\d{3}\.\d{3}\.\d{4})/g, // 303.555.1234
    ];

    for (const pattern of phonePatterns) {
      const match = html.match(pattern);
      if (match) {
        for (const phoneMatch of match) {
          // Extract just numbers and check if it's a valid phone number length
          const digitsOnly = phoneMatch.replace(/[^\d]/g, '');
          if (digitsOnly.length === 10 || digitsOnly.length === 11) {
            extractedData.phone = phoneMatch.trim();
            break;
          }
        }
        if (extractedData.phone) break;
      }
    }

    // Try to extract address with improved patterns
    const addressPatterns = [
      // Standard US address format
      /\b\d+\s+[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Way|Pkwy|Circle|Cir)[^,]*,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?/gi,
      // More flexible address pattern
      /\b\d+\s+[A-Za-z0-9\s]{5,50}(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Way)[^,]*,\s*[A-Za-z\s]+,\s*(?:CO|Colorado)/gi,
      // Even simpler pattern for Denver area
      /\b\d+\s+[A-Za-z0-9\s]{3,30},\s*Denver,?\s*CO/gi,
    ];

    for (const pattern of addressPatterns) {
      const match = html.match(pattern);
      if (match && match[0]) {
        extractedData.address = cleanText(match[0]);
        break;
      }
    }

    // Try to extract cuisine type from common patterns
    const cuisinePatterns = [
      /(?:cuisine|food|restaurant):\s*([A-Za-z\s]+)/i,
      /(\w+)\s+(?:cuisine|food|restaurant)/i,
      /serving\s+([A-Za-z\s]+)\s+(?:food|cuisine)/i,
    ];

    for (const pattern of cuisinePatterns) {
      const match = html.match(pattern);
      if (match) {
        const cuisine = cleanText(match[1]);
        if (cuisine && cuisine.length > 2 && cuisine.length < 50) {
          extractedData.cuisine_type = cuisine;
          break;
        }
      }
    }

    // Look for menu links
    const menuLinkMatch = html.match(/<a[^>]*href=["\']([^"']*menu[^"']*)["\'][^>]*>/i);
    if (menuLinkMatch) {
      const menuPath = menuLinkMatch[1];
      if (menuPath.startsWith('http')) {
        extractedData.menu_url = menuPath;
      } else if (menuPath.startsWith('/')) {
        const baseUrl = new URL(url);
        extractedData.menu_url = `${baseUrl.origin}${menuPath}`;
      }
    }

    console.log('🕷️ Raw extracted data:', extractedData);
    return extractedData;

  } catch (error) {
    console.error('❌ Extraction error:', error);
    throw new Error(`Failed to extract data from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Clean and normalize extracted text
 */
function cleanText(text: string): string {
  return text
    // HTML entities
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '...')
    // Numeric HTML entities
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    // Hex HTML entities  
    .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Clean up whitespace
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\r?\n/g, ' ') // Replace line breaks with spaces
    .trim();
}