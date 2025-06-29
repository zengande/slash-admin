import type { OrganizationUnitDto } from "@/types/organization-units";
import { Tag } from "antd";
import { useState } from "react";
import OrganizationUnitSelectionDialog from "./organization-unit-selection-dialog";

export interface OrganizationUnitSelectProps {
	id?: string;
	value?: OrganizationUnitDto[];
	onChange?: (value: OrganizationUnitDto[]) => void;

	parentId?: string;

	multiple?: boolean;
}

const OrganizationUnitSelect = ({ id, value, onChange, multiple = true }: OrganizationUnitSelectProps) => {
	const [dialogOpened, setDialogOpen] = useState<boolean>(false);

	const handleOk = (selectedUnits: OrganizationUnitDto[]) => {
		onChange?.(selectedUnits);
		setDialogOpen(false);
	};

	const removeItem = (id: string) => {
		if (!value || value.length === 0) return;

		const newValue = value.filter((v) => v.id !== id);
		onChange?.(newValue);
	};

	return (
		<>
			<div id={id}>
				<div
					className="cursor-default dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base md:text-sm shadow-xs transition-[color,box-shadow] outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
					onClick={() => setDialogOpen(true)}
				>
					{value && value.length > 0 ? (
						<div className="-mx-2 space-x-1">
							{value.map((v) => (
								<Tag className="text-xs! font-normal! px-2! py-1!" color="blue" key={v.id} closable onClose={() => removeItem(v.id)}>
									{v.displayName}
								</Tag>
							))}
						</div>
					) : (
						<span className="text-muted-foreground ">Please select organization unit</span>
					)}
				</div>
			</div>

			{dialogOpened && (
				<OrganizationUnitSelectionDialog open={true} onClose={() => setDialogOpen(false)} multiple={multiple} selectedItems={value} onOk={handleOk} />
			)}
		</>
	);
};

export default OrganizationUnitSelect;
