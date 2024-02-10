"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import React, { useState } from "react";

function SignOutBtn() {
	const [loading, setLoading] = useState(false);

	const handleLogout = () => {
		setLoading(true);
		signOut();
	};

	return (
		<Button
			type="submit"
			disabled={loading}
			onClick={handleLogout}
			className="w-40"
		>
			{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log out"}
		</Button>
	);
}

export default SignOutBtn;
