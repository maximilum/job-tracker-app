"use client";

import { IdCardLanyard, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useSession, signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;
  const { t } = useLanguage();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.data?.success) {
      router.push("/sign-in");
    }
  };

  return (
    <nav className="border-b border-border bg-background text-foreground">
      <div className="container flex mx-auto px-4 h-16 items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 text-primary text-2xl font-semibold">
            <IdCardLanyard size={30} />
            <p>{t.nav.appName}</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          {!user ? (
            <div className="flex items-center gap-2">
              <Link href={"/sign-in"}>
                <Button variant={"ghost"}>{t.nav.signIn}</Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button>{t.nav.signUp}</Button>
              </Link>
            </div>
          ) : (
            <>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 me-2 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src="" alt="@shadcn" className="grayscale" />
                      <AvatarFallback>
                        {user.name ? user.name[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="end"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuLabel className="font-normal">
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => void handleSignOut()}
                    className="cursor-pointer"
                  >
                    {t.nav.logout}
                    <DropdownMenuShortcut>
                      <LogOut size={16} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href={"/dashboard"}>
                <Button variant={"ghost"}>{t.nav.dashboard}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
