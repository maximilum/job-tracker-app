"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";
import { signIn } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const SignIn = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    try {
      const result = await signIn.email({ email, password });

      if (result.error) {
        setError(result.error?.message ?? t.auth.somethingWentWrong);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError(t.common.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-52px)] w-full flex justify-center items-center p-4">
      <Card className="p-8 w-full max-w-md">
        <CardTitle className="mb-4">
          <h1 className="text-2xl font-bold">{t.auth.signInTitle}</h1>
        </CardTitle>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4 mb-6 px-0">
            <div>
              <Label htmlFor="email" className="mb-1.5 block">
                {t.auth.email}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t.auth.emailPlaceholder}
                className="placeholder:text-muted-foreground/60"
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-1.5 block">
                {t.auth.password}
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-0">
            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
              {isLoading ? t.auth.signingIn : t.auth.signInButton}
            </Button>
            {error && (
              <p className="text-center text-xs text-destructive">{error}</p>
            )}
            <p className="text-xs text-center text-muted-foreground">
              {t.auth.noAccount}{" "}
              <Link
                href="/sign-up"
                className="text-primary font-semibold hover:text-primary/70 transition-colors ms-1 underline-offset-4 hover:underline"
              >
                {t.auth.signUpButton}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
