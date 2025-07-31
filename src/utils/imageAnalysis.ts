/**
 * Image analysis utilities for determining optimal background colors
 */

export interface ImageAnalysisResult {
  averageBrightness: number;
  isLight: boolean;
  recommendedBackground: 'light' | 'dark';
  backgroundClass: string;
}

/**
 * Analyzes an image to determine its average brightness
 * Returns a promise that resolves with analysis results
 */
export const analyzeImageBrightness = (imageUrl: string): Promise<ImageAnalysisResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Create a canvas to analyze the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        // Set canvas size - use smaller size for performance
        const maxSize = 100;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw the image on canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let totalBrightness = 0;
        let pixelCount = 0;
        
        // Calculate average brightness, ignoring transparent pixels
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          
          // Skip transparent pixels
          if (alpha > 10) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate perceived brightness using luminance formula
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
            totalBrightness += brightness;
            pixelCount++;
          }
        }
        
        // If image is mostly transparent, default to light background
        if (pixelCount === 0) {
          resolve({
            averageBrightness: 128,
            isLight: true,
            recommendedBackground: 'dark',
            backgroundClass: 'bg-stone-800'
          });
          return;
        }
        
        const averageBrightness = totalBrightness / pixelCount;
        const isLight = averageBrightness > 128;
        
        const result: ImageAnalysisResult = {
          averageBrightness,
          isLight,
          recommendedBackground: isLight ? 'dark' : 'light',
          backgroundClass: isLight ? 'bg-stone-800' : 'bg-stone-100'
        };
        
        resolve(result);
      } catch (error) {
        // If analysis fails, default to neutral background
        resolve({
          averageBrightness: 128,
          isLight: true,
          recommendedBackground: 'dark',
          backgroundClass: 'bg-stone-400'
        });
      }
    };
    
    img.onerror = () => {
      // If image fails to load, default to neutral background
      resolve({
        averageBrightness: 128,
        isLight: true,
        recommendedBackground: 'dark',
        backgroundClass: 'bg-stone-400'
      });
    };
    
    // Start loading the image
    img.src = imageUrl;
  });
};

/**
 * Gets a background class based on image brightness
 * Simplified version that doesn't require canvas analysis
 */
export const getContrastBackground = (brightness: number): string => {
  if (brightness > 180) return 'bg-stone-800'; // Very light image, dark background
  if (brightness > 128) return 'bg-stone-700'; // Light image, darker background
  if (brightness > 75) return 'bg-stone-300';  // Medium image, light background
  return 'bg-stone-100'; // Dark image, light background
};