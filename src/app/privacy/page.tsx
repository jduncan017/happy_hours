import { Metadata } from "next";
import PrivacyPage from "../Components/legal/PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How HappyHourHunt Denver collects, uses, and protects your information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function Privacy() {
  return <PrivacyPage />;
}
