"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useModal } from "../../contexts/ModalContext";
import HamburgerIcon from "./hamburgerMenu/hamburgerIcon";
import ContactModal from "./modals/contactModal";

const NavBar = () => {
  const [mobileActive, setMobileActive] = useState(false);

  const { showModal } = useModal();

  function toggleMenu() {
    setMobileActive(!mobileActive);
  }

  const links = [{ text: "Contact" }];

  const renderMenu = () => {
    return (
      <div className="LinksContainer mt-6 flex flex-col gap-6 p-1 sm:mt-0 sm:flex-row sm:items-center sm:gap-3">
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => {
              showModal(<ContactModal />);
              setMobileActive(false);
            }}
          >
            <div className="Link bg-po1 rounded-full px-8 py-2 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/50 hover:text-black">
              <p className="AboutText text-xl font-medium uppercase tracking-wider duration-300 sm:text-base lg:text-lg">
                {link.text}
              </p>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <nav className="NavContainer w-fuull flex justify-center">
      <div className="NavBar fixed z-30 hidden w-full max-w-[2400px] bg-black/40 font-sans backdrop-blur-lg sm:absolute sm:block">
        <div className="Container mx-auto flex items-center justify-between px-8 py-2">
          <div className="LogoSection flex h-fit items-center gap-2">
            <Image
              src="/h3-logo-wide.png"
              alt="H3 Logo"
              width={320}
              height={38}
            />
          </div>
          {renderMenu()}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={` ${
          mobileActive ? "h-[260px] rounded-xl" : "h-[74px]"
        } ${"MobileNav fixed z-30 flex w-full flex-col justify-center overflow-hidden bg-black px-4 py-3 font-sans transition-all duration-500 sm:hidden"} `}
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
                width={320}
                height={38}
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
