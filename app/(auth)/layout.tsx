import React from "react";
import Image from "next/image";

type Props = {
	children: React.ReactNode;
};

function layout({ children }: Props) {
	return (
		<div className="w-full min-h-screen bg-background flex">
			<div className="w-full p-8 lg:p-20 bg-card hidden lg:flex flex-col justify-between min-h-full">
				<Image
					src="./cyfox.svg"
					alt="logo"
					width="200"
					height="80"
					className="h-14 scale-110"
				/>
				<p>
					Best AI-Driven, End-to-End Cybersecurity Solutions for Your Business
					Utilize machine learning to automatically detect cyber-attacks.
				</p>
			</div>
			<div className="w-full flex justify-center bg-card lg:bg-background min-h-full">
				{children}
			</div>
		</div>
	);
}

export default layout;
