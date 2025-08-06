"use client";
import Image from "next/image";
import SiteButton from "./SmallComponents/siteButton";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <div className="HeroSection relative flex h-svh max-h-[960px] min-h-fit flex-col items-center justify-center bg-black px-4 py-[70px] xs:px-10">
      <div className="ImageContainer absolute inset-0 z-10 flex h-full items-center justify-center overflow-hidden shadow-themeShadow">
        {/* mobile video */}
        <video
          className="BackgroundImage block h-full w-full object-cover lg:hidden"
          src="/mobile-hero.mp4"
          width={1728}
          height={1138}
          autoPlay
          loop
          muted
          playsInline
        />
        {/* desktop video */}
        <video
          className="BackgroundImage hidden h-full w-full object-cover lg:block"
          src="/desktop-hero.mp4"
          width={1728}
          height={1138}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className="TitleSection z-20 mx-auto mt-12 flex h-fit w-full flex-col gap-4 rounded-2xl bg-black/70 p-6 py-12 text-white shadow-themeShadow backdrop-blur-lg backdrop-filter sm:max-w-[600px] sm:rounded-xl sm:px-12 sm:py-10">
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
          variant="gradient"
          text="Find Your Happy Hour"
          rounded={true}
          addClasses="mx-auto w-60 h-12 z-10 cursor-pointer"
          onSubmit={() => router.push("/search")}
        />
        <p className="BetaNote m-auto text-center capitalize italic text-gray-400">
          {`Note: This site is in beta`}
        </p>
      </div>
    </div>
  );
}
