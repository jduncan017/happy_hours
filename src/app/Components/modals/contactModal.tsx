"use client";
import { useState } from "react";
import ModalWrapper from "./modalWrapper";
import SiteButton from "../SmallComponents/siteButton";
import TextInput from "../SmallComponents/TextInput";
import { useFormspark } from "@formspark/use-formspark";
import { useModal } from "../../../contexts/ModalContext";
import SubmitConfirmModal from "./submitConfirmModal";
import { User, Mail } from "lucide-react";

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
          <h1 className="font-3xl mb-2 mt-0 border-b border-dotted border-black font-serif font-bold uppercase leading-10 text-black sm:text-4xl">
            Contact Us!
          </h1>
          <p className="formDescription m-0 w-full text-gray-700">
            This is a beta site and there are lots of new features in the works.
            If you have a question or suggestion, please reach out below!
          </p>

          {/* Contact Form */}
          <form
            className="contactForm flex w-full flex-col items-center gap-2 pt-2 text-start text-black sm:gap-4 sm:pt-5"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Name Input */}

            <div className="NameSection flex w-full gap-6">
              <TextInput
                type="text"
                id="first-name"
                name="first-name"
                label="First Name:*"
                minLength={2}
                required
                placeholder="First Name"
                icon={<User className="w-4 h-4" />}
                size="sm"
                containerClassName="flex-1"
                className="h-[32px] text-black bg-white"
              />
              <TextInput
                type="text"
                id="last-name"
                name="last-name"
                label="Last Name:*"
                minLength={2}
                required
                placeholder="Last Name"
                icon={<User className="w-4 h-4" />}
                size="sm"
                containerClassName="flex-1"
                className="h-[32px] text-black bg-white"
              />
            </div>

            {/* Email Input */}
            <TextInput
              type="email"
              id="email"
              name="email"
              label="Email:*"
              required
              placeholder="happyhunter@mail.com"
              icon={<Mail className="w-4 h-4" />}
              size="sm"
              className="h-[32px] text-black bg-white"
            />

            <div className="MessageContainer w-full">
              <label className="m-0 text-lg" htmlFor="message">
                Message:
              </label>
              <textarea
                className="MessageInput bg-white mt-1 box-border w-full rounded-md border border-gray-400 p-1 text-black"
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
              size="sm"
              addClasses="mb-4"
              disabled={buttonDisabled}
            />
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
}
