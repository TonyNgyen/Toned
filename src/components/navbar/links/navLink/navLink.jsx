"use client";

import React from "react";
import styles from "./navLink.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

function NavLink({ item }) {
  const pathName = usePathname();

  return (
    <Button
      asChild
      className={`${"min-w-[100px] p-[10px] bg-transparent text-black rounded-full text-center text-lg hover:bg-main hover:text-background text-foreground"} ${
        pathName === item.path && "bg-main text-background"
      }`}
    >
      <Link href={item.path} key={item.title}>
        {item.title}
      </Link>
    </Button>
  );
}

export default NavLink;
