"use client";

import ModalWrapper from "./modalWrapper";
import SiteButton from "../SmallComponents/siteButton";
import { useModal } from "../../../contexts/ModalContext";
import ContactModal from "./contactModal";

const ConstructionModal = () => {
  const { hideModal, showModal } = useModal();

  return (
    <ModalWrapper>
      <div className="404Container flex h-fit max-w-[450px] flex-col items-center rounded-2xl py-6 text-center font-serif">
        <h2 className="Header text-3xl text-gray-800">Coming Soon!</h2>
        <p className="Description mt-1 max-w-[400px] leading-6 text-gray-600 sm:mt-0 sm:max-w-[450px] sm:leading-7">
          This site is still under construction. For any questions, please reach
          out via our contact form!
        </p>
        <div className="ButtonContainer mt-6 flex h-fit w-fit flex-wrap justify-center gap-4 sm:gap-4">
          <SiteButton
            text="Contact Us"
            onSubmit={() => showModal(<ContactModal />)}
            variant="orange"
            rounded={false}
            size="md"
            addClasses="w-1/2"
          />
          <SiteButton
            text="Close"
            onSubmit={() => hideModal()}
            variant="orange"
            rounded={false}
            size="md"
            addClasses="w-1/2"
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ConstructionModal;
