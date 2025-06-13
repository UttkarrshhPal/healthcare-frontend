"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const predefinedUsers = {
    receptionist: {
      email: "receptionist@healthcare.com",
      password: "receptionist123",
    },
    doctor: {
      email: "doctor@healthcare.com",
      password: "doctor123",
    },
  };

  const handleAutofill = async (role: "receptionist" | "doctor") => {
    const creds = predefinedUsers[role];
    form.setValue("email", creds.email);
    form.setValue("password", creds.password);
    await form.trigger(); // validate before submit
    form.handleSubmit(onSubmit)(); // trigger login
  };

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true);
      await login(values.email, values.password);
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  const Spinner = () => (
    <div
      className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-white"
      role="status"
    />
  );

  return (
    <div className="flex m-10 items-center justify-center">
      <Card className="w-[400px] border-gray-100 shadow-xl rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Healthcare Portal
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Login to access the portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        {...field}
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter password"
                        type="password"
                        {...field}
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : "Login"}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-2">
                Haven&apos;t received your credentials?{" "}
                <span className="font-medium text-blue-600">
                  Please contact the{" "}
                  <Link href={"mailto:admin@healthcare.com"}>
                    <span className="underline">admin</span>
                  </Link>
                  .
                </span>
              </p>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <span className="mx-4 text-sm text-gray-500 font-semibold">
                  OR
                </span>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>

              {/* Autofill Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={() => handleAutofill("receptionist")}
                  className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium"
                >
                  Login as Receptionist
                </Button>
                <Button
                  type="button"
                  onClick={() => handleAutofill("doctor")}
                  className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium"
                >
                  Login as Doctor
                </Button>
              </div>

              {/* Note for recruiter */}
              <div className="mt-4 text-center text-xs text-gray-500 italic">
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  Developer shortcut for ease of access only
                </span>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
