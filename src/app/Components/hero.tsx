"use client";
import Image from "next/image";
import SearchBar from "./SmallComponents/SearchBar";
import SiteButton from "./SmallComponents/siteButton";

interface HeroSectionProps {
  scrollToRef: () => void;
}

export default function HeroSection({ scrollToRef }: HeroSectionProps) {
  return (
    <div className="HeroSection relative flex h-dvh flex-col p-4 pt-[85px] xs:p-10">
      <div className="ImageContainer absolute inset-0 z-10 h-full overflow-hidden shadow-themeShadow sm:block">
        <video
          className="BackgroundImage h-full w-full object-cover"
          src="/test.mp4"
          width={1728}
          height={1138}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className="TitleSection z-20 mx-auto mt-40 flex h-fit w-full flex-col gap-4 rounded bg-blurBlack p-6 py-16 text-white shadow-themeShadow backdrop-blur-lg backdrop-filter xs:mt-40 sm:max-w-[600px] sm:rounded-xl sm:px-12 sm:py-10">
        <div className="LogoSection flex h-fit flex-col items-center gap-2 pb-4">
          <Image
            className="Logo h-auto w-full sm:h-full sm:w-auto"
            src="/h3-logo-full.png"
            alt="H3 Logo"
            width={540}
            height={250}
            priority
          />
          <h1 className="HeroTitle m-auto w-full text-center font-serif capitalize">
            {`Your secret to the best dates, deals, & the happiest hours in Denver!`}
          </h1>
        </div>
        {/* <SearchBar /> */}
        <SiteButton
          colorFill={true}
          text="Find Your Happy Hour"
          rounded={true}
          addClasses="mx-auto w-60 h-12"
          onSubmit={() => scrollToRef()}
        />
      </div>
    </div>
  );
}
