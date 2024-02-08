import Link from "next/link";
import React from "react";
function page() {
	return (
		<div className="w-full p-20 flex justify-center items-center flex-col gap-2">
			<p className="text-sm">
				<Link className="underline text-primary" href="/login">
					Login
				</Link>
			</p>
		</div>
	);
}

export default page;
