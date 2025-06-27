import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from "./abp";

export interface PermissionSpaceDto extends AuditedEntityDto<string> {
	/** 权限空间Code */
	code: string;
	/** 权限空间描述 */
	description?: string;
	/** 是否是系统内置 */
	isBuiltIn?: boolean;
	/** 权限空间名称 */
	name: string;
}

export interface GetPermissionSpaceListInput extends PagedAndSortedResultRequestDto {
	/** 过滤条件 */
	filter?: string;
}

interface PermissionSpaceCreateOrUpdateInput {
	/** 权限空间描述 */
	description?: string;
	/** 权限空间名称 */
	name: string;
}

export interface CreatePermissionSpaceInput extends PermissionSpaceCreateOrUpdateInput {
	/** 权限空间Code */
	code: string;
}

export interface UpdatePermissionSpaceInput extends PermissionSpaceCreateOrUpdateInput {
	// add filed in here if needed
	[key: string]: any;
}
