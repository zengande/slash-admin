import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import { Component } from "./utils";

export const frontendDashboardRoutes: RouteObject[] = [
	{ path: "workbench", element: Component("/pages/dashboard/workbench") },
	{ path: "analysis", element: Component("/pages/dashboard/analysis") },
	{
		path: "org",
		children: [
			{ index: true, element: <Navigate to="users" replace /> },
			{ path: "users", element: Component("/pages/org/users") },
			{ path: "user/:id", element: Component("/pages/org/users/detail") },
			{ path: "organization-units", element: Component("/pages/org/organization-units") },
		],
	},
	{
		path: "permissions",
		children: [
			{ index: true, element: <Navigate to="spaces" replace /> },
			{ path: "spaces", element: Component("/pages/permissions/spaces") },
		],
	},
];
