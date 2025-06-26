import { Suspense } from "react";
import { Outlet } from "react-router";
import type { RouteObject } from "react-router";

const authCustom: RouteObject[] = [];

export const authRoutes: RouteObject[] = [
	{
		path: "auth",
		element: (
			<Suspense>
				<Outlet />
			</Suspense>
		),
		children: [...authCustom],
	},
];
