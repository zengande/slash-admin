import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const frontendNavData: NavProps["data"] = [
	{
		name: "sys.nav.dashboard",
		items: [
			{
				title: "sys.nav.workbench",
				path: "/workbench",
				icon: <Icon icon="local:ic-workbench" size="24" />,
			},
			{
				title: "sys.nav.analysis",
				path: "/analysis",
				icon: <Icon icon="local:ic-analysis" size="24" />,
			},
		],
	},
	{
		name: "sys.nav.org.index",
		items: [
			{
				title: "sys.nav.org.users",
				path: "/org/users",
				icon: <Icon icon="solar:user-bold-duotone" size="24" />,
			},
			{
				title: "sys.nav.org.organization_units",
				path: "/org/organization-units",
				icon: <Icon icon="uim:briefcase" size="24" />,
			},
		],
	},
	{
		name: "sys.nav.permissions.index",
		items: [
			{
				title: "sys.nav.permissions.spaces",
				path: "/permissions/spaces",
				icon: <Icon icon="solar:folder-security-bold-duotone" size="24" />,
			},
			{
				title: "sys.nav.permissions.roles",
				path: "/permissions/roles",
				icon: <Icon icon="solar:shield-user-bold-duotone" size="24" />,
			},
			{
				title: "sys.nav.permissions.menu_resources",
				path: "/permissions/menu-resources",
				icon: <Icon icon="solar:checklist-minimalistic-bold-duotone" size="24" />,
			},
		],
	},
	{
		name: "sys.nav.openiddict.index",
		items: [
			{
				title: "sys.nav.openiddict.applications",
				path: "/openiddict/applications",
				icon: <Icon icon="solar:bag-4-bold-duotone" size="24" />,
			},
		],
	},
	{
		name: "sys.nav.platform.index",
		items: [
			{
				title: "sys.nav.platform.settings",
				path: "/platform/settings",
				icon: <Icon icon="solar:settings-bold-duotone" size="24" />,
			},
		],
	},
];
