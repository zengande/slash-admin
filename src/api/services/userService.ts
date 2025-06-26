import type { UserInfo, UserToken } from "#/entity";
import { requestClient } from "@/request";

export interface SignInReq {
	username: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
	SignIn = "/auth/signin",
	SignUp = "/auth/signup",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	User = "/user",
}

const signin = (data: SignInReq) => requestClient.post<SignInRes>(UserApi.SignIn, data);
const signup = (data: SignUpReq) => requestClient.post<SignInRes>(UserApi.SignUp, data);
const logout = () => requestClient.get(UserApi.Logout);
const findById = (id: string) => requestClient.get<UserInfo[]>(`${UserApi.User}/${id}`);

export default {
	signin,
	signup,
	findById,
	logout,
};
