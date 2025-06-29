import { useOrganizationUnitsApi } from "@/api";
import { Icon } from "@/components/icon";
import type { OrganizationUnitDto } from "@/types/organization-units";
import { type UserIncludeOrganizationUnitsDto, getFullname } from "@/types/users";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import "./member-table.css";
import { Persona } from "@/components/persona";

interface OrganizationUnitMemberTableProps {
	organizationUnit: OrganizationUnitDto;
	onAddMember?: () => void;
}

export interface OrganizationUnitMemberTableRef {
	refresh: () => void;
}

const OrganizationUnitMemberTable = forwardRef<OrganizationUnitMemberTableRef, OrganizationUnitMemberTableProps>(({ organizationUnit, onAddMember }, ref) => {
	const { getUserListApi } = useOrganizationUnitsApi();

	const [loading, setLoading] = useState<boolean>();
	const [members, setMembers] = useState<UserIncludeOrganizationUnitsDto[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [onlyDirectMembers, setOnlyDirectMembers] = useState<boolean>(true);

	// 部门切换时重新拉取部门用户列表
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchMembers();
	}, [onlyDirectMembers, organizationUnit]);

	const fetchMembers = async () => {
		if (!organizationUnit) return;

		setLoading(true);
		setTotal(0);
		setMembers([]);

		try {
			const rsp = await getUserListApi(organizationUnit.id, { onlyDirectMembers, includeDetails: true });

			setMembers(rsp.items);
			setTotal(rsp.items.length);
		} finally {
			setLoading(false);
		}
	};

	useImperativeHandle(ref, () => ({
		refresh() {
			fetchMembers();
		},
	}));

	const columns: ColumnsType<UserIncludeOrganizationUnitsDto> = [
		{
			title: "Name",
			dataIndex: "name",
			width: 260,
			render: (_, record) => {
				return <Persona size="lg" avatarSrc={record.avatar} nickname={getFullname(record)} username={record.userName} />;
			},
		},
		{
			title: "Email",
			dataIndex: "email",
			width: 160,
			render: (email) => <span className="text-sm">{email}</span>,
		},
		{
			title: "Phone",
			dataIndex: "phoneNumber",
			width: 160,
			render: (phoneNumber, record) => (
				<div className="flex items-center gap-x-0.5">
					<span className="text-sm">{phoneNumber || "-"}</span>
					{record.phoneNumberConfirmed && <Icon icon="solar:verified-check-line-duotone" size={18} className="text-primary!" />}
				</div>
			),
		},
		{
			title: "Organization Units",
			dataIndex: "organizationUnits",
			render: (organizationUnits) =>
				organizationUnits.length ? (
					<div className="truncate space-x-1">
						{organizationUnits.map((ou: OrganizationUnitDto) => (
							<Badge variant="outline" key={ou.id}>
								{ou.displayName}
							</Badge>
						))}
					</div>
				) : (
					"-"
				),
		},
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
		},
	];

	return (
		<div className="flex flex-col w-full h-full max-h-full relative gap-4 overflow-hidden">
			<div className="flex-none flex items-center justify-between h-8 mb-2 text-sm">
				<div className="flex-1 flex gap-x-4 pl-1">
					<span className="font-semibold">{organizationUnit.displayName}</span>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center gap-x-1 text-sm cursor-pointer">
									<Icon size={16} icon="lucide:users" />
									{total}
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<div>{total} 成员</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<label className="select-none flex items-center gap-x-1 cursor-pointer">
						<input
							type="checkbox"
							checked={onlyDirectMembers}
							disabled={loading}
							onChange={(e) => {
								setOnlyDirectMembers(e.target.checked);
							}}
						/>
						仅展示部门的直属成员
					</label>
				</div>
				<Button variant="link" onClick={onAddMember}>
					<Icon size={16} icon="lucide:plus" />
					<span>添加成员</span>
				</Button>
			</div>
			<div className="flex-1 overflow-hidden relative">
				<Table loading={loading} rowKey="id" size="middle" columns={columns} dataSource={members} pagination={false} scroll={{ y: "calc(100% - 55px)" }} />
			</div>
		</div>
	);
});

export default OrganizationUnitMemberTable;
