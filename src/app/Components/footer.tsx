import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="Footer flex h-fit w-full flex-col items-center gap-4 bg-stone-900 px-4 pb-6 pt-0 sm:gap-12 sm:pt-10 md:px-16">
      <div className="Content flex h-fit w-full max-w-[2000px] flex-col items-center gap-8 border-t border-gray-400 px-4 pt-8 md:flex-row md:gap-24">
        <div className="Newsletter flex w-full flex-col items-center gap-6 md:items-start">
          <div className="LogoSectio flex h-fit items-center gap-2 rounded-lg">
            <Image
              src="/h3-logo-full.png"
              alt="H3 Logo"
              width={540}
              height={250}
            />
          </div>
        </div>
        <div className="Links border-n1 flex w-full gap-12 border-l p-10">
          <div className="Column flex flex-col gap-4">
            <h3 className="ColumnOne text-n2 w-full font-sans text-base font-semibold uppercase leading-normal">
              Sitemap
            </h3>
            <div className="FooterLinks flex h-48 w-fit flex-col items-start justify-start">
              <div className="Link flex w-fit items-start justify-start py-2">
                <div className="LinkOne text-n2 font-normal leading-tight">
                  Home
                </div>
              </div>
              <div className="Link flex w-fit py-2">
                <div className="LinkThree text-n2 font-normal leading-tight">
                  Contact
                </div>
              </div>
              <div className="Link flex w-fit py-2">
                <div className="LinkFour text-n2 w-fit font-normal leading-tight">
                  FAQ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Credits flex h-fit w-full flex-col items-center justify-between gap-2 border-t-2 border-gray-700 pt-4 md:items-start lg:flex-row">
        <div className="2023RelumeAllRightsReserved text-n2 font-normal leading-tight">
          © 2024 Happy Hour Hunt. All rights reserved.
        </div>
        <div className="FooterLinks flex items-start justify-start gap-6">
          <Link href="/privacy">
            <div className="PrivacyPolicy text-n2 font-normal leading-tight underline">
              Privacy Policy
            </div>
          </Link>
          <Link href="/privacy">
            <div className="TermsOfService text-n2 font-normal leading-tight underline">
              Terms and Conditions
            </div>
          </Link>
          <Link href="/privacy">
            <div className="CookiesSettings text-n2 font-normal leading-tight underline">
              Cookie Policy
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
