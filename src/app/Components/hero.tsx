"use client";
import Image from "next/image";
import SiteButton from "./SmallComponents/siteButton";

interface HeroSectionProps {
  scrollToRef: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToRef }) => {
  return (
    <div className="HeroSection relative flex h-fit max-h-[1200px] flex-col items-center p-4 pt-[85px] sm:h-dvh  sm:min-h-[72vw] sm:p-0 md:min-h-[78vw] lg:min-h-[68vw] xl:min-h-[62vw] 2xl:min-h-[50vw]">
      <div className="ImageContainer absolute inset-0 z-10 h-full min-h-[100vw] overflow-hidden shadow-themeShadow sm:block sm:min-h-[72vw] md:min-h-[78vw] lg:min-h-[68vw] xl:min-h-[62vw] 2xl:min-h-[50vw]">
        <Image
          className="BackgroundImage h-full w-full object-cover"
          src="/cloud-field.webp"
          alt="Background"
          width={1728}
          height={1138}
          priority
        />
      </div>
      <div className="TitleSection z-20 h-fit max-h-[1000px] max-w-[705px] rounded bg-gradient-to-b from-heroPink via-heroOrange to-heroStone p-6 text-center shadow-themeShadow backdrop-blur-md backdrop-filter sm:m-auto sm:w-[60%] sm:rounded-2xl sm:p-10 lg:w-1/2">
        <Image
          className="Logo mx-auto w-auto"
          src="/logo-with-glow.webp"
          alt="LifeGuide Logo"
          width={595}
          height={407}
        />
        <h1 className="HeroTitle m-auto w-full max-w-[450px] font-light text-gray-800">
          A path to find a greater you. Clear your mind and let go of
          subconscious stress.
        </h1>
        <SiteButton
          rounded={true}
          text="LEARN MORE"
          colorFill={true}
          addClasses="mb-4 mt-6 lg:mt-10"
          size="md"
          onSubmit={() => scrollToRef()}
        />
      </div>
      <div className="BackgroundLighting -bottom-5 h-full w-full rounded-lg bg-tertiaryYellow blur-[50px] sm:absolute sm:h-[340px]"></div>
    </div>
  );
};

export default HeroSection;
