"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import SiteButton from "../SmallComponents/siteButton";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const contactCategories = [
    { value: "", label: "Select a category" },
    { value: "missing-restaurant", label: "Missing Restaurant" },
    { value: "suggest-restaurant", label: "Suggest New Restaurant" },
    { value: "incorrect-info", label: "Report Incorrect Information" },
    { value: "technical-issue", label: "Technical Issue/Bug" },
    { value: "general-feedback", label: "General Feedback" },
    { value: "business-inquiry", label: "Business Inquiry" },
    { value: "other", label: "Other" },
  ];

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to send message");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for contacting us. We&apos;ll get back to you within 24-48 hours.
        </p>
        <SiteButton
          text="Send Another Message"
          onSubmit={() => setSubmitStatus("idle")}
          variant="white"
          size="sm"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {submitStatus === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="John Doe"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="john@example.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
        >
          {contactCategories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          placeholder="Brief description of your inquiry"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          placeholder="Please provide details about your inquiry..."
          rows={6}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors resize-none"
        />
      </div>

      <SiteButton
        type="submit"
        text={isSubmitting ? "Sending Message..." : "Send Message"}
        disabled={isSubmitting}
        variant="orange"
        size="lg"
        addClasses="w-full"
      />
    </form>
  );
}