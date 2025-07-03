"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function Header() {
    const path=usePathname();
    useEffect(()=>{
        console.log("Current path:", path);
    },[])
  return (
    <div className= "flex p-4 items-center justify-between bg-secondary">
        <Image src={'/logo.svg'} width={160} height={100} alt="Logo"/>
        <ul className="hidden md:flex gap-6 cursor-pointer" >
            <li className={`flex p-4 items-center justify-between bg-secondary shadow-sm ${path==='/dashboard'&&'text-primary font-bold'}`}>Dashboard</li>
            <li className={`flex p-4 items-center justify-between bg-secondary shadow-sm ${path==='/dashboard/questions'&&'text-primary font-bold'}`}>Questions</li>
            <li className={`flex p-4 items-center justify-between bg-secondary shadow-sm ${path==='/dashboard/upgrade'&&'text-primary font-bold'}`}>Upgrade</li>
            <li className={`flex p-4 items-center justify-between bg-secondary shadow-sm ${path==='/dashboard/how-it-works'&&'text-primary font-bold'}`}>How it Works?</li>
        </ul>
        <UserButton/>
    </div>
  );
}

export default Header;
