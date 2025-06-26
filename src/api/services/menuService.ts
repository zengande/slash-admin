import type { Menu } from "#/entity";
import { requestClient } from "@/request";

export enum MenuApi {
	Menu = "/menu",
}

const getMenuList = () => requestClient.get<Menu[]>(MenuApi.Menu);

export default {
	getMenuList,
};
