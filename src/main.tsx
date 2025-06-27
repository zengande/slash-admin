import "./global.css";
import "./theme/theme.css";
import "./locales/i18n";
import { configuration } from "@/oidc";
import { initRequestClient } from "@/request";
import { OidcProvider } from "@axa-fr/react-oidc";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router";
import App from "./App";
import menuService from "./api/services/menuService";
import { registerLocalIcons } from "./components/icon";
import { GLOBAL_CONFIG } from "./global-config";
import PageError from "./pages/sys/error/PageError";
import { routesSection } from "./routes/sections";

initRequestClient();

await registerLocalIcons();

if (GLOBAL_CONFIG.routerMode === "backend") {
	await menuService.getMenuList();
}

const router = createBrowserRouter(
	[
		{
			Component: () => (
				<App>
					<Outlet />
				</App>
			),
			errorElement: <ErrorBoundary fallbackRender={PageError} />,
			children: routesSection,
		},
	],
	{
		basename: GLOBAL_CONFIG.basePath,
	},
);

function onEvent(configuration: string, name: string, data: any) {
	console.log("OIDC Event:", configuration, name, data);
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<OidcProvider configuration={configuration} onEvent={onEvent}>
		<RouterProvider router={router} />
	</OidcProvider>,
);
