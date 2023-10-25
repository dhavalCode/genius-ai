import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

function Layout({
  children,
  isPro,
}: {
  children: React.ReactNode;
  isPro: boolean;
}) {
  return (
    <div className="h-full">
      <Navbar isPro={isPro} />
      <div className="hidden md:flex mt-16 h-full w-20 flex-col fixed inset-y-0">
        <Sidebar isPro={isPro} />
      </div>
      <main className="md:pl-20 pt-16 h-full">{children}</main>
    </div>
  );
}

export default Layout;
