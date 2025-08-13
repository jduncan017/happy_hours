"use client";

import { useState } from "react";
import CardWrapper from "../SmallComponents/CardWrapper";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  showCallout?: boolean;
  calloutText?: string;
}

const contactFAQs: FAQItem[] = [
  {
    question: "How do I suggest a new restaurant?",
    answer:
      "You can suggest a new restaurant by using our restaurant submission form or by contacting us directly through this contact page. We review all submissions and add qualifying restaurants that have happy hour deals in the Denver area.",
  },
  {
    question: "How often is restaurant information updated?",
    answer:
      "We strive to keep all restaurant information current and accurate. Our team regularly reviews and updates listings, and we rely on community feedback to help us catch any outdated information. If you notice incorrect details, please let us know!",
  },
  {
    question: "Can restaurant owners claim their listings?",
    answer:
      "Yes! We're currently developing a comprehensive restaurant management system that will allow owners to claim and manage their listings. In the meantime, restaurant owners can contact us directly to update their information or discuss partnership opportunities.",
  },
  {
    question: "How do you verify happy hour information?",
    answer:
      "We verify happy hour information through multiple sources including restaurant websites, direct contact with establishments, and community feedback. We encourage users to report any discrepancies they encounter so we can keep our information accurate.",
  },
  {
    question: "Why isn't my favorite restaurant listed?",
    answer:
      "We focus on restaurants with active happy hour deals in the Denver area. If your favorite spot has happy hour specials and isn't listed, please suggest it through our submission form or contact us directly. We're always looking to expand our database!",
  },
  {
    question: "Is the service free to use?",
    answer:
      "Yes! HappyHourHunt is completely free for users. Our mission is to help Denver residents and visitors discover the best happy hour deals in the city without any cost barriers.",
  },
  {
    question: "How can I report incorrect information?",
    answer:
      "If you find outdated hours, incorrect pricing, or other inaccurate details, please use the contact form above and select 'Report Incorrect Information' as your category. Include specific details about what needs to be corrected.",
  },
  {
    question: "Do you cover areas outside of Denver?",
    answer:
      "Currently, we focus exclusively on the Denver metropolitan area and surrounding neighborhoods. This allows us to provide the most accurate and comprehensive coverage for the local area.",
  },
];

export default function ContactFAQ() {
  return (
    <FAQSection 
      title="Frequently Asked Questions"
      subtitle="Quick answers to common questions"
      faqs={contactFAQs}
      showCallout={true}
      calloutText="If you couldn't find the answer you're looking for, don't hesitate to reach out using the contact form above. We're here to help and typically respond within 24-48 hours."
    />
  );
}

export function FAQSection({ 
  title = "Frequently Asked Questions", 
  subtitle, 
  faqs, 
  showCallout = false, 
  calloutText 
}: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <CardWrapper className="p-8 flex flex-col items-center w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-py1/10 rounded-xl flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-py1" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="space-y-4 w-full">
        {faqs.map((item, index) => {
          const isOpen = openItems.has(index);
          return (
            <div
              key={index}
              className="border flex-1 border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-4 bg-gray-50">
                  <p className="text-gray-600 leading-relaxed text-start">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showCallout && calloutText && (
        <div className="mt-8 p-6 bg-gradient-to-r from-po1/5 to-py1/5 rounded-xl border border-po1/20">
          <h3 className="font-semibold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 text-sm">
            {calloutText}
          </p>
        </div>
      )}
    </CardWrapper>
  );
}
