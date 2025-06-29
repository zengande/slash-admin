import { useOrganizationUnitsApi } from "@/api";
import { Icon } from "@/components/icon";
import LoadingOverlay from "@/components/loading-overlay";
import type { TreeNode, TreeNodeWithData } from "@/components/tree";
import Tree from "@/components/tree";
import { useSet } from "@/hooks/use-set";
import type { OrganizationUnitDto } from "@/types/organization-units";
import { cn } from "@/utils";
import { Button, Dropdown, type MenuProps } from "antd";
import { useEffect, useState } from "react";

const { getRootListApi, getChildrenApi } = useOrganizationUnitsApi();

const toTreeNode = (item: OrganizationUnitDto): TreeNodeWithData<OrganizationUnitDto> => ({
	key: item.id,
	title: `[${item.code}] ${item.displayName}`,
	parentId: item.parentId || null,
	children: undefined,
	data: item,
});

const addChildrenToTree = (
	tree: TreeNodeWithData<OrganizationUnitDto>[],
	parentId: string,
	children: TreeNodeWithData<OrganizationUnitDto>[],
): TreeNodeWithData<OrganizationUnitDto>[] => {
	if (typeof parentId === "undefined" || parentId === "" || parentId === null) return children;
	return tree.map((node) => {
		if (node.key === parentId) {
			node.children = children;
		} else if (node.children) {
			node.children = addChildrenToTree(node.children, parentId, children);
		}
		return node;
	});
};

const useOrganizationUnitTreeState = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [treeData, setTreeData] = useState<TreeNodeWithData<OrganizationUnitDto>[]>([]);

	const getTreeNodes = async (parentId?: string): Promise<TreeNodeWithData<OrganizationUnitDto>[]> => {
		let tree: TreeNodeWithData<OrganizationUnitDto>[] = [];

		if (parentId) {
			const data = await getChildrenApi({ id: parentId });
			const children = data?.items.map(toTreeNode);
			tree = addChildrenToTree(treeData, parentId, children || []);
			setTreeData(tree);
		} else {
			// load root orgs
			setLoading(true);

			try {
				const data = await getRootListApi();
				tree = data?.items.map(toTreeNode) ?? [];
				setTreeData(tree);
			} finally {
				setLoading(false);
			}
		}

		return tree;
	};

	return {
		loading,
		treeData,
		getTreeNodes,
	};
};

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
	selectedKey?: string;

	onSelect?: (node: TreeNode) => void;
}

const OrganizationUnitTree = ({ selectedKey, onSelect, onAdd, onEdit, onDelete }: OrganizationUnitTreeProps & OrganizationUnitNodeActions) => {
	const expandedKeys = useSet<string>([]);
	const { loading: isLoadingRootDepartment, treeData, getTreeNodes } = useOrganizationUnitTreeState();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getTreeNodes().then((tree) => {
			const first = tree.at(0);
			first && onSelect?.(first);
		});
	}, []);

	// 处理展开/折叠操作
	const onExpand = (node: TreeNodeWithData<OrganizationUnitDto>, expanded: boolean) => {
		if (expanded) {
			expandedKeys.add(node.key);
		} else {
			expandedKeys.delete(node.key);
		}
	};

	// 加载子部门列表
	const loadChildDepartments = async ({ key }: TreeNodeWithData<OrganizationUnitDto>) => {
		await getTreeNodes(key);
	};

	if (isLoadingRootDepartment) {
		return <LoadingOverlay visible />;
	}

	return (
		<Tree
			onSelect={onSelect}
			onLoadData={loadChildDepartments}
			onExpand={onExpand}
			selectedKey={selectedKey}
			expandedKeys={expandedKeys}
			renderMoreMenu={(node) => <MoreMenu item={node} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />}
			treeData={treeData}
		/>
	);
};

export default OrganizationUnitTree;
