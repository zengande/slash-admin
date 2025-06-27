import type { PagedResultDto } from "@/types/abp";

import type { GetMenuResourceListInput, MenuResourceDto, MenuResourceUpsertInput } from "@/types/menu-resources";

import { useRequest } from "@/request";

export function useMenuResourcesApi() {
	const { cancel, request } = useRequest();

	/**
	 * 查询菜单资源
	 * @param input
	 * @returns 菜单资源列表
	 */
	function getPagedListApi(input?: GetMenuResourceListInput): Promise<PagedResultDto<MenuResourceDto>> {
		return request<PagedResultDto<MenuResourceDto>>("/api/am/menu-resource", {
			method: "GET",
			params: input,
		});
	}

	/**
	 * 创建菜单资源
	 * @param input
	 */
	function createApi(input: MenuResourceUpsertInput): Promise<MenuResourceDto> {
		return request<MenuResourceDto>("/api/am/menu-resource", {
			data: input,
			method: "POST",
		});
	}

	return {
		cancel,
		getPagedListApi,
		createApi,
	};
}
