import { Icon } from "@/components/icon";
import { GLOBAL_CONFIG } from "@/global-config";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { useOidc, useOidcUser } from "@axa-fr/react-oidc";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

/**
 * Account Dropdown
 */
export default function AccountDropdown() {
	const { oidcUser } = useOidcUser();
	const { logout } = useOidc();
	const { t } = useTranslation();

	const { preferred_username, name, family_name } = oidcUser || {};

	const handleLogout = async () => {
		await logout();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<Avatar className="size-6">
						<AvatarImage src="" />
						<AvatarFallback>
							<Icon icon="lucide:user-round" />
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<div className="flex items-center gap-2 p-2">
					<Avatar className="size-10">
						<AvatarImage src="" />
						<AvatarFallback>
							<Icon icon="lucide:user-round" />
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col items-start">
						<div className="text-text-primary text-sm font-medium">
							{name} {family_name}
						</div>
						<div className="text-text-secondary text-xs">{preferred_username}</div>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<NavLink to="https://docs-admin.slashspaces.com/" target="_blank">
						{t("sys.docs")}
					</NavLink>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<NavLink to={`${GLOBAL_CONFIG.authority}/manage/profile`} target="_blank">
						{t("sys.nav.user.profile")}
					</NavLink>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="font-bold text-warning" onClick={handleLogout}>
					{t("sys.login.logout")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
