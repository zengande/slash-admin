import { type Factory, factory } from "@/components/factory";
import type PageHeaderTitle from "./page-title";

export interface PageHeaderContentProps {
	children?: React.ReactNode;
}

export type PageHeaderContentFactory = Factory<{
	props: PageHeaderContentProps;
	staticComponents: {
		Title: typeof PageHeaderTitle;
	};
}>;

const PageHeaderContent = factory<PageHeaderContentFactory>(({ children }, _) => {
	return <div className="flex-1 space-y-2">{children}</div>;
});

export default PageHeaderContent;
