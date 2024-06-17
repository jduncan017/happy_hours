"use client";

import ModalWrapper from "./modalWrapper";
import SiteButton from "../SmallComponents/siteButton";
import { useModal } from "../../../contexts/ModalContext";

export default function SubmitConfirmModal() {
  const { hideModal } = useModal();

  return (
    <ModalWrapper>
      <div className="ModalContainer flex h-fit w-[500px] flex-col items-center gap-4 rounded-2xl p-5 px-8 py-3 text-center font-serif">
        <h2 className="Header text-2xl font-medium uppercase text-white">
          Thank You!
        </h2>
        <p className="Description text-xl text-white">
          We have received your submission and we will be in touch soon!
        </p>
        <div className="ButtonContainer flex h-fit w-fit gap-4">
          <SiteButton
            text="Close"
            onSubmit={() => hideModal()}
            colorFill={true}
            rounded={true}
            size="md"
            addClasses="mt-4"
          ></SiteButton>
        </div>
      </div>
    </ModalWrapper>
  );
}
