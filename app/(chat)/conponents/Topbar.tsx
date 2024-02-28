"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/store/useUser";
const Topbar = () => {
  const { setCurrentUser, currentUser } = useUserStore();
  const router = useRouter();
  const links = [
    { name: "Home", path: "/" },
    { name: "Chat", path: "/Chat" },
    { name: "Login", path: "/login" },
  ];
  
  return (
    <>
      <section className="flex items-center justify-between py-5 px-10 bg-blue-600 text-white flex-wrap">
        <h1 className="text-2xl md:text-4xl">Messenger</h1>
        <div className="flex items-center gap-4 flex-wrap">
          {links.map((link, i) => (
            <Link key={i} href={link.path}>
              {/* Wrap the link content inside an anchor tag */}
              <p className="hover:text-gray-200">{link.name}</p>
            </Link>
          ))}
          {currentUser && (
            <div className="h-8 w-8 relative">
              <Image
                height={35}
                width={35}
                className="rounded-full h-full w-full object-cover"
                alt={currentUser.username}
                src={currentUser.pic}
              />
            </div>
          )}
          {currentUser && (
            <button
              className="btn"
              onClick={() => {
                localStorage.removeItem("userInfo");
                Cookies.remove("authToken");
                toast.success("Logged Out!");
                router.push("/login");
                setCurrentUser(null as any);
              }}
            >
              Logout
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default Topbar;
