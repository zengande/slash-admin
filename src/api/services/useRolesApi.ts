import type { PagedResultDto } from "@/types/abp";

import type { GetRolePagedListInput, IdentityRoleCreateDto, IdentityRoleDto, IdentityRoleUpdateDto } from "@/types/roles";

import { useRequest } from "@/request";

export function useRolesApi() {
	const { cancel, request } = useRequest();
	/**
	 * 新增角色
	 * @param input 参数
	 * @returns 角色实体数据传输对象
	 */
	function createApi(input: IdentityRoleCreateDto): Promise<IdentityRoleDto> {
		return request<IdentityRoleDto>("/api/am/role", {
			data: input,
			method: "POST",
		});
	}

	/**
	 * 删除角色
	 * @param id 角色id
	 */
	function deleteApi(id: string): Promise<void> {
		return request(`/api/am/role/${id}`, {
			method: "DELETE",
		});
	}

	/**
	 * 查询角色
	 * @param id 角色id
	 * @returns 角色实体数据传输对象
	 */
	function getApi(id: string): Promise<IdentityRoleDto> {
		return request<IdentityRoleDto>(`/api/am/role/${id}`, {
			method: "GET",
		});
	}

	/**
	 * 更新角色
	 * @param id 角色id
	 * @returns 角色实体数据传输对象
	 */
	function updateApi(id: string, input: IdentityRoleUpdateDto): Promise<IdentityRoleDto> {
		return request<IdentityRoleDto>(`/api/am/role/${id}`, {
			data: input,
			method: "PUT",
		});
	}

	/**
	 * 查询角色分页列表
	 * @param input 过滤参数
	 * @returns 角色实体数据传输对象分页列表
	 */
	function getPagedListApi(input?: GetRolePagedListInput): Promise<PagedResultDto<IdentityRoleDto>> {
		return request<PagedResultDto<IdentityRoleDto>>("/api/am/role", {
			method: "GET",
			params: input,
		});
	}

	/**
	 * 从组织机构中移除角色
	 * @param id 角色id
	 * @param ouId 组织机构id
	 */
	function removeOrganizationUnitApi(id: string, ouId: string): Promise<void> {
		return request(`/api/am/role/${id}/organization-units/${ouId}`, {
			method: "DELETE",
		});
	}

	return {
		cancel,
		createApi,
		deleteApi,
		getApi,
		getPagedListApi,
		removeOrganizationUnitApi,
		updateApi,
	};
}
