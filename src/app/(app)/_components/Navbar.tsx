"use client";

import Link from "next/link";
import { UserMenu } from "./UserMenu";
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[color:var(--surface)]/95 backdrop-blur shadow-[0_1px_0_rgba(0,0,0,0.4)]">
      <div className="px-3 sm:px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center pl-1">
            <img src="/logo.png" alt="Singulari" width={200} height={28} style={{ width: 200, height: "auto" }} />
          </Link>
        </div>
        <nav className="flex items-center pr-1">
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}


