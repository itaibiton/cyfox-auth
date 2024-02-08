import { RegisterForm } from "@/features/register/RegisterForm";
import Link from "next/link";
import React from "react";
function page() {
	return (
		<div className="w-full p-20 flex justify-center items-center flex-col gap-2">
			<RegisterForm />
		</div>
	);
}

export default page;
