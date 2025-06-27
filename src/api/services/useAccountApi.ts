import { useRequest } from "@/request";
import type { GrantMenuItem } from "@/types/account";

export function useAccountApi() {
	const { cancel, request } = useRequest();

	function getGrantMenus(): Promise<GrantMenuItem[]> {
		return request<GrantMenuItem[]>("/api/am/account/grant-menus?menuResourceCode=bedrock", {
			method: "GET",
		});
	}

	return {
		cancel,
		getGrantMenus,
	};
}
