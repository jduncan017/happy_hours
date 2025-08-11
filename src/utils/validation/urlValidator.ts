/**
 * URL Validation Utilities
 * Provides functions to validate restaurant website URLs
 */

export interface UrlValidationResult {
  url: string;
  isValid: boolean;
  statusCode?: number;
  error?: string;
  responseTime?: number;
  redirectUrl?: string;
}

export interface RestaurantUrlValidation {
  restaurantId: string;
  restaurantName: string;
  website?: UrlValidationResult | null;
  menuUrl?: UrlValidationResult | null;
  hasValidUrls: boolean;
}

/**
 * Validates a single URL by making a HEAD request
 * @param url - The URL to validate
 * @param timeout - Request timeout in milliseconds (default: 10000)
 * @returns Promise<UrlValidationResult>
 */
export async function validateUrl(
  url: string,
  timeout: number = 8000
): Promise<UrlValidationResult> {
  const startTime = Date.now();
  
  try {
    // Basic URL format validation
    new URL(url);
  } catch {
    return {
      url,
      isValid: false,
      error: 'Invalid URL format',
      responseTime: Date.now() - startTime,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Use more realistic browser-like headers to avoid bot detection
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    // Try GET request directly instead of HEAD to avoid blocks
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers,
      // Follow redirects
      redirect: 'follow',
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    // Check if URL was redirected
    const redirectUrl = response.url !== url ? response.url : undefined;

    // Consider 2xx, 3xx, and 403 as valid
    // 403 (Forbidden) often indicates bot detection but the site exists and works for real users
    const isValid = (response.status >= 200 && response.status < 400) || response.status === 403;
    
    return {
      url,
      isValid,
      statusCode: response.status,
      responseTime,
      redirectUrl,
    };

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        url,
        isValid: false,
        error: 'Request timeout',
        responseTime,
      };
    }

    return {
      url,
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime,
    };
  }
}

/**
 * Validates multiple URLs concurrently with rate limiting
 * @param urls - Array of URLs to validate
 * @param concurrency - Number of concurrent requests (default: 2, reduced for better success rate)
 * @param timeout - Request timeout in milliseconds (default: 15000, increased for slow sites)
 * @returns Promise<UrlValidationResult[]>
 */
export async function validateUrls(
  urls: string[],
  concurrency: number = 3,
  timeout: number = 8000
): Promise<UrlValidationResult[]> {
  const results: UrlValidationResult[] = [];
  
  // Process URLs in batches to avoid overwhelming servers
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchPromises = batch.map(url => validateUrl(url, timeout));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Shorter delay between batches for faster processing
    if (i + concurrency < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  return results;
}

/**
 * Validates URLs for a single restaurant
 * @param restaurant - Restaurant object with website and menuUrl
 * @returns Promise<RestaurantUrlValidation>
 */
export async function validateRestaurantUrls(restaurant: {
  id: string;
  name: string;
  website?: string | null;
  menuUrl?: string | null;
}): Promise<RestaurantUrlValidation> {
  const results: RestaurantUrlValidation = {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    website: null,
    menuUrl: null,
    hasValidUrls: false,
  };

  const validationPromises: Promise<void>[] = [];

  // Validate website URL
  if (restaurant.website) {
    validationPromises.push(
      validateUrl(restaurant.website, 8000).then(result => {
        results.website = result;
      })
    );
  }

  // Validate menu URL
  if (restaurant.menuUrl) {
    validationPromises.push(
      validateUrl(restaurant.menuUrl, 8000).then(result => {
        results.menuUrl = result;
      })
    );
  }

  // Run website and menu URL validation in parallel for each restaurant
  await Promise.all(validationPromises);

  // Determine if restaurant has valid URLs
  results.hasValidUrls = Boolean(
    (results.website?.isValid) || (results.menuUrl?.isValid)
  );

  return results;
}

/**
 * Gets summary statistics from validation results
 * @param results - Array of RestaurantUrlValidation results
 * @returns Summary statistics object
 */
export function getValidationSummary(results: RestaurantUrlValidation[]) {
  const summary = {
    totalRestaurants: results.length,
    restaurantsWithUrls: 0,
    restaurantsWithValidUrls: 0,
    restaurantsWithBrokenUrls: 0,
    totalUrls: 0,
    validUrls: 0,
    brokenUrls: 0,
    websiteUrls: { total: 0, valid: 0, broken: 0 },
    menuUrls: { total: 0, valid: 0, broken: 0 },
  };

  results.forEach(result => {
    let hasAnyUrl = false;
    let hasValidUrl = false;
    let hasBrokenUrl = false;

    if (result.website) {
      summary.totalUrls++;
      summary.websiteUrls.total++;
      hasAnyUrl = true;
      
      if (result.website.isValid) {
        summary.validUrls++;
        summary.websiteUrls.valid++;
        hasValidUrl = true;
      } else {
        summary.brokenUrls++;
        summary.websiteUrls.broken++;
        hasBrokenUrl = true;
      }
    }

    if (result.menuUrl) {
      summary.totalUrls++;
      summary.menuUrls.total++;
      hasAnyUrl = true;
      
      if (result.menuUrl.isValid) {
        summary.validUrls++;
        summary.menuUrls.valid++;
        hasValidUrl = true;
      } else {
        summary.brokenUrls++;
        summary.menuUrls.broken++;
        hasBrokenUrl = true;
      }
    }

    if (hasAnyUrl) {
      summary.restaurantsWithUrls++;
      
      if (hasValidUrl) {
        summary.restaurantsWithValidUrls++;
      }
      
      if (hasBrokenUrl) {
        summary.restaurantsWithBrokenUrls++;
      }
    }
  });

  return summary;
}