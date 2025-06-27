import { useUsersApi } from "@/api";
// import { USER_LIST } from "@/_mock/assets";
import { Icon } from "@/components/icon";
import PageHeader from "@/components/page-header";
import { usePathname, useRouter } from "@/routes/hooks";
import type { TableParams } from "@/types/antd";
import type { IdentityUserDto } from "@/types/users";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { BasicStatus } from "#/enum";

const { getPagedListApi } = useUsersApi();

export default () => {
	const { t } = useTranslation();
	const { push } = useRouter();
	const pathname = usePathname();

	const [users, setUsers] = useState<IdentityUserDto[]>([]);
	const [loading, setLoading] = useState(false);
	const [tableParams, setTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: 10,
		},
	});

	const columns: ColumnsType<IdentityUserDto> = [
		{
			title: "Name",
			dataIndex: "name",
			width: 300,
			render: (_, record) => {
				return (
					<div className="flex">
						<img alt="" src={record.avatar} className="h-10 w-10 rounded-full" />
						<div className="ml-2 flex flex-col">
							<span className="text-sm">{record.userName}</span>
							<span className="text-xs text-text-secondary">{record.email}</span>
						</div>
					</div>
				);
			},
		},
		{
			title: "Status",
			dataIndex: "status",
			align: "center",
			width: 120,
			render: (status) => <Badge variant={status === BasicStatus.DISABLE ? "error" : "success"}>{status === BasicStatus.DISABLE ? "Disable" : "Enable"}</Badge>,
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

	const fetchData = () => {
		setLoading(true);

		getPagedListApi({
			maxResultCount: tableParams.pagination?.pageSize,
			skipCount: ((tableParams.pagination?.current || 1) - 1) * (tableParams.pagination?.pageSize || 10),
			sorting: tableParams.sortField ? `${tableParams.sortField} ${tableParams.sortOrder}` : undefined,
		}).then((rsp) => {
			console.log("rsp", rsp);
			setUsers(rsp.items);
			setLoading(false);
			setTableParams({
				...tableParams,
				pagination: {
					...tableParams.pagination,
					total: rsp.totalCount,
				},
			});
		});
	};

	useEffect(fetchData, []);

	const handleTableChange: TableProps<IdentityUserDto>["onChange"] = (pagination, filters, sorter) => {
		setTableParams({
			pagination,
			filters,
			sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
			sortField: Array.isArray(sorter) ? undefined : sorter.field,
		});

		// `dataSource` is useless since `pageSize` changed
		if (pagination.pageSize !== tableParams.pagination?.pageSize) {
			setUsers([]);
		}
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
					pagination={tableParams.pagination}
					loading={loading}
					onChange={handleTableChange}
				/>
			</div>
		</div>
	);
};
