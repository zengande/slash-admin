/** 远程服务验证错误描述 */
interface RemoteServiceValidationErrorInfo {
	/** 字段名称列表 */
	members: string[];
	/** 错误消息 */
	message: string;
}
/** 远程服务错误描述（仅适用于接口代理） */
interface RemoteServiceErrorInfo {
	/** 错误代码 */
	code?: string;
	/** 异常数据 */
	data?: { [key: string]: any };
	/** 错误详情 */
	details?: string;
	/** 错误消息 */
	message?: string;
	/** 验证错误列表 */
	validationErrors: RemoteServiceValidationErrorInfo[];
}

export type { RemoteServiceErrorInfo };
