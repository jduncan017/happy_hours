import { useQuery } from '@tanstack/react-query';
import { analyzeImageBrightness, type ImageAnalysisResult } from '@/utils/image/imageAnalysis';

interface UseImageBackgroundReturn {
  backgroundClass: string;
  isAnalyzing: boolean;
  analysisComplete: boolean;
  analysisResult: ImageAnalysisResult | null;
}

/**
 * Analyzes an image to choose a contrasting background class.
 * Cached per-URL via React Query so navigating away and back, or showing
 * the same image in list + map, never re-runs the canvas pixel scan.
 */
export const useImageBackground = (imageUrl: string | undefined): UseImageBackgroundReturn => {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['imageBackground', imageUrl],
    queryFn: () => analyzeImageBrightness(imageUrl!),
    enabled: !!imageUrl,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (!imageUrl) {
    return {
      backgroundClass: 'bg-stone-300',
      isAnalyzing: false,
      analysisComplete: true,
      analysisResult: null,
    };
  }

  return {
    backgroundClass: data?.backgroundClass ?? 'bg-stone-300',
    isAnalyzing: isLoading,
    analysisComplete: isFetched,
    analysisResult: data ?? null,
  };
};