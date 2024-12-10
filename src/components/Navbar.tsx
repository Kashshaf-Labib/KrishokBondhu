"use client";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "../../constants";
import Button from "./Button";
import { useState, useEffect, useRef } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false); // Controls the Services dropdown for desktop
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false); // Controls the Services dropdown for mobile
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const servicesRef = useRef<HTMLDivElement>(null); // Ref to detect clicks outside

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Toggle Services dropdown on click
  const toggleServices = () => setServicesOpen(!servicesOpen);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between mx-auto max-w-[1440px] px-6 lg:px-20 3xl:px-0 relative z-30 py-2 bg-white shadow-md border-b border-gray-200">
      <Link href="/" className="pr-4">
        <div className="flex items-center">
          <Image
            src="/NavLogo.png"
            width={80}
            height={60}
            alt="Logo"
            className="ml-2 rounded-2xl"
          />
          <span className="text-3xl font-bold text-green-900 custom-font glow-effect-green">
            কৃষক বন্ধু
          </span>
        </div>
      </Link>

      <ul className="hidden h-full gap-12 lg:flex">
        {NAV_LINKS.map((link) =>
          link.key === "services" ? (
            <div
              key={link.key}
              onClick={toggleServices}
              ref={servicesRef}
              className="relative text-[16px] font-[400] text-slate-950 flex items-center justify-center cursor-pointer transition-all hover:font-bold pb-1.5"
            >
              {link.label}
              {servicesOpen && (
                <div
                  className="absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md"
                  onClick={(e) => e.stopPropagation()} // Prevent click from closing the dropdown
                >
                  <Link
                    href="/disease-detection"
                    className="block px-4 py-2 text-slate-950 hover:bg-green-100 transition-colors"
                  >
                    Plant Disease Detection
                  </Link>
                  <Link
                    href="/crop-recommendation"
                    className="block px-4 py-2 text-slate-950 hover:bg-green-100 transition-colors"
                  >
                    Crop Recommendation
                  </Link>
                  <Link
                    href="/fertilizer-recommendation"
                    className="block px-4 py-2 text-slate-950 hover:bg-green-100 transition-colors"
                  >
                    Fertilizer Recommendation
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={link.href}
              key={link.key}
              className="text-[16px] font-[400] text-slate-950 flex items-center justify-center cursor-pointer transition-all hover:font-bold pb-1.5"
            >
              {link.label}
            </Link>
          )
        )}
      </ul>

      <div className="hidden lg:flex lg:justify-between lg:items-center">
        {isSignedIn ? (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-12 h-12",
                userButtonPopoverCard: "w-72 h-auto",
              },
            }}
          />
        ) : (
          <Button
            type="button"
            title="Login"
            icon="/user.svg"
            variant="btn_dark_green"
          />
        )}
      </div>

      <Image
        src="/menu.svg"
        alt="menu"
        width={32}
        height={32}
        onClick={toggleMenu}
        className="inline-block cursor-pointer lg:hidden"
      />

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <button onClick={toggleMenu} className="absolute top-4 right-4 text-xl">
          ✖
        </button>

        <ul className="flex flex-col gap-6 mt-16 px-6">
          {NAV_LINKS.map((link) =>
            link.key === "services" ? (
              <div key={link.key}>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="text-[16px] font-[400] text-slate-950 flex items-center justify-start cursor-pointer transition-all hover:font-bold pb-1.5"
                >
                  {link.label}
                </button>
                {mobileServicesOpen && (
                  <div className="flex flex-col mt-2 bg-white shadow-lg rounded-md">
                    <Link
                      href="/disease-detection"
                      className="block px-4 py-2 text-slate-950 hover:bg-green-100 transition-colors"
                    >
                      Plant Disease Detection
                    </Link>
                    <Link
                      href="/crop-recommendation"
                      className="block px-4 py-2 text-slate-950 hover:bg-green-100 transition-colors"
                    >
                      Crop Recommendation
                    </Link>
                    <Link
                      href="/fertilizer-recommendation"
                      className="block px-4 py-2 text-slate-950 hover:bg-green-100 transition-colors"
                    >
                      Fertilizer Recommendation
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={link.href}
                key={link.key}
                className="text-[16px] font-[400] text-slate-950 flex items-center justify-start cursor-pointer transition-all hover:font-bold"
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            )
          )}

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Button
              type="button"
              title="Login"
              icon="/user.svg"
              variant="btn_dark_green"
              onClick={() => {
                toggleMenu();
              }}
            />
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;



