import { useOrganizationUnitsApi } from "@/api";
import { Icon } from "@/components/icon";
import LoadingOverlay from "@/components/loading-overlay";
import PageHeader from "@/components/page-header";
import type { TreeNodeWithData } from "@/components/tree";
import { useSet } from "@/hooks/use-set";
import type { OrganizationUnitDto } from "@/types/organization-units";
import { ScrollArea } from "@/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "sonner";
import OrganizationUnitMemberSelectionDialog from "./member-selection-dialog";
import OrganizationUnitMemberTable, { type OrganizationUnitMemberTableRef } from "./member-table";
import OrganizationUnitTree from "./organization-unit-tree";

const { getRootListApi, getChildrenApi, addMembers } = useOrganizationUnitsApi();

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

	const getTreeNodes = async (parentId?: string) => {
		let tree: TreeNodeWithData<OrganizationUnitDto>[] = [];

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

	const tableRef = useRef<OrganizationUnitMemberTableRef>(null);

	const [selectedNode, setSelectedNode] = useState<TreeNodeWithData<OrganizationUnitDto> | null>(null);
	const expandedKeys = useSet<string>([]);
	const [addMemberDialogOpened, setAddMemberDialogOpened] = useState<boolean>();

	const { loading: isLoadingRootDepartment, treeData, getTreeNodes } = useOrganizationUnitTreeState();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getTreeNodes(undefined);
	}, []);

	// 部门切换时
	const onSelect = (node: TreeNodeWithData<OrganizationUnitDto>) => {
		setSelectedNode(node);
	};

	// 处理展开/折叠操作
	const onExpand = (node: TreeNodeWithData<OrganizationUnitDto>, expanded: boolean) => {
		if (expanded) {
			expandedKeys.add(node.key);
		} else {
			expandedKeys.delete(node.key);
		}
	};

	// 加载子部门列表
	const loadChildDepartments = async ({ key, children }: TreeNodeWithData<OrganizationUnitDto>) => {
		if (children) return;

		await getTreeNodes(key);
	};

	const handleAddMembers = (organizationUnitId: string, userIds: string[]) => {
		addMembers(organizationUnitId, {
			userIds,
		})
			.then(() => {
				setAddMemberDialogOpened(false);
				toast.success("Users added");
			})
			.finally(() => {
				tableRef?.current?.refresh();
			});
	};

	return (
		<>
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
								<OrganizationUnitMemberTable
									ref={tableRef}
									organizationUnitId={selectedNode?.key}
									organizationUnitName={selectedNode?.title}
									onAddMember={() => setAddMemberDialogOpened(true)}
								/>
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
			<OrganizationUnitMemberSelectionDialog
				opened={addMemberDialogOpened}
				onOpenChange={setAddMemberDialogOpened}
				organizationUnit={selectedNode?.data as OrganizationUnitDto}
				onSubmit={handleAddMembers}
			/>
		</>
	);
};
