import { Icon } from "@/components/icon";
import type { OrganizationUnitDto } from "@/types/organization-units";
import { Badge } from "@/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/ui/breadcrumb";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { useEffect, useState } from "react";

export type OrganizationUnitSelectionDialogProps = {
	open?: boolean;
	onClose?: () => void;
	selectedItems?: OrganizationUnitDto[];
	multiple?: boolean;

	onOk?: (selectedUnits: OrganizationUnitDto[]) => void;
};

const OrganizationUnitSelectionDialog = ({ selectedItems, open, onClose, onOk }: OrganizationUnitSelectionDialogProps) => {
	const [selected, setSelected] = useState<OrganizationUnitDto[]>([]);

	useEffect(() => {
		setSelected(selectedItems || []);
	}, [selectedItems]);

	const handleItemSelectedChange = (item: OrganizationUnitDto, selected: boolean) => {
		if (selected) {
			setSelected((prev) => prev.concat([item]));
		} else {
			setSelected((prev) => prev.filter((x) => x.id !== item.id));
		}
	};

	const handleSubmit = () => {
		onOk?.([]);
	};

	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose?.()}>
			<DialogContent className="sm:max-w-[800px] sm:min-w-[800px]">
				<DialogHeader>
					<DialogTitle>Select organization unit</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col h-80 gap-y-4">
					<div className="flex-1 w-full overflow-hidden grid grid-cols-2 gap-x-4">
						<div className="flex flex-col gap-y-4 overflow-hidden">
							<div className="p-0.5">
								<Input type="text" placeholder="搜索或选择下方部门" maxLength={50} />
							</div>
							<Breadcrumb>
								<BreadcrumbList className="gap-x-1!">
									<BreadcrumbItem>
										<BreadcrumbLink>组织机构</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbPage>sdfds</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
							<div className="flex-1 overflow-auto relative" tabIndex={-1}>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
								<p>sdfsdf</p>
							</div>
						</div>
						<div className="flex flex-col gap-y-4 overflow-hidden">
							{selected.length > 0 && (
								<>
									<div className="flex h-[38px] items-center justify-between text-sm">
										<p>
											已选：<span className="text-blue-600 pr-1">{selected.length}</span>个部门
										</p>
										<Button variant="link" onClick={() => setSelected([])}>
											清空
										</Button>
									</div>
									<div className="flex-1 overflow-auto">
										{selected.map((ou) => (
											<div
												key={ou.id}
												className="flex items-center justify-between gap-x-2 text-sm rounded p-2 cursor-pointer hover:bg-gray-100 transition-colors group"
											>
												<div className="flex items-center gap-x-1">
													<span className="font-bold">{ou.displayName}</span>
													<Badge variant="outline">{ou.code}</Badge>
												</div>
												<Button size="icon" variant="ghost" onClick={() => handleItemSelectedChange(ou, false)}>
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
					<Button variant="secondary" onClick={onClose}>
						取消
					</Button>
					<Button onClick={handleSubmit}>确定</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default OrganizationUnitSelectionDialog;
