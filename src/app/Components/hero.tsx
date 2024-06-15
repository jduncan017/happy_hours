"use client";
import Image from "next/image";
import logoFull from "../../../public/ui-elements/h3-logo-full.png";

const HeroSection = () => {
  return (
    <div className="HeroSection relative flex h-[620px] flex-col p-4 pt-[85px] xs:h-[560px] sm:h-[650px] sm:p-0">
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
      <div className="TitleSection z-20 mx-auto mt-3 flex h-fit w-full flex-col gap-4 rounded bg-blurBlack p-10 text-white shadow-themeShadow backdrop-blur-lg backdrop-filter sm:mt-24 sm:w-[600px] sm:rounded-2xl">
        <div className="LogoSection flex h-fit flex-col items-center gap-4 pb-6">
          <Image
            className="Logo h-40 w-auto sm:h-full"
            src={logoFull}
            alt="H3 Logo"
            width={540}
            height={250}
            priority
          />
          <div className="TextContainer flex flex-col items-center gap-4 text-center sm:text-start">
            <div className="HeroSlogan flex w-fit gap-2">
              <h1 className="Title text-4xl">{`It's Happy Hour`}</h1>
              <span className="text-4xl uppercase italic text-orange-300">
                Somewhere!
              </span>
            </div>
            <h2 className="HeroTitle m-auto w-full text-center font-sans font-semibold capitalize">
              {`Your secret to the best dates, deals, & the happiest hours in Denver!`}
            </h2>
          </div>
        </div>
        {/* <SearchBar /> */}
      </div>
      <div className="BackgroundLighting bottom-5 h-full w-full rounded-full bg-yellow-100 blur-[50px] sm:absolute sm:h-[340px]"></div>
    </div>
  );
};

export default HeroSection;
