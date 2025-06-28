import type React from "react";

import emptyIcon from "@/assets/icons/empty.png";

export interface EmptyProps {
	children?: React.ReactNode;
	id?: string;
	isEmpty?: boolean;
	image?: string;
	description?: string;
}
const Empty = ({ isEmpty = false, image, description, children }: EmptyProps) => {
	if (isEmpty) {
		<div className="w-full">
			<div className="my-16">
				{image ?? <img src={emptyIcon} className="mx-auto w-48" alt="empty" />}
				{description && <p className="text-center text-gray-400 text-sm mt-4">{description}</p>}
			</div>
		</div>;
	}

	return children;
};

export default Empty;
