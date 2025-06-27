import { useOrganizationUnitsApi } from "@/api";
import { Icon } from "@/components/icon";
import LoadingOverlay from "@/components/loading-overlay";
import PageHeader from "@/components/page-header";
import type { TreeNode } from "@/components/tree";
import { useSet } from "@/hooks/use-set";
import type { OrganizationUnitDto } from "@/types/organization-units";
import { ScrollArea } from "@/ui/scroll-area";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import OrganizationUnitMemberTable from "./member-table";
import OrganizationUnitTree from "./organization-unit-tree";

const toTreeNode = (item: OrganizationUnitDto): TreeNode => ({
	key: item.id,
	title: `[${item.code}] ${item.displayName}`,
	parentId: item.parentId || null,
	children: undefined,
});

const addChildrenToTree = (tree: TreeNode[], parentId: string, children: TreeNode[]): TreeNode[] => {
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
	const { getRootListApi, getChildrenApi } = useOrganizationUnitsApi();

	const [loading, setLoading] = useState<boolean>(false);
	const [treeData, setTreeData] = useState<TreeNode[]>([]);

	const getTreeNodes = async (parentId?: string) => {
		let tree: TreeNode[] = [];

		if (parentId) {
			const data = await getChildrenApi({ id: parentId });
			const children = data?.items.map(toTreeNode);
			tree = addChildrenToTree(treeData, parentId, children || []);
		} else {
			setLoading(true);

			try {
				const data = await getRootListApi();

				tree = data?.items.map(toTreeNode) ?? [];
				setTreeData(tree);
			} finally {
				setLoading(false);
			}
		}

		console.log("getTreeNodes", parentId, tree);
		setTreeData(tree);
	};

	return {
		loading,
		treeData,
		getTreeNodes,
	};
};

export default () => {
	const { t } = useTranslation();
	const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
	const expandedKeys = useSet<string>([]);

	const { loading: isLoadingRootDepartment, treeData, getTreeNodes } = useOrganizationUnitTreeState();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getTreeNodes(undefined);
	}, []);

	// 部门切换时
	const onSelect = (node: TreeNode) => {
		setSelectedNode(node);
	};

	// 处理展开/折叠操作
	const onExpand = (node: TreeNode, expanded: boolean) => {
		if (expanded) {
			expandedKeys.add(node.key);
		} else {
			expandedKeys.delete(node.key);
		}
	};

	// 加载子部门列表
	const loadChildDepartments = async ({ key, children }: TreeNode) => {
		if (children) return;

		await getTreeNodes(key);
	};

	return (
		<div className="w-full h-full max-w-full max-h-full overflow-hidden flex flex-col">
			<PageHeader>
				<PageHeader.Content>
					<PageHeader.Title>
						<Trans t={t}>organization_units.page.header.title</Trans>
					</PageHeader.Title>
					<PageHeader.Description>
						<Trans t={t}>organization_units.page.header.description</Trans>
					</PageHeader.Description>
				</PageHeader.Content>
			</PageHeader>
			<div className="flex gap-8 w-full flex-1 overflow-hidden">
				<div className="flex flex-col border-r overflow-hidden w-80 min-w-80">
					<div className="flex gap-x-0.5 w-full items-center justify-start px-4 pb-4" />
					<ScrollArea className="flex-1 w-full max-w-full px-4 relative">
						<LoadingOverlay visible={isLoadingRootDepartment} />
						<OrganizationUnitTree
							onSelect={onSelect}
							onLoadData={loadChildDepartments}
							onExpand={onExpand}
							selectedKey={selectedNode?.key}
							expandedKeys={expandedKeys}
							treeData={treeData}
						/>
					</ScrollArea>
				</div>
				<div className="flex-1 w-full h-full max-w-full max-h-full overflow-hidden">
					<div className="flex gap-y-2 w-full h-full flex-col overflow-hidden">
						{selectedNode ? (
							<OrganizationUnitMemberTable organizationUnitId={selectedNode?.key} organizationUnitName={selectedNode?.title} />
						) : (
							<div className="flex flex-col h-full pt-12">
								<Icon icon="local:arrow-1" height="100" width="200" stroke="var(--mantine-color-gray-5)" />
								<span className="pl-5 text-gray-600 text-sm">
									<Trans t={t}>organization_units.page.noselected</Trans>
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
