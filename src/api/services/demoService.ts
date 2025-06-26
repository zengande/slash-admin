import { requestClient } from "@/request";

export enum DemoApi {
	TOKEN_EXPIRED = "/user/tokenExpired",
}

const mockTokenExpired = () => requestClient.post(DemoApi.TOKEN_EXPIRED);

export default {
	mockTokenExpired,
};
