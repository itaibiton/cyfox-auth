import React from "react";

type Props = {
	children: React.ReactNode;
};

function layout({ children }: Props) {
	return (
		<div className="bg-red-500 flex flex-col w-screen min-h-screen">
			{children}
		</div>
	);
}

export default layout;
