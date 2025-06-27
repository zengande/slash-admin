import { useUsersApi } from "@/api";
import { Icon } from "@/components/icon";
import PageHeader from "@/components/page-header";
import { usePathname, useRouter } from "@/routes/hooks";
import { type IdentityUserDto, getFullname } from "@/types/users";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

const { getPagedListApi } = useUsersApi();

export default () => {
	const { t } = useTranslation();
	const { push } = useRouter();
	const pathname = usePathname();

	const [users, setUsers] = useState<IdentityUserDto[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(false);

	const columns: ColumnsType<IdentityUserDto> = [
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
				<div className="flex items-center gap-x-1">
					<span className="text-sm">{phoneNumber || "-"}</span>
					{record.phoneNumberConfirmed && (
						<Badge variant="success" className="text-xs">
							<Icon icon="solar:check-bold-duotone" size={14} />
						</Badge>
					)}
				</div>
			),
		},
		{
			title: "Two Factor Enabled",
			dataIndex: "twoFactorEnabled",
			align: "center",
			width: 150,
			render: (twoFactorEnabled) => <Badge variant={twoFactorEnabled ? "success" : "warning"}>{twoFactorEnabled ? "Yes" : "No"}</Badge>,
		},
		{
			title: "Status",
			dataIndex: "isActive",
			align: "center",
			width: 120,
			render: (isActive) => <Badge variant={isActive ? "success" : "error"}>{isActive ? "Active" : "Inactive"}</Badge>,
		},
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray-500">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							push(`${pathname}/${record.id}`);
						}}
					>
						<Icon icon="mdi:card-account-details" size={18} />
					</Button>
				</div>
			),
		},
	];

	const fetchData = (skipCount = 0, maxResultCount = 10) => {
		setLoading(true);

		getPagedListApi({
			maxResultCount,
			skipCount,
		}).then((rsp) => {
			setUsers(rsp.items);
			setTotalCount(rsp.totalCount);
			setLoading(false);
		});
	};

	useEffect(fetchData, []);

	const handleTableChange: TableProps<IdentityUserDto>["onChange"] = (pagination) => {
		const { current = 1, pageSize = 10 } = pagination;
		const maxResultCount = pageSize;
		const skipCount = (current - 1) * (pageSize || 10);

		fetchData(skipCount, maxResultCount);
	};

	return (
		<div>
			<PageHeader>
				<PageHeader.Content>
					<PageHeader.Title>
						<Trans t={t}>users.page.header.title</Trans>
					</PageHeader.Title>
					<PageHeader.Description>
						<Trans t={t}>users.page.header.description</Trans>
					</PageHeader.Description>
				</PageHeader.Content>
				<PageHeader.Actions>
					<Button>
						<Trans t={t}>users.page.header.actions.add</Trans>
					</Button>
				</PageHeader.Actions>
			</PageHeader>
			<div>
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					columns={columns}
					dataSource={users}
					pagination={{ total: totalCount }}
					loading={loading}
					onChange={handleTableChange}
				/>
			</div>
		</div>
	);
};
