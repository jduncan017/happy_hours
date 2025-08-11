"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useModal } from "../../contexts/ModalContext";
import HamburgerIcon from "./hamburgerMenu/hamburgerIcon";
import ContactModal from "./modals/contactModal";
import UserMenu from "./auth/UserMenu";

const NavBar = () => {
  const [mobileActive, setMobileActive] = useState(false);

  const { showModal } = useModal();

  function toggleMenu() {
    setMobileActive(!mobileActive);
  }

  const links = [
    { text: "Find Your Happy Hour", href: "/search" },
    { text: "Contact" },
  ];

  const renderMenu = () => {
    return (
      <div className="LinksContainer mt-6 flex flex-col gap-6 sm:mt-0 sm:flex-row sm:items-center sm:gap-8">
        {links.map((link, index) => {
          if (link.href) {
            // Navigation link
            return (
              <Link
                key={index}
                href={link.href}
                onClick={() => setMobileActive(false)}
              >
                <p className="AboutText font-medium tracking-wider text-white cursor-pointer transition-all duration-200 hover:scale-105 hover:text-po1">
                  {link.text}
                </p>
              </Link>
            );
          } else {
            // Modal trigger (Contact)
            return (
              <button
                key={index}
                onClick={() => {
                  showModal(<ContactModal />);
                  setMobileActive(false);
                }}
              >
                <p className="AboutText w-fit font-medium tracking-wider text-white cursor-pointer transition-all duration-200 hover:scale-105 hover:text-po1">
                  {link.text}
                </p>
              </button>
            );
          }
        })}
        <UserMenu />
      </div>
    );
  };

  return (
    <nav className="NavContainer w-full flex justify-center">
      <div className="NavBar hidden w-full bg-black font-sans sm:block">
        <div className="Container mx-auto max-w-[2400px] flex items-center justify-between gap-4 px-8 py-2">
          <div className="LogoSection flex h-fit items-center gap-2">
            <Link href="/">
              <Image
                src="/h3-logo-wide.png"
                alt="H3 Logo"
                width={337}
                height={40}
                priority
              />
            </Link>
          </div>
          {renderMenu()}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={` ${
          mobileActive ? "h-[260px] rounded-b-xl" : "h-[74px]"
        } ${"MobileNav fixed z-30 flex w-full flex-col justify-center overflow-hidden bg-black px-4 py-3 font-sans transition-all duration-400 sm:hidden"} `}
      >
        <div className="NavBar flex w-full items-center justify-between gap-5">
          <div className="LogoSection flex h-full">
            <Link
              href="/"
              className="transition-all duration-300 hover:scale-105 hover:contrast-125"
            >
              <Image
                src="/h3-logo-wide.png"
                alt="H3 Logo"
                width={337}
                height={40}
                priority
              />
            </Link>
          </div>
          <HamburgerIcon onToggleMenu={toggleMenu} menuOpen={mobileActive} />
        </div>
        {mobileActive && renderMenu()}
      </div>
    </nav>
  );
};

export default NavBar;
