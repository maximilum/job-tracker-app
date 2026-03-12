"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";
import { signIn } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const Router = useRouter();

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
        // console.log(result);
        setError(result.error?.message ?? "Something went wrong");
      } else {
        Router.push("/dashboard");
      }
    } catch (error) {
      setError("an unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-52px)] w-full flex justify-center items-center">
      <Card className="p-8 w-128">
        <CardTitle>
          <h1>Sign In</h1>
        </CardTitle>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4 mb-8">
            <div>
              <Label htmlFor="email" className="mb-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="John@doe.com"
                className="placeholder:text-neutral-300"
              ></Input>
            </div>
            <div>
              <Label htmlFor="password" className="mb-1">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            {error && (
              <p className="text-center text-xs text-destructive">{error}</p>
            )}
            <p className="text-xs">
              if you have an account{"  "}
              <Link
                href="/sign-up"
                className="text-primary font-semibold hover:text-primary/50 transition-colors ml-2"
              >
                sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
