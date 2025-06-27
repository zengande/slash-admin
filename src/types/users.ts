import type { ExtensibleObject, FullAuditedEntityDto, PagedAndSortedResultRequestDto } from "./abp";
import type { IHasConcurrencyStamp, IHasExtraProperties } from "./global";

export function getFullname(user: IUser): string {
	if (user.surname && user.name) {
		return `${user.surname} ${user.name}`;
	}
	if (user.name) {
		return user.name;
	}
	if (user.surname) {
		return user.surname;
	}

	return "";
}

/** 用户对象接口 */
interface IUser {
	/** 邮件地址 */
	email: string;
	/** 登录锁定 */
	lockoutEnabled: boolean;
	/** 用户名 */
	name: string;
	/** 联系方式 */
	phoneNumber?: string;
	/** 用户简称 */
	surname?: string;
	/** 双因素验证 */
	twoFactorEnabled: boolean;
	/** 用户账户 */
	userName: string;
}

/** 更改密码数据传输对象 */
interface ChangeMyPasswordInput {
	/** 当前密码 */
	currentPassword?: string;
	/** 新密码 */
	newPassword: string;
}

interface ChangeUserPasswordInput {
	/** 新密码 */
	password: string;
}

/** 用户组织机构数据传输对象 */
interface IdentityUserOrganizationUnitUpdateDto {
	/** 组织机构标识列表 */
	organizationUnitIds: string[];
}
/** 用户实体数据传输对象 */
interface IdentityUserDto extends FullAuditedEntityDto<string>, IHasConcurrencyStamp, IHasExtraProperties, IUser {
	[key: string]: any;
	/** 邮箱已验证 */
	emailConfirmed: boolean;
	/** 已激活的用户 */
	isActive: boolean;
	/** 锁定截止时间 */
	lockoutEnd?: Date;
	/** 联系方式已验证 */
	phoneNumberConfirmed: boolean;
	/** 角色列表 */
	roleNames: string[];
	/** 租户标识 */
	tenentId?: string;
}
/** 创建或更新用户实体数据传输对象 */
interface IdentityUserCreateOrUpdateDto extends ExtensibleObject {
	/** 邮件地址 */
	email: string;
	isActive?: boolean;
	/** 登录锁定 */
	lockoutEnabled: boolean;
	/** 用户名 */
	name: string;
	/** 密码 */
	password?: string;
	/** 联系方式 */
	phoneNumber?: string;
	/** 角色列表 */
	roleNames?: string[];
	/** 用户简称 */
	surname?: string;
	/** 用户账户 */
	userName: string;
}
/** 获取用户分页列表数据传输对象 */
interface GetUserPagedListInput extends PagedAndSortedResultRequestDto {
	/** 过滤条件 */
	filter?: string;
}

type IdentityUserCreateDto = {
	/** 要求下次登录必须修改密码 */
	shouldChangePasswordOnNextLogin: boolean;
} & IdentityUserCreateOrUpdateDto;
type IdentityUserUpdateDto = IdentityUserCreateOrUpdateDto;

interface UserLookupCountInput {
	filter?: string;
}

interface UserLookupSearchInput extends PagedAndSortedResultRequestDto, UserLookupCountInput {}

export type {
	ChangeMyPasswordInput,
	ChangeUserPasswordInput,
	GetUserPagedListInput,
	IdentityUserCreateDto,
	IdentityUserDto,
	IdentityUserOrganizationUnitUpdateDto,
	IdentityUserUpdateDto,
	UserLookupCountInput,
	UserLookupSearchInput,
};
