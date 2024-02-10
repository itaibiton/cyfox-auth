"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

function Providers({ children }: { children: React.ReactNode }) {
	console.log("here se");

	return <SessionProvider>{children}</SessionProvider>;
}

export default Providers;
