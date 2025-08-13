import { useEffect } from "react";
import type { FC, ReactElement } from "react";
import { motion } from "framer-motion";
import { useModal } from "@/contexts/ModalContext";
import { X } from "lucide-react";
import useEscape from "@/hooks/useEscape";

interface DarkModalWrapperProps {
  children: ReactElement;
}

const DarkModalWrapper: FC<DarkModalWrapperProps> = ({ children }) => {
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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-lg"
      onClick={hideModal}
    >
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        initial={{ scale: 0.9, opacity: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative h-fit max-h-[90vh] w-fit max-w-[95vw] rounded-2xl shadow-2xl"
        onClick={handleModalContentClick}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default DarkModalWrapper;