import { Metadata } from "next";
import TermsPage from "../Components/legal/TermsPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing your use of HappyHourHunt Denver, including acceptable use, content, and limitations.",
  alternates: {
    canonical: "/terms",
  },
};

export default function Terms() {
  return <TermsPage />;
}
