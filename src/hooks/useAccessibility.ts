import { useEffect, useRef } from 'react';

/**
 * Accessibility utilities hook for managing focus and keyboard navigation
 */
export const useAccessibility = () => {
  /**
   * Manages focus for keyboard navigation
   * Ensures focus is visible and properly trapped when needed
   */
  const manageFocus = {
    /**
     * Set focus to an element and ensure it's visible
     */
    focusElement: (element: HTMLElement | null) => {
      if (element) {
        element.focus();
        // Ensure focused element is visible
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'nearest'
        });
      }
    },

    /**
     * Focus the first focusable element within a container
     */
    focusFirst: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        manageFocus.focusElement(firstElement);
      }
    },

    /**
     * Focus management for modals and dropdowns
     */
    trapFocus: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
        
        // Escape key to close modal
        if (e.key === 'Escape') {
          const closeButton = container.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      };

      container.addEventListener('keydown', handleKeyDown);
      
      // Focus first element when trap is established
      firstElement?.focus();

      return () => {
        container.removeEventListener('keydown', handleKeyDown);
      };
    }
  };

  /**
   * Screen reader announcements
   */
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only'; // Assume sr-only class exists for screen-reader-only content
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  /**
   * Skip navigation functionality
   */
  const skipToContent = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Keyboard navigation helpers
   */
  const keyboardNavigation = {
    /**
     * Handle arrow key navigation in lists
     */
    handleArrowKeys: (
      event: KeyboardEvent, 
      items: HTMLElement[], 
      currentIndex: number,
      onSelectionChange: (newIndex: number) => void
    ) => {
      let newIndex = currentIndex;
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'ArrowUp':
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = items.length - 1;
          break;
        default:
          return;
      }
      
      onSelectionChange(newIndex);
      manageFocus.focusElement(items[newIndex]);
    },

    /**
     * Handle Enter and Space key activation
     */
    handleActivation: (event: KeyboardEvent, callback: () => void) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        callback();
      }
    }
  };

  return {
    manageFocus,
    announceToScreenReader,
    skipToContent,
    keyboardNavigation
  };
};

/**
 * Hook for managing focus restoration after modal/dropdown closes
 */
export const useFocusRestore = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  };

  return { saveFocus, restoreFocus };
};

/**
 * Hook for managing ARIA live regions for dynamic content updates
 */
export const useLiveRegion = () => {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create live region if it doesn't exist
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.id = 'live-region';
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    return () => {
      // Cleanup on unmount
      if (liveRegionRef.current && document.body.contains(liveRegionRef.current)) {
        document.body.removeChild(liveRegionRef.current);
      }
    };
  }, []);

  const announce = (message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  return { announce };
};