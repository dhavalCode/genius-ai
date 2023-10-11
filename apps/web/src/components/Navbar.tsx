import Link from "next/link";
import { Poppins } from "next/font/google";
import { Sparkles } from "lucide-react";

import { classNames } from "@genius-ai/lib/utils";
import MobileSidebar from "@/components/MobileSidebar";
import { ModeToggle } from "@/components/ModeToggle";

import { Button } from "@genius-ai/ui";

const font = Poppins({ weight: "600", subsets: ["latin"] });
interface NavbarProps {
  isPro: boolean;
}

const Navbar = ({ isPro }: NavbarProps) => {
  // const proModal = useProModal();

  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 h-16 border-b border-primary/10 bg-secondary">
      <div className="flex items-center">
        <MobileSidebar isPro={isPro} />
        <Link href="/">
          <h1
            className={classNames(
              "hidden md:block text-xl md:text-3xl font-bold text-primary",
              font.className
            )}
          >
            companion.ai
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        {!isPro && (
          <Button onClick={()=>{}} size="sm" variant="premium">
            Upgrade
            <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
          </Button>
        )}
        <ModeToggle />
        {/* <UserButton afterSignOutUrl="/" /> */}
      </div>
    </div>
  );
};

export default Navbar;
