import Link from "next/link";
import Image from "next/image";

import { Button } from "@repo/ui/components/ui/button";
import { AuroraBackground } from "@repo/ui/components/ui/auora";
import { TypewriterEffectSmooth } from "@repo/ui/components/ui/typewriter";
import { BackgroundBeamsWithCollision } from "@repo/ui/components/ui/background";

import { auth } from "../auth";
import logo from "../assets/logo.png";
import { Navbar } from "../components/Navbar";
import banner from "../assets/side-banner.png";

const words = [
  {
    text: "Connect",
  },
  {
    text: "with",
  },
  {
    text: "your",
  },
  {
    text: "Friends",
  },
  {
    text: "in real time.",
    className: "text-primary",
  },
];

export default async function Page() {
  const session = await auth();
  console.log(session);

  return (
    <div>
      <Navbar />
      <BackgroundBeamsWithCollision className="h-[90vh]">
        <AuroraBackground>
          <main className="flex justify-between items-center tracking-tight z-0">
            <div className="flex w-full flex-col p-6 gap-2">
              <div className="flex flex-col items-center justify-center h-[30rem]">
                <p className="text-neutral-600 dark:text-neutral-200 text-xl font-semibold flex justify-center items-center">
                  Your Own Chat App - WhatsUp{" "}
                  <Image src={logo} alt="logo" height={50} width={50} />
                </p>
                <TypewriterEffectSmooth words={words} />
                <div className="flex mx-16 mb-8">
                  <p className="text-neutral-600 dark:text-neutral-200">
                    Experience seamless communication with our feature-rich chat
                    app, designed for modern, intuitive interactions. Connect
                    through instant one-on-one messaging or create private
                    groups with friends and colleagues, ensuring a personalized
                    communication space where only invited members can join.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                  <Link href="/auth/signup">
                    <Button>Join now</Button>
                  </Link>
                  <Link href={"/auth/signup"}>
                    <Button variant={"outline"}>Signup</Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex w-full">
              <Image src={banner} alt="logo" className="h-3/4 rounded-2xl" />
            </div>
          </main>
        </AuroraBackground>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
