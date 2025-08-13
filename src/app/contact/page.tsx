import { Metadata } from "next";
import ContactPage from "../Components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us | HappyHourHunt Denver",
  description: "Get in touch with the HappyHourHunt team. Report issues, suggest restaurants, or ask questions about Denver's best happy hour deals.",
  keywords: ["contact", "support", "feedback", "restaurant suggestions", "Denver happy hour"],
  openGraph: {
    title: "Contact Us | HappyHourHunt Denver",
    description: "Get in touch with the HappyHourHunt team for support, feedback, and restaurant suggestions.",
    type: "website",
  },
};

export default function Contact() {
  return <ContactPage />;
}