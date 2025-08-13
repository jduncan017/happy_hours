import { useEffect } from "react";
import type { FC, ReactElement } from "react";
import { motion } from "framer-motion";
import { useModal } from "../../../contexts/ModalContext";
import { X } from "lucide-react";
import useEscape from "../../../hooks/useEscape";

interface ModalWrapperProps {
  children: ReactElement;
  theme?: "light" | "dark";
  showCloseButton?: boolean;
}

const ModalWrapper: FC<ModalWrapperProps> = ({ 
  children, 
  theme = "light", 
  showCloseButton = true 
}) => {
  const { hideModal } = useModal();
  useEscape(hideModal);

  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  // Disable scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const themeClasses = {
    light: {
      backdrop: "bg-black/80 backdrop-blur-lg",
      content: "bg-stone-100/90 text-gray-900 shadow-2xl backdrop-blur-md",
      closeButton: "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
    },
    dark: {
      backdrop: "bg-black/80 backdrop-blur-lg", 
      content: "bg-stone-900 text-white shadow-2xl border border-white/10",
      closeButton: "bg-stone-800 hover:bg-stone-700 text-white/70 border border-white/20"
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${currentTheme.backdrop}`}
      onClick={hideModal}
    >
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        initial={{ scale: 0.9, opacity: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`relative h-fit max-h-[90vh] w-fit max-w-[95vw] rounded-2xl px-6 py-6 text-center ${currentTheme.content}`}
        onClick={handleModalContentClick}
      >
        {showCloseButton && (
          <button
            className={`absolute right-4 top-4 z-10 rounded-xl p-2 transition-all hover:scale-105 ${currentTheme.closeButton}`}
            type="button"
            onClick={hideModal}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {children}
      </motion.div>
    </div>
  );
};

export default ModalWrapper;
