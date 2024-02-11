"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Nav() {
	const pathname = usePathname();

	return (
		<nav className="fixed top-0 w-full p-4 flex gap-2 bg-card">
			<Link
				className={`p-2 ${
					pathname === "/dashboard" ? "bg-primary text-white" : ""
				} rounded-lg`}
				href="/dashboard"
			>
				Dashboard
			</Link>
			<Link
				className={`p-2 ${
					pathname === "/settings" ? "bg-primary text-white" : ""
				} rounded-lg`}
				href="/settings"
			>
				Settings
			</Link>
		</nav>
	);
}

export default Nav;
