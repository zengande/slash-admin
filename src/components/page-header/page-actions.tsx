import { type Factory, factory } from "@/components/factory";

export interface PageHeaderActionsProps {
	children?: React.ReactNode;
}

export type PageHeaderActionsFactory = Factory<{
	props: PageHeaderActionsProps;
}>;

const PageHeaderActions = factory<PageHeaderActionsFactory>(({ children }, _) => {
	return <div>{children}</div>;
});

export default PageHeaderActions;
