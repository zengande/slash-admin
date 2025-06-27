interface OrganizationUnitMemberTableProps {
	organizationUnitId: string;
	organizationUnitName: string;
}

export default function OrganizationUnitMemberTable({ organizationUnitName }: OrganizationUnitMemberTableProps) {
	return <div>{organizationUnitName}</div>;
}
