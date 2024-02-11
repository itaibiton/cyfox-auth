import SessionProvider from "@/components/session-provider";
import Providers from "@/components/ui/providers";
import { ModeToggle } from "@/components/ui/theme-swtich";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Cyfox auth",
	description: "Cyfox authentication system",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<title>Auth system</title>
			</head>
			<body className={inter.className}>
				<SessionProvider session={session}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
						<Toaster />
						<div className="absolute right-2 top-2">
							<ModeToggle />
						</div>
					</ThemeProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
