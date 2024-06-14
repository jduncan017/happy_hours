"use client";
import { useState } from "react";
import ModalWrapper from "./modalWrapper";
import SiteButton from "../SmallComponents/siteButton";
// import { useFormspark } from "@formspark/use-formspark";
import { useModal } from "../../../contexts/ModalContext";
import SubmitConfirmModal from "./submitConfirmModal";

const FORMSPARK_FORM_ID = "fmXvbcpQF";

export default function ContactModal() {
  const { showModal } = useModal();
  // const [submit] = useFormspark({
  //   formId: FORMSPARK_FORM_ID,
  // });
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

        // await submit(formValues);

        setButtonDisplay("Sent!");
        setTimeout(() => showModal(<SubmitConfirmModal />), 500);
      } catch (error) {
        console.error("Request failed:", error);
        setButtonDisplay("SEND MESSAGE");
        setSubmitConfirm(
          "We're sorry, there was an error sending your message. Please try again later!"
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
        <div className="formWrapper relative flex max-h-[100dvh] w-full max-w-[550px] flex-col px-2 font-sans sm:px-6">
          <h1 className="font-3xl mb-2 mt-0 border-b border-dotted border-gray-500 font-serif font-bold uppercase leading-10 sm:text-4xl">
            Contact Us!
          </h1>
          <p className="formDescription m-0 w-full">
            Have a question or suggestion for our site?
            <br /> Reach out below!
          </p>

          {/* Contact Form */}
          <form
            className="contactForm flex w-full flex-col items-center gap-2 pt-2 text-start sm:gap-4 sm:pt-5"
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
                  className="FirstNameInput mt-0.5 box-border h-[32px] w-full rounded-md border border-gray-400 p-1"
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
                  className="LastNameInput mt-0.5 box-border h-[32px] w-full rounded-md border border-gray-400 p-1"
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
                className="EmailInput mt-0.5 box-border h-[32px] w-full rounded-md border border-gray-400 p-1"
                type="email"
                id="email"
                name="email"
                required
                placeholder="youremail@gmail.com"
              />
            </div>

            {/* Phone Input */}
            <div className="PhoneContainer w-full">
              <label className="m-0 text-lg " htmlFor="phone">
                Phone:
              </label>
              <input
                className="PhoneInput mt-0.5 box-border h-[32px] w-full rounded-md border border-gray-400 p-1"
                type="tel"
                id="phone"
                name="phone"
                placeholder="(123) 456-7890"
              />
            </div>

            {/* Services Input */}
            <div className="SubjectContainer w-full">
              <label className="m-0 text-start text-lg " htmlFor="subject">
                What Service Are You Interested In?*
              </label>
              <select
                className="SubjectInput mt-0.5 box-border h-[32px] w-full rounded-md border border-gray-400 p-1"
                name="subject"
                id="subject"
                defaultValue={""}
                required
              >
                <option value="" disabled>
                  Please Select
                </option>
                <option value="energy_medicine">Energy Medicine</option>
                <option value="brain_spotting">Brain Spotting</option>
                <option value="life_guidance">Life Guidance</option>
                <option value="life_guidance">Unsure</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            <div className="MessageContainer w-full">
              <label className="m-0 text-lg" htmlFor="message">
                Message:
              </label>
              <textarea
                className="MessageInput mt-1 box-border w-full rounded-md border border-gray-400 p-1"
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
              colorFill={true}
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
