import { redirect } from "next/navigation";

import { auth } from "~/src/auth";
import { DashboardSidebar } from "~/src/components/Sidebar";

async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await auth();
  if (session == null) {
    redirect("/");
  }
  return (
    <div className="rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen">
      <DashboardSidebar />
      {children}
    </div>
  );
}

export default AuthLayout;
