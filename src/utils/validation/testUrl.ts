/**
 * Simple URL testing utility for debugging validation issues
 */

import { validateUrl } from './urlValidator';

/**
 * Test a single URL and log detailed information
 * @param url - URL to test
 */
export async function testSingleUrl(url: string): Promise<void> {
  console.log(`🧪 Testing URL: ${url}`);
  console.log('─'.repeat(50));
  
  try {
    const result = await validateUrl(url, 15000); // 15 second timeout
    
    console.log(`Result: ${result.isValid ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`Status Code: ${result.statusCode || 'N/A'}`);
    console.log(`Response Time: ${result.responseTime}ms`);
    
    if (result.redirectUrl) {
      console.log(`Redirect: ${url} → ${result.redirectUrl}`);
    }
    
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
    
    console.log('─'.repeat(50));
    
  } catch (error) {
    console.error(`❌ Test failed:`, error);
  }
}

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).testUrl = testSingleUrl;
}