"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useModal } from "../../contexts/ModalContext";
import ConstructionModal from "./modals/constructionModal";
import HamburgerIcon from "./hamburgerMenu/hamburgerIcon";

const NavBar = () => {
  const [mobileActive, setMobileActive] = useState(false);

  const { showModal } = useModal();

  function toggleMenu() {
    setMobileActive(!mobileActive);
  }

  const links = [{ text: "Happy Hour Now!" }, { text: "Browse" }];

  const renderMenu = () => {
    return (
      <div className="LinksContainer mt-6 flex flex-col gap-6 rounded-full p-1 sm:mt-0 sm:flex-row sm:items-center sm:gap-3">
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => {
              showModal(<ConstructionModal />);
              setMobileActive(false);
            }}
          >
            <div className="LinkContainer bg-primaryOrange rounded-full px-3 py-2.5 text-white transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:text-black">
              <p className="AboutText text-2xl duration-300 sm:text-base lg:text-lg">
                {link.text}
              </p>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <nav className="NavContainer">
      <div className="NavBar fixed z-30 hidden w-full max-w-[1728px] font-sans sm:absolute sm:block">
        <div className="Container mx-auto flex h-[80px] items-center justify-between px-3">
          <div className="LogoSection flex h-fit items-center gap-2 rounded-full bg-blurBlack py-1.5 pl-1 pr-2 backdrop-blur-lg backdrop-filter">
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
