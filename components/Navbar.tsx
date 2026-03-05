import { IdCardLanyard } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="border-b border-border bg-background text-foreground">
      <div className="container flex mx-auto px-4 h-16 items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-4    text-primary text-2xl font-semibold">
            <IdCardLanyard size="30" />
            <p>Job Tracker</p>
          </div>
        </Link>
        <div className="flex gap-2">
          <Link href={"/sign-in"}>
            <Button variant={"ghost"}>Sign In</Button>
          </Link>
          <Link href={"/sign-up"}>
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
