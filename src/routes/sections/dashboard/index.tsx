import { LineLoading } from "@/components/loading";
import { GLOBAL_CONFIG } from "@/global-config";
import DashboardLayout from "@/layouts/dashboard";
import { Suspense } from "react";
import { Navigate, type RouteObject } from "react-router";
import { backendDashboardRoutes } from "./backend";
import { frontendDashboardRoutes } from "./frontend";
import { OidcSecure } from "@axa-fr/react-oidc";

const getRoutes = (): RouteObject[] => {
	if (GLOBAL_CONFIG.routerMode === "frontend") {
		return frontendDashboardRoutes;
	}
	return backendDashboardRoutes;
};

export const dashboardRoutes: RouteObject[] = [
	{
		element: (
			<OidcSecure>
				<Suspense fallback={<LineLoading />}>
					<DashboardLayout />
				</Suspense>
			</OidcSecure>
		),
		children: [{ index: true, element: <Navigate to={GLOBAL_CONFIG.defaultRoute} replace /> }, ...getRoutes()],
	},
];
