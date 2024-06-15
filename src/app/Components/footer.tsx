import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="Footer flex h-fit w-full flex-col items-start justify-start gap-4 bg-stone-900 px-4 pb-6 pt-0 sm:gap-12 sm:pt-10 md:px-16">
      <div className="Content flex h-fit w-full flex-col items-center justify-start gap-8 border-t border-gray-400 px-4 pt-8 md:flex-row md:gap-24">
        <div className="Newsletter flex w-full flex-col items-center justify-start gap-6 md:items-start xl:w-1/2">
          <div className="LogoSection flex h-fit items-center gap-2 rounded-lg py-1.5 pl-1 pr-6">
            <Image
              src="/ui-elements/h3-logo-full.png"
              alt="H3 Logo"
              width={540}
              height={250}
            />
          </div>
        </div>
        <div className="Links flex h-56 w-full justify-evenly gap-12">
          <div className="Column flex flex-col gap-4">
            <h3 className="ColumnOne w-full font-sans text-base font-semibold uppercase leading-normal text-neutral">
              Sitemap
            </h3>
            <div className="FooterLinks flex h-48 w-fit flex-col items-start justify-start">
              <div className="Link flex w-fit items-start justify-start py-2">
                <div className="LinkOne font-normal leading-tight text-neutral">
                  Home
                </div>
              </div>
              <div className="Link flex w-fit py-2">
                <div className="LinkThree font-normal leading-tight text-neutral">
                  Contact
                </div>
              </div>
              <div className="Link flex w-fit py-2">
                <div className="LinkFour w-fit font-normal leading-tight text-neutral">
                  FAQ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Credits flex h-fit w-full flex-col items-center justify-between gap-2 border-t-2 border-gray-700 pt-4 md:items-start lg:flex-row">
        <div className="2023RelumeAllRightsReserved font-normal leading-tight text-neutral">
          © 2024 Happy Hour Hunt. All rights reserved.
        </div>
        <div className="FooterLinks flex items-start justify-start gap-6">
          <Link href="/privacy">
            <div className="PrivacyPolicy font-normal leading-tight text-neutral underline">
              Privacy Policy
            </div>
          </Link>
          <Link href="/privacy">
            <div className="TermsOfService font-normal leading-tight text-neutral underline">
              Terms and Conditions
            </div>
          </Link>
          <Link href="/privacy">
            <div className="CookiesSettings font-normal leading-tight text-neutral underline">
              Cookie Policy
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
