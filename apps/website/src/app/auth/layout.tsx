import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "~/src/auth";
import logo from "../../assets/side-banner.png";

async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await auth();

  if (session != null) {
    redirect("/");
  }
  return (
    <div className="w-full h-screen flex justify-between items-center">
      <Image src={logo} alt="logo" className="w-1/2 h-3/4 rounded-2xl" />
      {children}
    </div>
  );
}

export default AuthLayout;
