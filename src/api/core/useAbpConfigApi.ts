import { useRequest } from "@/request";
import type { ApplicationConfigurationDto } from "@/types/abp";

export function useAbpConfigApi() {
	const { cancel, request } = useRequest();

	/**
	 * 获取应用程序配置信息
	 */
	function getConfigApi(options?: {
		includeLocalizationResources?: boolean;
	}): Promise<ApplicationConfigurationDto> {
		return request<ApplicationConfigurationDto>("/api/abp/application-configuration", {
			params: options,
			method: "GET",
		});
	}

	return {
		cancel,
		getConfigApi,
	};
}
