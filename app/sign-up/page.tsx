"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";
import { signUp } from "@/lib/auth/auth-client";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    console.log(name, email, password);
    setIsLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-52px)] w-full flex justify-center items-center">
      <Card className="p-8 w-128">
        <CardTitle>
          <h1>Sign Up</h1>
        </CardTitle>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4 mb-8">
            <div>
              <Label htmlFor="name" className="mb-1">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="placeholder:text-neutral-300"
              ></Input>
            </div>
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
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
            {error && (
              <p className="text-center text-xs text-destructive">{error}</p>
            )}
            <p className="text-xs">
              if you have an account{"  "}
              <Link
                href="/sign-in"
                className="text-primary font-semibold hover:text-primary/50 transition-colors ml-2"
              >
                sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
