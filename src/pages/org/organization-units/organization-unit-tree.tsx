import { Icon } from "@/components/icon";
import type { TreeNode, TreeProps } from "@/components/tree";
import Tree from "@/components/tree";
import { cn } from "@/utils";
import { Button, Dropdown, type MenuProps } from "antd";
import { useState } from "react";

interface OrganizationUnitNodeActions {
	onAdd?: (node: TreeNode) => void;
	onEdit?: (node: TreeNode) => void;
	onDelete?: (node: TreeNode) => void;
}

interface MoreMenuProps extends OrganizationUnitNodeActions {
	item: TreeNode;
}

const MoreMenu = ({ item }: MoreMenuProps) => {
	const [opened, setOpen] = useState(false);

	const nodeType = item.parentId ? "部门" : "组织";

	const menuItems: MenuProps["items"] = [
		{
			label: "添加子部门",
			key: "add",
		},
		{
			label: `编辑${nodeType}`,
			key: "edit",
		},
		{
			label: `删除${nodeType}`,
			key: "delete",
		},
	];

	const onMenuItemClick: MenuProps["onClick"] = () => {};

	return (
		<div className={cn("group-hover:block hidden", opened && "block")}>
			<Dropdown menu={{ items: menuItems, onClick: onMenuItemClick }} trigger={["click"]} placement="bottomLeft" open={opened} onOpenChange={setOpen}>
				<Button size="small" type="text" style={{ color: "unset", padding: "0px 4px", marginLeft: "4px" }}>
					<Icon icon="solar:menu-dots-bold-duotone" size={16} />
				</Button>
			</Dropdown>
		</div>
	);
};

interface OrganizationUnitTreeProps {
	treeData?: TreeNode[];

	selectedKey?: string;
	expandedKeys?: Set<string>;

	onLoadData?: (node: TreeNode) => Promise<void>;
	onExpand?: (node: TreeNode, expanded: boolean) => void;
	onSelect?: (node: TreeNode) => void;
}

const OrganizationUnitTree = ({
	treeData,
	selectedKey,
	expandedKeys,
	onSelect,
	onLoadData,
	onExpand,
	onAdd,
	onEdit,
	onDelete,
}: OrganizationUnitTreeProps & TreeProps & OrganizationUnitNodeActions) => {
	return (
		<Tree
			onSelect={onSelect}
			onLoadData={onLoadData}
			onExpand={onExpand}
			selectedKey={selectedKey}
			expandedKeys={expandedKeys}
			renderMoreMenu={(node) => <MoreMenu item={node} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />}
			treeData={treeData}
		/>
	);
};

export default OrganizationUnitTree;
