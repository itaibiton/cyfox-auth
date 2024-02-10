import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

async function page() {
	const session = await getServerSession();
	if (!session) notFound();

	console.log("session!", session);

	return <div>Dashboard {session?.user?.email}</div>;
}

export default page;
