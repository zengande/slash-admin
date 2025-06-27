import { useOrganizationUnitsApi } from "@/api";
import { Icon } from "@/components/icon";
import LoadingOverlay from "@/components/loading-overlay";
import type { OrganizationUnitDto } from "@/types/organization-units";
import { type UserIncludeOrganizationUnitsDto, getFullname } from "@/types/users";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

import "./member-table.css";

interface OrganizationUnitMemberTableProps {
	organizationUnitId: string;
	organizationUnitName: string;
}

export default function OrganizationUnitMemberTable({ organizationUnitId, organizationUnitName }: OrganizationUnitMemberTableProps) {
	const { getUserListApi } = useOrganizationUnitsApi();

	const [loading, setLoading] = useState<boolean>();
	const [members, setMembers] = useState<UserIncludeOrganizationUnitsDto[]>([]);
	const [onlyDirectMembers, setOnlyDirectMembers] = useState<boolean>(true);

	// 部门切换时重新拉取部门用户列表
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchMembers();
	}, [onlyDirectMembers, organizationUnitId]);

	const fetchMembers = () => {
		if (!organizationUnitId) {
			setMembers([]);
			return;
		}

		setLoading(true);
		getUserListApi(organizationUnitId, { onlyDirectMembers })
			.then((rsp) => {
				setMembers(rsp.items);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const onAddMember = () => {};

	const columns: ColumnsType<UserIncludeOrganizationUnitsDto> = [
		{
			title: "Name",
			dataIndex: "name",
			width: 300,
			render: (_, record) => {
				return (
					<div className="flex">
						<img alt="" src={record.avatar} className="h-10 w-10 rounded-full" />
						<div className="py-1 ml-2 flex flex-col justify-between">
							<span className="text-sm">{getFullname(record)}</span>
							<span className="text-xs text-text-secondary">{record.userName}</span>
						</div>
					</div>
				);
			},
		},
		{
			title: "Email",
			dataIndex: "email",
			width: 200,
			render: (email) => <span className="text-sm">{email}</span>,
		},
		{
			title: "Phone",
			dataIndex: "phoneNumber",
			width: 150,
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
			width: 150,
			render: (organizationUnits) =>
				organizationUnits.length ? (
					<div>
						{organizationUnits.map((ou: OrganizationUnitDto) => (
							<Badge key={ou.id}>{ou.displayName}</Badge>
						))}
					</div>
				) : (
					"-"
				),
		},
	];

	return (
		<div className="flex flex-col w-full h-full max-h-full relative gap-4 overflow-hidden">
			<div className="flex-none flex items-center justify-between h-8 mb-2 text-sm">
				<div className="flex-1 flex gap-x-4 pl-1">
					<span className="font-semibold">{organizationUnitName}</span>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center text-gray-500 gap-x-1 text-xs ">
									<Icon size={16} icon="lucide:users" />
									{members.length}
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<div>{members.length} 成员</div>
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
				<LoadingOverlay visible={loading} />
				<Table rowKey="id" size="middle" columns={columns} dataSource={members} pagination={false} scroll={{ y: "calc(100% - 55px)" }} />
			</div>
		</div>
	);
}
