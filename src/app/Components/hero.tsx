"use client";
import Image from "next/image";
import SiteButton from "./SmallComponents/siteButton";
import SearchBar from "./SmallComponents/SearchBar";

const HeroSection = () => {
  return (
    <div className="HeroSection relative flex h-fit max-h-[1200px] flex-col p-4 pt-[85px] sm:h-dvh  sm:min-h-[72vw] sm:p-0 md:min-h-[78vw] lg:min-h-[68vw] xl:min-h-[62vw] 2xl:min-h-[50vw]">
      <div className="ImageContainer absolute inset-0 z-10 h-full min-h-[100vw] overflow-hidden shadow-themeShadow sm:block sm:min-h-[72vw] md:min-h-[78vw] lg:min-h-[68vw] xl:min-h-[62vw] 2xl:min-h-[50vw]">
        <Image
          className="BackgroundImage h-full w-full object-cover brightness-75"
          src="/hero1.jpg"
          alt="Background"
          width={1728}
          height={1138}
          priority
        />
      </div>
      <div className="TitleSection flex flex-col gap-4 text-white mx-auto mt-3 sm:mt-24 z-20 p-10 h-fit max-h-[1000px w-full sm:w-[600px] rounded bg-blurBlack shadow-themeShadow backdrop-blur-lg backdrop-filter sm:rounded-2xl">
        <div className="LogoSection flex sm:flex-row flex-col gap-4 h-fit pb-6 items-center">
          <Image
            className="Logo sm:h-full w-auto h-40"
            src="/h3-logo5.png"
            alt="H3 Logo"
            width={100}
            height={100}
          />
          <div className="TextContainer gap-4 flex flex-col items-center text-center sm:items-start sm:text-start">
            <h1 className="Title text-4xl max-w-80">
              {`It's Happy Hour `}
              <span className="italic text-orange-300">Somewhere!</span>
            </h1>
            <p className="HeroTitle m-auto w-full capitalize font-light">
              {`Your secret to the best dates, deals, & the happiest hours!`}
            </p>
          </div>
        </div>
        <SearchBar />
      </div>
      <div className="BackgroundLighting bottom-5 h-full w-full rounded-full bg-yellow-100 blur-[50px] sm:absolute sm:h-[340px]"></div>
    </div>
  );
};

export default HeroSection;
