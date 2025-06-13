"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, LogOut, Menu } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b  border border-gray-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Healthcare Portal</h1>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/patients"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Patients
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2  hover:bg-gray-100 rounded-md transition"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="bg-white border border-gray-200 rounded-md shadow-lg shadow-gray-100 w-56"
                >
                  <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold ">
                    My Account
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="border-t border-blue-100" />

                  <DropdownMenuItem className="px-3 py-2 text-sm  hover:bg-blue-50 cursor-default">
                    {user.email}
                  </DropdownMenuItem>

                  <DropdownMenuItem className="px-3 py-2 text-sm  capitalize hover:bg-blue-50 cursor-default">
                    Role: {user.role}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="border-t border-blue-100" />

                  <DropdownMenuItem
                    onClick={logout}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800  cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4 " />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
