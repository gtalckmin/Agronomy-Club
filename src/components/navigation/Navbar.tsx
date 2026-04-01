"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sprout } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

type NavItem = {
  name: string;
  href: string;
  description: string;
};

const navigationItems: NavItem[] = [
  {
    name: "About",
    href: "/about",
    description: "Learn about the Agronomy Club's mission and purpose",
  },
  {
    name: "Community",
    href: "/community",
    description: "Join discussions, share posts, and connect with members",
  },
  {
    name: "Games",
    href: "/games",
    description: "Educational games for agricultural learning",
  },
  {
    name: "Chapters",
    href: "/chapters",
    description: "Find and connect with university chapters",
  },
  {
    name: "Competitions",
    href: "/competitions",
    description: "Participate in agricultural competitions and challenges",
  },
  {
    name: "Quizzes",
    href: "/quizzes",
    description: "Test your knowledge with interactive quizzes",
  },
  {
    name: "Resources",
    href: "/resources",
    description: "Access study materials and educational content",
  },
  {
    name: "Alumni",
    href: "/alumni",
    description: "Connect with alumni for mentorship and career opportunities",
  },
  {
    name: "Account",
    href: "/account",
    description: "Manage your profile and account settings",
  },
];

const authItems: NavItem[] = [
  {
    name: "Sign in",
    href: "/auth/signin",
    description: "Access your Agronomy Club account",
  },
  {
    name: "Join",
    href: "/auth/signup",
    description: "Create your Agronomy Club member profile",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, status, isAuthenticated, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <nav className="bg-green-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-green-200" />
              <span className="text-xl font-bold">Agronomy Club</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActive(item.href)
                    ? "bg-green-700 text-white"
                    : "text-green-100 hover:bg-green-700 hover:text-white"
                }`}
                title={item.description}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  href="/members"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive("/members")
                      ? "bg-green-700 text-white"
                      : "text-green-100 hover:bg-green-700 hover:text-white"
                  }`}
                  title="View member directory"
                >
                  Members
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {status === "loading" ? (
              <span className="text-sm font-medium text-green-100">Checking session…</span>
            ) : isAuthenticated ? (
              <>
                <span className="text-sm font-semibold text-green-100">
                  {user?.name ?? user?.email ?? "Member"}
                </span>
                <Link
                  href="/account"
                  className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-900 transition hover:bg-white"
                >
                  Account
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-sm font-semibold text-green-100 transition hover:text-white"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-semibold text-green-100 transition hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-900 transition hover:bg-white"
                >
                  Join the club
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-green-100 hover:text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-green-500"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-green-700 border-t border-green-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ${
                  isActive(item.href)
                    ? "bg-green-600 text-white"
                    : "text-green-100 hover:bg-green-600 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-xs text-green-200">{item.description}</span>
                </div>
              </Link>
            ))}

            <div className="mt-3 border-t border-green-600 pt-3 space-y-2">
              {status === "loading" ? (
                <span className="block px-3 text-sm font-medium text-green-100">Checking session…</span>
              ) : isAuthenticated ? (
                <>
                  <span className="block px-3 text-sm font-semibold text-green-100">
                    Signed in as {user?.name ?? user?.email ?? "Member"}
                  </span>
                  <Link
                    href="/members"
                    className="block px-3 py-2 rounded-md text-base font-medium text-green-100 transition hover:bg-green-600 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Member Directory
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-900 transition hover:bg-white"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                authItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-green-100 transition hover:bg-green-600 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-xs text-green-200">{item.description}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
