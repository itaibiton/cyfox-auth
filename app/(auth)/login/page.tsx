import Image from "next/image";
import { LoginForm } from "@/features/login/LoginForm";
import React from "react";
function page() {
	return (
		<div className="w-full p-20 flex justify-center">
			<LoginForm />
		</div>
	);
}

export default page;
