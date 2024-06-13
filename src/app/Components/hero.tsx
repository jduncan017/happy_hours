"use client";
import Image from "next/image";
import SiteButton from "./SmallComponents/siteButton";
import SearchBar from "./SmallComponents/SearchBar";

const HeroSection = () => {
  return (
    <div className="HeroSection relative flex h-fit max-h-[1200px] flex-col p-4 pt-[85px] sm:h-dvh  sm:min-h-[72vw] sm:p-0 md:min-h-[78vw] lg:min-h-[68vw] xl:min-h-[62vw] 2xl:min-h-[50vw]">
      <div className="ImageContainer absolute inset-0 z-10 h-full min-h-[100vw] overflow-hidden shadow-themeShadow sm:block sm:min-h-[72vw] md:min-h-[78vw] lg:min-h-[68vw] xl:min-h-[62vw] 2xl:min-h-[50vw]">
        <Image
          className="BackgroundImage h-full w-full object-cover"
          src="/hero-background.webp"
          alt="Background"
          width={1728}
          height={1138}
          priority
        />
      </div>
      <div className="TitleSection text-white mt-24 ml-10 z-20 p-10 h-fit max-h-[1000px] max-w-[705px] rounded bg-blurBlack shadow-themeShadow backdrop-blur-md backdrop-filter sm:w-[60%] sm:rounded-2xl lg:w-1/2">
        <div className="LogoSection flex gap-5 h-fit pb-6">
          <Image
            className="Logo"
            src="/h3-logo.png"
            alt="H3 Logo"
            width={100}
            height={100}
          />
          <h1 className="Title text-5xl max-w-80">Happy Hour Hunt</h1>
        </div>
        <h3 className="HeroTitle m-auto w-full font-light">
          {`Denver's Premier, Community Led Happy Hour Website!`}
        </h3>
        {/* <SearchBar /> */}
        <SiteButton
          rounded={true}
          text="Search"
          colorFill={true}
          addClasses="mb-4 mt-6 lg:mt-10"
          size="md"
        />
      </div>
      <div className="BackgroundLighting -bottom-5 h-full w-full rounded-lg bg-tertiaryYellow blur-[50px] sm:absolute sm:h-[340px]"></div>
    </div>
  );
};

export default HeroSection;
