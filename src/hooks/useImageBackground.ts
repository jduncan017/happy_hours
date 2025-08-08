import { useState, useEffect } from 'react';
import { analyzeImageBrightness, type ImageAnalysisResult } from '@/utils/image/imageAnalysis';

interface UseImageBackgroundReturn {
  backgroundClass: string;
  isAnalyzing: boolean;
  analysisComplete: boolean;
  analysisResult: ImageAnalysisResult | null;
}

/**
 * Hook that analyzes an image and returns the optimal background class
 */
export const useImageBackground = (imageUrl: string | undefined): UseImageBackgroundReturn => {
  const [backgroundClass, setBackgroundClass] = useState<string>('bg-stone-300');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setBackgroundClass('bg-stone-300');
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setAnalysisResult(null);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    analyzeImageBrightness(imageUrl)
      .then((result) => {
        setAnalysisResult(result);
        setBackgroundClass(result.backgroundClass);
        setAnalysisComplete(true);
      })
      .catch((error) => {
        console.warn('Image analysis failed, using default background:', error);
        setBackgroundClass('bg-stone-400');
        setAnalysisComplete(true);
        setAnalysisResult(null);
      })
      .finally(() => {
        setIsAnalyzing(false);
      });
  }, [imageUrl]);

  return {
    backgroundClass,
    isAnalyzing,
    analysisComplete,
    analysisResult
  };
};