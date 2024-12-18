import { heroContent , usersTooltip } from "@/constants/index";
import GetStartedAnimatedBtn from "@/components/GetStartedAnimatedBtn";
import TextBorderCutEffect from "@/Effects/TextBorderCutEffect";
import DescriptionWithLoop from "./DescriptionWithLoop";
import InfiniteCourseScroller from "./InfiniteCourseScroller";
import AnimatedTooltip from "./AnimatedTooltip";



const HeroLeftSection = () => {
  
  return (
    <section className="w-full mx-auto h-screen flex flex-col justify-center items-start px-5">
      <div className="w-full flex flex-col gap-10 ">
        <div className="w-full flex flex-col gap-2 text-start items-start justify-center">
          <div className="w-full flex flex-col text-start items-start justify-center">
            <h1 className="text-black dark:text-white font-ubuntu font-bold text-3xl sm:text-4xl md:text-5xl w-fit sm:leading-[3rem] ">
              <TextBorderCutEffect text={heroContent.h1Heading} />
            </h1>
            <h1 className="text-black dark:text-white font-ubuntu font-bold text-3xl sm:text-4xl md:text-5xl w-fit sm:leading-[3rem] ">
              <TextBorderCutEffect text={heroContent.h1Heading2} />
            </h1>
          </div>
          <DescriptionWithLoop/>
          <div className="flex sm:flex-row flex-col sm:gap-8 gap-6 justify-between items-center w-full sm:my-0 my-4">
            
            <GetStartedAnimatedBtn BtnText={heroContent.buttonText} />

            <div className="flex gap-2 items-center ">

            <div className="flex flex-wrap items-center justify-center sm:my-10 my-2 px-2"> 
                <AnimatedTooltip items={usersTooltip}/>
            </div>

              {/* Stats */}
              <div className="flex flex-col items-center justify-center px-1">
                <h1 className="text-black dark:text-white font-ubuntu text-3xl font-extrabold">42K +</h1>
                <p className="text-black/80 dark:text-white/80 font-sans text-base">
                  Using this platform
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
            <InfiniteCourseScroller /> 

        </div>
      </div>
    </section>
  );
};

export default HeroLeftSection;
