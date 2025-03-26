import { FaDashcube } from "react-icons/fa";
import Link from "next/link";
import { ModeToggle } from "@/components/ThemeToggler";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="bg-primary dark:bg-slate-700 flex text-white justify-between py-1 px-3">
        <Link href="/">
          <FaDashcube size={28} />
        </Link>
        <div>
          <ModeToggle />
        </div>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
