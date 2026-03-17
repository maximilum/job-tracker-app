"use client";

import { IdCardLanyard, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useSession, signOut } from "@/lib/auth/auth-client";
import { Redirect } from "next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { redirect } from "next/navigation";

const Navbar = () => {
  const session = useSession();
  const user = session.data?.user;

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.data?.success) {
      redirect("/sign-in");
    }
  };

  return (
    <nav className="border-b border-border bg-background text-foreground">
      <div className="container flex mx-auto px-4 h-16 items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-4    text-primary text-2xl font-semibold">
            <IdCardLanyard size="30" />
            <p>Job Tracker</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex gap-2">
              <Link href={"/sign-in"}>
                <Button variant={"ghost"}>Sign In</Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button>Sign Up</Button>
              </Link>
            </div>
          ) : (
            <>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 mr-4 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src="" alt="@shadcn" className="grayscale" />
                      <AvatarFallback>
                        {user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-70 absolute right-0"
                  align="end"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuLabel>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <button onClick={handleSignOut} className="w-full">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        Log out
                        <DropdownMenuShortcut>
                          <LogOut />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href={"/dashboard"}>
                <Button variant={"ghost"}>Dashboard</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
