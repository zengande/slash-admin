import { useOrganizationUnitsApi } from "@/api";
import Empty from "@/components/empty";
import { Icon } from "@/components/icon";
import LoadingOverlay from "@/components/loading-overlay";
import { Persona } from "@/components/persona";
import type { OrganizationUnitDto } from "@/types/organization-units";
import { type IdentityUserDto, getFullname } from "@/types/users";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { type ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "react-use";

interface OrganizationUnitMemberSelectionDialogProps {
	organizationUnit?: OrganizationUnitDto;
	opened?: boolean;
	onOpenChange?: (open: boolean) => void;
	onSubmit?: (organizationUnitId: string, userIds: string[]) => void;
}

const OrganizationUnitMemberSelectionDialog = ({ organizationUnit, opened, onOpenChange, onSubmit }: OrganizationUnitMemberSelectionDialogProps) => {
	const { getUnaddedUserListApi } = useOrganizationUnitsApi();

	const [searchKey, setSearchKey] = useState<string>();
	const [users, setUsers] = useState<IdentityUserDto[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<IdentityUserDto[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (opened === false) {
			setSearchKey("");
			setUsers([]);
			setSelectedUsers([]);
		} else {
			doSearch();
		}
	}, [opened]);

	const handleOpenChange = (open: boolean) => {
		onOpenChange?.(open);
	};

	const handleSearchKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		setSearchKey(inputValue);
	};

	const doSearch = async () => {
		if (organizationUnit && opened) {
			setLoading(true);
			setUsers([]);
			try {
				const { items = [] } = await getUnaddedUserListApi({
					id: organizationUnit.id,
					filter: searchKey,
					skipCount: 0,
					maxResultCount: 10,
				});

				setUsers(items);
			} finally {
				setLoading(false);
			}
		}
	};

	useDebounce(doSearch, 500, [searchKey]);

	const handleItemSelectedChange = (item: IdentityUserDto, checked: boolean) => {
		if (checked) {
			setSelectedUsers(selectedUsers.concat([item]));
		} else {
			setSelectedUsers(selectedUsers.filter((x) => x.id !== item.id));
		}
	};

	const handleConfirm = () => {
		if (organizationUnit && onSubmit) {
			onSubmit(
				organizationUnit.id,
				selectedUsers.map((x) => x.id),
			);
		}
	};

	if (organizationUnit === undefined) return undefined;

	return (
		<Dialog defaultOpen={false} open={opened} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[800px] sm:min-w-[800px]">
				<DialogHeader>
					<DialogTitle>添加成员</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col h-[450px] gap-y-4">
					<p className="text-sm text-gray-700">
						将已选择的成员添加到部门「<span className="font-semibold text-gray-800">{organizationUnit.displayName}</span>」中
						<span className="text-xs text-gray-500">（已过滤已在部门中的成员）</span>
					</p>
					<div className="flex-1 w-full overflow-hidden grid grid-cols-2 gap-x-4">
						<div className="flex flex-col gap-y-4 overflow-hidden">
							<div className="p-0.5">
								<Input type="text" placeholder="搜索成员" maxLength={50} value={searchKey} onChange={handleSearchKeyChange} />
							</div>
							<div className="flex-1 overflow-auto relative">
								<LoadingOverlay visible={loading} />
								<Empty isEmpty={!loading && users.length === 0} description={searchKey === "" ? "没有相关成员" : `没有找到和 "${searchKey}" 相关的成员`}>
									<div className="px-0.5">
										{users.map((user) => {
											const checked = selectedUsers.findIndex((x) => x.id === user.id) >= 0;
											return (
												<div
													key={user.id}
													className="flex items-center gap-x-2 text-sm rounded p-2 cursor-pointer hover:bg-gray-100 transition-colors"
													onClick={() => handleItemSelectedChange(user, !checked)}
												>
													<input type="checkbox" checked={checked} readOnly={true} className={checked ? "border-blue-600" : "border-gray-400"} />
													<Persona avatarSrc={user.avatar} nickname={getFullname(user)} username={user.userName} />
												</div>
											);
										})}
									</div>
								</Empty>
							</div>
						</div>
						<div className="flex flex-col gap-y-4 overflow-hidden">
							{selectedUsers.length > 0 && (
								<>
									<div className="flex h-[38px] items-center justify-between text-sm">
										<p>
											已选：<span className="text-blue-600 pr-1">{selectedUsers.length}</span>名成员
										</p>
										<Button variant="link" onClick={() => setSelectedUsers([])}>
											清空
										</Button>
									</div>
									<div className="flex-1 overflow-auto">
										{selectedUsers.map((user) => (
											<div
												key={user.id}
												className="flex items-center justify-between gap-x-2 text-sm rounded p-2 cursor-pointer hover:bg-gray-100 transition-colors group"
											>
												<Persona avatarSrc={user.avatar} nickname={getFullname(user)} username={user.userName} />
												<Button className="hidden group-hover:block" variant="ghost" onClick={() => handleItemSelectedChange(user, false)}>
													<Icon icon="lucide:x" className="size-4" />
												</Button>
											</div>
										))}
									</div>
								</>
							)}
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant="secondary" onClick={() => handleOpenChange(false)}>
						取消
					</Button>
					<Button disabled={selectedUsers.length === 0} onClick={handleConfirm}>
						确定
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default OrganizationUnitMemberSelectionDialog;
