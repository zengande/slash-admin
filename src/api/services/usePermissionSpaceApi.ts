import type { ListResultDto, PagedResultDto } from "@/types/abp";

import type { CreatePermissionSpaceInput, GetPermissionSpaceListInput, PermissionSpaceDto, UpdatePermissionSpaceInput } from "@/types/permission-spaces";

import { useRequest } from "@/request";

export function usePermissionSpaceApi() {
	const { cancel, request } = useRequest();

	/**
	 * 获取权限空间选择列表
	 * @param includeBuiltIn 是否包含内置权限空间
	 * @returns 权限空间选择列表
	 */
	function getSelectionApi(includeBuiltIn = false) {
		return request<ListResultDto<PermissionSpaceDto>>("/api/am/permission-space/selection", {
			method: "GET",
			params: { includeBuiltIn },
		});
	}

	/**
	 * 查询权限空间
	 * @param input
	 * @returns 用户权限空间列表
	 */
	function getPagedListApi(input?: GetPermissionSpaceListInput): Promise<PagedResultDto<PermissionSpaceDto>> {
		return request<PagedResultDto<PermissionSpaceDto>>("/api/am/permission-space", {
			method: "GET",
			params: input,
		});
	}

	/**
	 * 创建权限空间
	 * @param input
	 */
	function createApi(input: CreatePermissionSpaceInput): Promise<void> {
		return request("/api/am/permission-space", {
			data: input,
			method: "POST",
		});
	}

	/**
	 * 更新权限空间
	 * @param id
	 * @param input
	 */
	function updateApi(id: string, input: UpdatePermissionSpaceInput): Promise<void> {
		return request(`/api/am/permission-space/${id}`, {
			data: input,
			method: "PUT",
		});
	}

	return {
		cancel,
		createApi,
		getPagedListApi,
		getSelectionApi,
		updateApi,
	};
}
