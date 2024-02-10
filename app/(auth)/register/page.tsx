import { RegisterForm } from "@/features/auth/register/RegisterForm";
import React from "react";
function page() {
	return (
		<div className="w-full p-20 flex justify-center items-center flex-col gap-2">
			<RegisterForm />
		</div>
	);
}

export default page;
