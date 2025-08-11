/**
 * Streaming API Route for URL validation with progress updates
 */

import { NextRequest } from 'next/server';
import { getRestaurantsForValidation, type RestaurantUrlValidation } from '@/lib/supabase/urlValidation';
import { validateRestaurantUrls } from '@/utils/validation/urlValidator';

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  // Create a readable stream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial message
        const startMessage = JSON.stringify({ 
          type: 'start',
          message: 'Starting URL validation...'
        }) + '\n';
        controller.enqueue(encoder.encode(startMessage));
        
        // Get all restaurants
        const restaurants = await getRestaurantsForValidation();
        const totalRestaurants = restaurants.length;
        
        const totalMessage = JSON.stringify({
          type: 'progress',
          current: 0,
          total: totalRestaurants,
          message: `Found ${totalRestaurants} restaurants to validate`
        }) + '\n';
        controller.enqueue(encoder.encode(totalMessage));
        
        const results: RestaurantUrlValidation[] = [];
        const maxConcurrent = 5; // Maximum concurrent validations
        let currentIndex = 0;
        let activeValidations = 0;
        
        // Function to process a single restaurant
        const validateRestaurant = async (restaurant: any) => {
          try {
            // Convert snake_case to camelCase for the validation function
            const restaurantForValidation = {
              id: restaurant.id,
              name: restaurant.name,
              website: restaurant.website,
              menuUrl: restaurant.menu_url
            };
            
            const validation = await validateRestaurantUrls(restaurantForValidation);
            return { restaurant, validation, success: true };
            
          } catch (error) {
            console.error(`Failed to validate URLs for ${restaurant.name}:`, error);
            
            const errorValidation: RestaurantUrlValidation = {
              restaurantId: restaurant.id,
              restaurantName: restaurant.name,
              website: restaurant.website ? {
                url: restaurant.website,
                isValid: false,
                error: 'Validation failed'
              } : null,
              menuUrl: restaurant.menu_url ? {
                url: restaurant.menu_url,
                isValid: false,
                error: 'Validation failed'
              } : null,
              hasValidUrls: false,
            };
            
            return { restaurant, validation: errorValidation, success: false, error };
          }
        };
        
        // Function to start next validation if available
        const startNextValidation = async () => {
          if (currentIndex >= restaurants.length || activeValidations >= maxConcurrent) {
            return;
          }
          
          const restaurant = restaurants[currentIndex];
          currentIndex++;
          activeValidations++;
          
          try {
            const result = await validateRestaurant(restaurant);
            results.push(result.validation);
            
            // Send progress update after each completion
            const progressMessage = JSON.stringify({
              type: 'progress',
              completed: results.length,
              total: totalRestaurants,
              message: `${results.length} of ${totalRestaurants} restaurants validated`
            }) + '\n';
            controller.enqueue(encoder.encode(progressMessage));
            
          } finally {
            activeValidations--;
            // Start next validation immediately
            if (currentIndex < restaurants.length) {
              startNextValidation();
            }
          }
        };
        
        // Start initial batch of validations
        const initialPromises = [];
        for (let i = 0; i < Math.min(maxConcurrent, restaurants.length); i++) {
          initialPromises.push(startNextValidation());
        }
        
        // Wait for all validations to complete
        await Promise.all(initialPromises);
        
        // Wait for any remaining validations to finish
        while (activeValidations > 0 || currentIndex < restaurants.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
          if (currentIndex < restaurants.length && activeValidations < maxConcurrent) {
            startNextValidation();
          }
        }
        
        // Send completion message
        const brokenCount = results.filter(r => 
          (r.website && !r.website.isValid) || 
          (r.menuUrl && !r.menuUrl.isValid)
        ).length;
        
        const completionMessage = JSON.stringify({
          type: 'complete',
          results,
          summary: {
            totalRestaurants: results.length,
            brokenUrls: brokenCount,
            validUrls: results.length - brokenCount
          }
        }) + '\n';
        controller.enqueue(encoder.encode(completionMessage));
        
        controller.close();
        
      } catch (error) {
        console.error('Streaming validation error:', error);
        
        const errorMessage = JSON.stringify({
          type: 'fatal_error',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }) + '\n';
        controller.enqueue(encoder.encode(errorMessage));
        controller.close();
      }
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}