"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Image from "next/image";
import { useUserStore } from "@/store/useUser";

import { Link, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useClickAway } from "@uidotdev/usehooks";
import { useTheme } from "next-themes";
import { FaHome } from "react-icons/fa";
import { CiLogin, CiLogout } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { logoutUser } from "@/functions/authActions";
import { revalidateTag } from "next/cache";
import useRevalidateTag from "@/functions/serverActions";
const LanguageChanger = dynamic(() => import("@/components/LanguageChanger"), {
  ssr: false,
});
const ThemeButton = dynamic(() => import("@/components/ThemeButton"), {
  ssr: false,
});
const Topbar = ({ user }: any) => {
  const { theme } = useTheme();
  const [dropdown, setDropdown] = useState(false);
  const clickOutsideRef: any = useClickAway(() => {
    setDropdown(false);
  });
  const { setCurrentUser, currentUser } = useUserStore();
  const router = useRouter();
  const t = useTranslations("navigations");
  const t2 = useTranslations();
  const links = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Chat", path: "/Chat", icon: <IoChatbubbleEllipsesOutline /> },
    { name: "Login", path: "/login", icon: <CiLogin /> },
  ];

  useEffect(() => {
    if (user && user?.username) {
      setCurrentUser(user);
    }
  }, [user,setCurrentUser]);

  return (
    <>
      <section className="flex items-center justify-between py-5 px-10 bg-blue-600  flex-wrap">
        <h1 className="text-2xl md:text-4xl">{t2("logo")}</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className=" transition-transform hidden md:flex md:items-center md:gap-3">
            {links.map((link, i) => (
              <Link key={i} href={link.path} className="hover:text-gray-200">
                {/* Wrap the link content inside an anchor tag */}
                {currentUser && link.name === "Login" ? (
                  ""
                ) : !currentUser && link.name === "Chat" ? (
                  ""
                ) : (
                  <p className="">{t(link.name)}</p>
                )}
              </Link>
            ))}
          </div>
          {/* Language */}

          <LanguageChanger />
          {/* Theme button */}
          <ThemeButton />

          <div
            ref={clickOutsideRef}
            className="h-8 w-8 relative"
            onClick={() => setDropdown(!dropdown)}
            onMouseOver={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            {currentUser ? (
              <>
                {" "}
                <Image
                  height={35}
                  width={35}
                  className="rounded-full h-full w-full object-cover"
                  alt={currentUser.username}
                  src={currentUser.pic}
                />
                <h1>{currentUser.username}</h1>
              </>
            ) : (
              <div className="h-9 w-9">
                <CgProfile className="h-full w-full" />
              </div>
            )}
            {/* Dropdown */}
            <div
              className={`absolute ${
                theme === "dark" ? "bg-white text-black " : "bg-black text-white"
              } right-0 p-3 min-w-40 z-50 transition-all duration-500 rounded-md ring-2 ring-violet-500  ${
                dropdown
                  ? "translate-y-1 scale-100 opacity-100"
                  : "translate-y-0 scale-0 opacity-0"
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 md:hidden">
                  {links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.path}
                      className="flex items-center gap-2 hover:text-blue-500"
                    >
                      {/* Wrap the link content inside an anchor tag */}
                      {currentUser && link.name === "Login" ? (
                        ""
                      ) : !currentUser && link.name === "Chat" ? (
                        ""
                      ) : (
                        <>
                          {" "}
                          <span>{link.icon}</span>
                          <p className="">{t(link.name)}</p>
                        </>
                      )}
                    </Link>
                  ))}
                </div>
                {currentUser && (
                  <>
                    {" "}
                    <Link
                      href={"/profile"}
                      className="flex items-center gap-2 text-sm duration-300 hover:text-blue-500"
                    >
                      <CgProfile />
                      Profile
                    </Link>
                    <li
                      className="flex items-center gap-2 cursor-pointer list-none text-red-400 duration-300 hover:text-rose-500"
                      onClick={() => {
                        localStorage.removeItem("userInfo");
                        // Cookies.remove("authToken");
                        toast.success("Logged Out!");
                        router.push("/login");
                        setCurrentUser(null as any);
                        logoutUser();
                        useRevalidateTag("user");
                      }}
                    >
                      <CiLogout />
                      Logout
                    </li>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Topbar;
