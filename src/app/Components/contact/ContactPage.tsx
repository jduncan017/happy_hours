"use client";

import MaxWidthContainer from "../Layout/MaxWidthContainer";
import CardWrapper from "../SmallComponents/CardWrapper";
import ContactForm from "./ContactForm";
import ContactFAQ from "./ContactFAQ";
import {
  MessageCircle,
  Mail,
  Clock,
  Users,
  Building2,
  Settings,
  HelpCircle,
  Star,
  AlertTriangle,
  Lightbulb,
  HeadphonesIcon,
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50 sm:p-20 p-6 flex flex-col items-center">
      <MaxWidthContainer className="py-8 space-y-12 text-center">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-po1/10 rounded-2xl mb-6">
              <MessageCircle className="w-8 h-8 text-po1" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions, suggestions, or want to report an issue? We'd love
              to hear from you!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>We typically respond within 24-48 hours</span>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid items-center gap-8">
            {/* Contact Form */}
            <CardWrapper className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-po1/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-po1" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600">
                    We'll get back to you as soon as possible
                  </p>
                </div>
              </div>
              <ContactForm />
            </CardWrapper>

            {/* Contact Categories */}
            {/* <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-po1" />
                How Can We Help?
              </h2>

              <div className="space-y-4">
                <ContactCategory
                  icon={<Building2 className="w-5 h-5" />}
                  title="Missing Restaurant"
                  description="Report a restaurant that should be on our list"
                />
                <ContactCategory
                  icon={<Star className="w-5 h-5" />}
                  title="Suggest New Restaurant"
                  description="Know a great happy hour spot we should add?"
                />
                <ContactCategory
                  icon={<AlertTriangle className="w-5 h-5" />}
                  title="Report Incorrect Info"
                  description="Found outdated hours or wrong details?"
                />
                <ContactCategory
                  icon={<Settings className="w-5 h-5" />}
                  title="Technical Issues"
                  description="Experiencing bugs or website problems?"
                />
                <ContactCategory
                  icon={<Lightbulb className="w-5 h-5" />}
                  title="General Feedback"
                  description="Share your thoughts about the app"
                />
                <ContactCategory
                  icon={<Users className="w-5 h-5" />}
                  title="Business Inquiries"
                  description="Partnership or collaboration opportunities"
                />
              </div>
            </div> */}
          </div>

          {/* Restaurant Owners Section */}
          <CardWrapper className="p-8 bg-gradient-to-r from-po1/5 to-py1/5 border-po1/20">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-po1/10 rounded-2xl">
                <Building2 className="w-8 h-8 text-po1" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Restaurant Owners
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Want to claim your restaurant listing or partner with us?
              </p>
              <div className="flex flex-col items-center bg-white/80 rounded-xl p-6 border border-po1/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-po1">
                    <Settings className="w-5 h-5" />
                    <span className="font-semibold">
                      Restaurant Management Features Coming Soon!
                    </span>
                  </div>
                  <p className="text-gray-600">
                    We're working on a comprehensive dashboard where restaurant
                    owners can:
                  </p>
                  <ul className="text-left space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-po1 rounded-full"></div>
                      Claim and verify your restaurant listing
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-po1 rounded-full"></div>
                      Update happy hour times and deals in real-time
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-po1 rounded-full"></div>
                      Manage photos and restaurant information
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-po1 rounded-full"></div>
                      Access analytics and customer insights
                    </li>
                  </ul>
                  <p className="text-sm text-start text-gray-500 mt-4">
                    In the meantime, feel free to contact us directly about your
                    restaurant!
                  </p>
                </div>
              </div>
            </div>
          </CardWrapper>

          {/* FAQ Section */}
          <ContactFAQ />

          {/* Community Guidelines */}
          <CardWrapper className="p-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <h2 className="text-2xl justify-center font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              Community Guidelines
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Our Commitment
                </h3>
                <p className="text-gray-600 text-sm">
                  We're dedicated to providing accurate, up-to-date information
                  about Denver's best happy hour spots.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Community Contributions
                </h3>
                <p className="text-gray-600 text-sm">
                  We value feedback from our community and recognize users who
                  help us improve the platform.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Response Policy
                </h3>
                <p className="text-gray-600 text-sm">
                  All feedback is reviewed carefully, and we respond to
                  inquiries within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </CardWrapper>
        </div>
      </MaxWidthContainer>
    </div>
  );
}

// Contact Category Component
function ContactCategory({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-po1/30 hover:bg-po1/5 transition-all cursor-pointer">
      <div className="w-8 h-8 bg-po1/10 rounded-lg flex items-center justify-center text-po1 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
