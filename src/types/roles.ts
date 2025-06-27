import type { PagedAndSortedResultRequestDto } from "./abp";
import type { IHasConcurrencyStamp } from "./global";

interface RoleDtoBase {
	displayName: string;
	name: string;
	permissionSpaceId: string;
}

interface IdentityRoleDto extends IHasConcurrencyStamp, RoleDtoBase {
	[key: string]: any;
	id: string;
}

interface GetRolePagedListInput extends PagedAndSortedResultRequestDto {
	filter?: string;
}

type IdentityRoleCreateDto = RoleDtoBase;

interface IdentityRoleUpdateDto extends IHasConcurrencyStamp, RoleDtoBase {}

interface ChangeRoleOrganizationUnitDto {
	organizationUnitIds: string[];
}

export type { ChangeRoleOrganizationUnitDto, GetRolePagedListInput, IdentityRoleCreateDto, IdentityRoleDto, IdentityRoleUpdateDto };
