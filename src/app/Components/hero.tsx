"use client";
import Image from "next/image";
import logoFull from "../../../public/ui-elements/h3-logo-full.png";

const HeroSection = () => {
  return (
    <div className="HeroSection relative flex h-[580px] flex-col p-4 pt-[85px] xs:p-10 sm:h-[650px]">
      <div className="ImageContainer absolute inset-0 z-10 h-full overflow-hidden shadow-themeShadow sm:block">
        <Image
          className="BackgroundImage h-full w-full object-cover brightness-75"
          src="/hero1.webp"
          alt="Background"
          width={1728}
          height={1138}
          priority
        />
      </div>
      <div className="TitleSection z-20 mx-auto mt-16 flex h-fit w-full flex-col gap-4 rounded bg-blurBlack p-6 text-white shadow-themeShadow backdrop-blur-lg backdrop-filter xs:mt-24 sm:max-w-[600px] sm:rounded-2xl sm:px-12 sm:py-10">
        <div className="LogoSection flex h-fit flex-col items-center gap-5 pb-4">
          <Image
            className="Logo h-auto w-full sm:h-full sm:w-auto"
            src={logoFull}
            alt="H3 Logo"
            width={540}
            height={250}
            priority
          />
          <h1 className="HeroTitle m-auto w-full text-center font-sans capitalize">
            {`Your secret to the best dates, deals, & the happiest hours in Denver!`}
          </h1>
        </div>
        {/* <SearchBar /> */}
      </div>
      <div className="BackgroundLighting bottom-5 h-full w-full rounded-full bg-yellow-100 blur-[50px] sm:absolute sm:h-[340px]"></div>
    </div>
  );
};

export default HeroSection;
