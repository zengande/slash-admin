import type { AuditedEntityDto, EntityDto, PagedAndSortedResultRequestDto } from "./abp";

export interface MenuResourceDto extends AuditedEntityDto<string> {
	code: string;
	name: string;
	permissionSpaceId: string;
}

export interface MenuResourceUpsertInput {
	code: string;
	description?: string;
	name: string;
	permissionSpaceId: string;
}

export interface GetMenuResourceListInput extends PagedAndSortedResultRequestDto {
	/** 过滤条件 */
	filter?: string;
}

export interface MenuItemDto extends EntityDto<string> {}
