"use client"
import { TeamGrid } from "@/components/team"
import TeamsSection from "./TeamSection"
import { Team, Teams } from "@/constants/teams/all";


import Header from "@/components/header";
import SplashScreen from "@/components/splash-screen";
import AboutNSponsor from "@/components/AboutNSponsor";


import HeroParallax from "@/components/hero-parallax";

export default function Home() {

  return (
    <>
        <Header />
        <SplashScreen />
        <AboutNSponsor/>
        {/* <SplashScreen /> */}
        <HeroParallax
          backImage="/assets/hero/layer-front.jpeg"
          topImage="/assets/hero/layer-back.png"
          topScale={1.2}
          topMaxHeight={520}
          // height={}
         />
        <main className="min-h-screen w-full bg-black font-sans">
        <div className="min-h-screen flex flex-col gap-50 pt-25 pb-25 items-center justify-center">
            <TeamsSection />
            {Teams.map((team: Team) => (
                <TeamGrid
                    key={team.name}
                    title={team.name}
                    images={team.images}
                    backgroundImage={team.backgroundImage}
                />
            ))}
        </div>
            
        //adding this dummy div to allow scrolling to see the last team's content properly later here we can add footer or other components
        <div style={{ height: "120vh" }} />

        </main>
        

    </>
  );
}
