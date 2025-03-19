// src/components/Navbar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "../../constants";
import Button from "./Button";
import { useState, useEffect, useRef } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { Bell } from "lucide-react";

interface Notification {
  postId: string;
  expertName: string;
  content: string;
  createdAt: string;
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();

  const servicesRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleServices = () => setServicesOpen(!servicesOpen);

  // Notification and outside click handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close services dropdown if clicked outside
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }

      // Close notification dropdown if clicked outside
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pusher notifications setup
  useEffect(() => {
    if (!isSignedIn || !userId) return;

    // Initialize Pusher client
    const pusher = new Pusher("daa7c0ddb799cdba8335", {
      cluster: "ap2",
    });

    // Subscribe to the user's channel
    const channel = pusher.subscribe(`user-${userId}`);

    // Listen for the "new-advice" event
    channel.bind("new-advice", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [isSignedIn, userId]);

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

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
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href="/disease-detection"
                    className="block px-4 py-2 text-slate-950 hover:bg-green-100 transition-colors"
                  >
                    গাছের রোগ সনাক্তকরণ
                  </Link>
                  <Link
                    href="/crop-recommendation"
                    className="block px-4 py-2 text-slate-950 hover:bg-green-100 transition-colors"
                  >
                    ফসল নির্বাচন
                  </Link>
                  <Link
                    href="/fertilizer-recommendation"
                    className="block px-4 py-2 text-slate-950 hover:bg-green-100 transition-colors"
                  >
                    সঠিক সার নির্বাচন
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
        {isSignedIn && (
          <div className="relative mr-4" ref={notificationRef}>
            <div
              onClick={toggleNotifications}
              className="cursor-pointer relative"
            >
              <Bell
                size={28}
                className="text-gray-600 hover:text-green-700 transition-colors"
              />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>

            {isNotificationOpen && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-300 p-4 z-50">
                <h3 className="text-lg font-semibold mb-3">🔔 নোটিফিকেশন</h3>
                {notifications.length === 0 && (
                  <p className="text-gray-500">এখনও কোন নোটিফিকেশন নেই</p>
                )}
                <ul className="space-y-3 max-h-80 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <li
                      key={index}
                      className="p-3 bg-gray-100 rounded-lg shadow-sm border border-gray-200"
                    >
                      <p className="font-semibold text-green-700">
                        {notification.expertName} commented on your post!
                      </p>
                      <p className="text-gray-700">{notification.content}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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
                      গাছের রোগ সনাক্তকরণ
                    </Link>
                    <Link
                      href="/crop-recommendation"
                      className="block px-4 py-2 text-slate-950 hover:bg-green-100 transition-colors"
                    >
                      ফসল নির্বাচন
                    </Link>
                    <Link
                      href="/fertilizer-recommendation"
                      className="block px-4 py-2 text-slate-950 hover:bg-green-100 transition-colors"
                    >
                      সঠিক সার নির্বাচন
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
