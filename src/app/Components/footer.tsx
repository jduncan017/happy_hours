import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="Footer flex h-fit w-full flex-col items-start justify-start gap-4 px-4 pb-6 pt-0 sm:gap-12 sm:pt-10 md:px-16">
      <div className="Content flex h-fit w-full flex-col items-center justify-start gap-8 border-t border-gray-400 px-4 pt-8 md:flex-row md:gap-24">
        <div className="Newsletter flex w-full flex-col items-center justify-start gap-6 md:items-start xl:w-1/2">
          <Link
            href="/"
            className="transition-all duration-300 hover:scale-105 hover:contrast-125"
          >
            <div className="LogoSection flex h-fit items-center gap-2 rounded-full bg-black py-1.5 pl-1 pr-6">
              <Image src="/h3-logo4.png" alt="H3 Logo" width={75} height={75} />
              <p className="Title font-sans text-3xl font-semibold text-orange-50 lg:text-4xl">
                Happy Hour Hunt
              </p>
            </div>
          </Link>
        </div>
        <div className="Links flex h-56 w-full justify-evenly gap-12">
          <div className="Column flex flex-col gap-4">
            <h3 className="ColumnOne w-full font-sans text-base font-semibold uppercase leading-normal text-gray-700">
              Sitemap
            </h3>
            <div className="FooterLinks flex h-48 w-fit flex-col items-start justify-start">
              <div className="Link flex w-fit items-start justify-start py-2">
                <div className="LinkOne font-normal leading-tight text-gray-600">
                  Home
                </div>
              </div>
              <div className="Link flex w-fit py-2">
                <div className="LinkThree font-normal leading-tight text-gray-600">
                  Contact
                </div>
              </div>
              <div className="Link flex w-fit py-2">
                <div className="LinkFour w-fit font-normal leading-tight text-gray-600">
                  FAQ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Credits flex h-fit w-full flex-col items-center justify-between gap-2 border-t-2 border-gray-700 pt-4 md:items-start lg:flex-row">
        <div className="2023RelumeAllRightsReserved font-normal leading-tight text-gray-600">
          © 2024 Happy Hour Hunt. All rights reserved.
        </div>
        <div className="FooterLinks flex items-start justify-start gap-6">
          <Link href="/privacy">
            <div className="PrivacyPolicy font-normal leading-tight text-gray-600 underline">
              Privacy Policy
            </div>
          </Link>
          <Link href="/privacy">
            <div className="TermsOfService font-normal leading-tight text-gray-600 underline">
              Terms and Conditions
            </div>
          </Link>
          <Link href="/privacy">
            <div className="CookiesSettings font-normal leading-tight text-gray-600 underline">
              Cookie Policy
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
