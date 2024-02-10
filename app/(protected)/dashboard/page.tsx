import SignOutBtn from "@/components/sign-out-button";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

async function page() {
	const session = await getServerSession();
	if (!session) notFound();

	console.log("session!", session);

	return (
		<div className="flex items-center justify-center flex-col gap-4 p-24">
			Logged in as {session?.user?.email}
			<SignOutBtn />
		</div>
	);
}

export default page;
