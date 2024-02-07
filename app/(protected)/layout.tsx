import React from "react";

type Props = {
	children: React.ReactNode;
};

function layout({ children }: Props) {
	return (
		<div className="bg-green-500 flex flex-col w-screen min-h-screen">
			Protected layout
			{children}
		</div>
	);
}

export default layout;
