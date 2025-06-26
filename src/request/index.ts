export * from "./hooks";
export * from "./request-client";
export * from "axios";

import { GLOBAL_CONFIG } from "@/global-config";
import userStore from "@/store/userStore";
import { toast } from "sonner";
import { authenticateResponseInterceptor, errorMessageResponseInterceptor, RequestClient, type RequestClientOptions } from "./request-client";
import { useOAuthError, useWrapperResult } from "./hooks";

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
	const client = new RequestClient({
		...options,
		baseURL,
	});

	return client;
}

export const requestClient = createRequestClient(GLOBAL_CONFIG.baseApi, {
	// responseReturn: 'data',
});

export function initRequestClient() {
	/**
	 * 重新认证逻辑
	 */
	async function doReAuthenticate() {}

	/**
	 * 刷新token逻辑
	 */
	async function doRefreshToken() {
		return "";
	}

	function formatToken(token: null | string) {
		return token ? `Bearer ${token}` : null;
	}
	// 请求头处理
	requestClient.addRequestInterceptor({
		fulfilled: async (config) => {
			const { accessToken } = userStore.getState().userToken;
			if (accessToken) {
				config.headers.Authorization = formatToken(accessToken);
			}
			return config;
		},
	});

	// response数据解构
	requestClient.addResponseInterceptor<any>({
		fulfilled: (response) => {
			const { data, status } = response;
			const { hasWrapResult, getData } = useWrapperResult(response);

			if (hasWrapResult()) {
				return getData();
			}

			if (status >= 200 && status < 400) {
				return data;
			}

			throw Object.assign({}, response, { response });
		},
	});

	// token过期的处理
	requestClient.addResponseInterceptor(
		authenticateResponseInterceptor({
			client: requestClient,
			doReAuthenticate,
			doRefreshToken,
			enableRefreshToken: true,
			formatToken,
		}),
	);

	// 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
	requestClient.addResponseInterceptor(
		errorMessageResponseInterceptor((msg: string, error) => {
			// 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
			// 当前mock接口返回的错误字段是 error 或者 message
			const responseData = error?.response?.data ?? {};
			if (responseData?.error_description) {
				const { formatError } = useOAuthError();
				toast.error(formatError(responseData) || msg);
				return;
			}
			const errorMessage = responseData?.error?.details ?? responseData?.message ?? "";
			// 如果没有错误信息，则会根据状态码进行提示
			toast.error(errorMessage || msg);
		}),
	);
}
