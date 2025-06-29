import { useOrganizationUnitsApi } from "@/api";
import { Icon } from "@/components/icon";
import PageHeader from "@/components/page-header";
import type { TreeNodeWithData } from "@/components/tree";
import type { OrganizationUnitDto } from "@/types/organization-units";
import { ScrollArea } from "@/ui/scroll-area";
import { useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "sonner";
import OrganizationUnitMemberSelectionDialog from "./member-selection-dialog";
import OrganizationUnitMemberTable, { type OrganizationUnitMemberTableRef } from "./member-table";
import OrganizationUnitTree from "./organization-unit-tree";

const { addMembers } = useOrganizationUnitsApi();

export default () => {
	const { t } = useTranslation();

	const tableRef = useRef<OrganizationUnitMemberTableRef>(null);

	const [selectedNode, setSelectedNode] = useState<TreeNodeWithData<OrganizationUnitDto> | null>(null);
	const [addMemberDialogOpened, setAddMemberDialogOpened] = useState<boolean>();

	// 部门切换时
	const onSelect = (node: TreeNodeWithData<OrganizationUnitDto>) => {
		setSelectedNode(node);
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
							<OrganizationUnitTree onSelect={onSelect} selectedKey={selectedNode?.key} />
						</ScrollArea>
					</div>
					<div className="flex-1 w-full h-full max-w-full max-h-full overflow-hidden">
						<div className="flex gap-y-2 w-full h-full flex-col overflow-hidden">
							{selectedNode ? (
								<OrganizationUnitMemberTable
									ref={tableRef}
									organizationUnit={selectedNode?.data as OrganizationUnitDto}
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
