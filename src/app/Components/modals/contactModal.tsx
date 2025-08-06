"use client";
import { useState } from "react";
import ModalWrapper from "./modalWrapper";
import SiteButton from "../SmallComponents/siteButton";
import { useFormspark } from "@formspark/use-formspark";
import { useModal } from "../../../contexts/ModalContext";
import SubmitConfirmModal from "./submitConfirmModal";

const FORMSPARK_FORM_ID = "TJYoTsOiJ";

export default function ContactModal() {
  const { showModal } = useModal();
  const [submit] = useFormspark({
    formId: FORMSPARK_FORM_ID,
  });
  const [submitConfirm, setSubmitConfirm] = useState("");
  const [buttonDisplay, setButtonDisplay] = useState("SEND MESSAGE");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (form.checkValidity()) {
      try {
        setButtonDisabled(true);
        setButtonDisplay("Sending...");

        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());

        await submit(formValues);

        setButtonDisplay("Sent!");
        setTimeout(() => showModal(<SubmitConfirmModal />), 500);
      } catch (error) {
        console.error("Request failed:", error);
        setButtonDisplay("SEND MESSAGE");
        setSubmitConfirm(
          "We're sorry, there was an error sending your message. Please try again later!",
        );
        setButtonDisabled(false);
      }
    } else {
      form.reportValidity();
      return;
    }
  }

  return (
    <ModalWrapper>
      <div className="contactModal">
        <div className="formWrapper relative flex max-h-[100dvh] w-full max-w-[500px] flex-col px-2 font-sans sm:px-6">
          <h1 className="font-3xl mb-2 mt-0 border-b border-dotted border-white font-serif font-bold uppercase leading-10 text-white sm:text-4xl">
            Contact Us!
          </h1>
          <p className="formDescription m-0 w-full text-white">
            This is a beta site and there are lots of new features in the works.
            If you have a question or suggestion, please reach out below!
          </p>

          {/* Contact Form */}
          <form
            className="contactForm flex w-full flex-col items-center gap-2 pt-2 text-start text-white sm:gap-4 sm:pt-5"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Name Input */}

            <div className="NameSection flex w-full gap-6">
              <div className="FirstNameContainer flex w-full flex-col gap-1">
                <label className="m-0 text-lg" htmlFor="name">
                  First Name:*
                </label>
                <input
                  className="FirstNameInput mt-0.5 box-border h-[32px] w-full rounded-md border border-gray-400 p-1 text-black"
                  type="text"
                  id="first-name"
                  name="first-name"
                  minLength={2}
                  required
                  placeholder="First Name"
                />
              </div>
              <div className="LastNameContainer flex w-full flex-col gap-1">
                <label className="m-0 text-lg" htmlFor="name">
                  Last Name:*
                </label>
                <input
                  className="LastNameInput mt-0.5 box-border h-[32px] w-full rounded-md border border-gray-400 p-1 text-black"
                  type="text"
                  id="last-name"
                  name="last-name"
                  minLength={2}
                  required
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="EmailContainer w-full">
              <label className="m-0 text-lg" htmlFor="email">
                Email:*
              </label>
              <input
                className="EmailInput mt-0.5 box-border h-[32px] w-full rounded-md border border-gray-400 p-1 text-black"
                type="email"
                id="email"
                name="email"
                required
                placeholder="youremail@gmail.com"
              />
            </div>

            <div className="MessageContainer w-full">
              <label className="m-0 text-lg" htmlFor="message">
                Message:
              </label>
              <textarea
                className="MessageInput mt-1 box-border w-full rounded-md border border-gray-400 p-1 text-black"
                id="message"
                name="message"
                rows={4}
              ></textarea>

              <div className="contactFormSubmitMessage mt-2.5 w-full text-center text-lg text-red-500">
                {submitConfirm}
              </div>
            </div>

            {/* Submit Button */}
            <SiteButton
              text={buttonDisplay}
              type="submit"
              variant="orange"
              rounded={true}
              size="md"
              addClasses="mb-4"
              disabled={buttonDisabled}
            />
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
}
