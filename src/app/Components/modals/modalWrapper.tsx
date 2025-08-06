import { useEffect } from "react";
import type { FC, ReactElement } from "react";
import { motion } from "framer-motion";
import { useModal } from "../../../contexts/ModalContext";
import Image from "next/image";
import useEscape from "../../../hooks/useEscape";

interface ModalWrapperProps {
  children: ReactElement;
}

const ModalWrapper: FC<ModalWrapperProps> = ({ children }) => {
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
      className="ModalBackdrop fixed inset-0 z-20 bg-black/80 flex items-center justify-center p-6 backdrop-blur-lg backdrop-filter"
      onClick={hideModal}
    >
      <motion.div
        animate={{ scale: 1 }}
        initial={{ scale: 0 }}
        transition={{ duration: 0.2 }}
        className="ModalContent relative mt-16 h-fit max-h-[84vh] w-fit max-w-[98vw] rounded-2xl bg-stone-300 px-6 py-6 text-center shadow-themeShadow backdrop-blur-md sm:py-10"
        onClick={handleModalContentClick}
      >
        <button
          className="CloseButton absolute right-5 top-5 z-10 rounded-full bg-white p-2 transition-all hover:scale-110 hover:cursor-pointer"
          type="button"
          onClick={hideModal}
        >
          <Image
            src="/ui-elements/close-button.svg"
            width={12}
            height={12}
            alt="modal close button"
          />
        </button>
        {children}
      </motion.div>
    </div>
  );
};

export default ModalWrapper;
