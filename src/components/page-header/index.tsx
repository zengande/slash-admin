import { useProps } from "@/hooks/use-props";
import { type Factory, factory } from "../factory";
import PageHeaderActions from "./page-actions";
import PageHeaderContent from "./page-content";
import PageHeaderDescription from "./page-description";
import PageHeaderTitle from "./page-title";

export interface PageHeaderProps {
	children?: React.ReactNode;
	id?: string;
}

export type PageHeaderFactory = Factory<{
	props: PageHeaderProps;
	ref: HTMLDivElement | null;
	staticComponents: {
		Content: typeof PageHeaderContent;
		Title: typeof PageHeaderTitle;
		Description: typeof PageHeaderDescription;
		Actions: typeof PageHeaderActions;
	};
}>;

const defaultProps: Partial<PageHeaderProps> = {};

const PageHeader = factory<PageHeaderFactory>((_props, ref) => {
	const props = useProps("PageHeader", defaultProps, _props);
	const { children, id, ...others } = props;

	return (
		<div ref={ref} className="flex justify-between items-center gap-x-4 mb-6" {...others}>
			{children}
		</div>
	);
});

PageHeader.Title = PageHeaderTitle;
PageHeader.Description = PageHeaderDescription;
PageHeader.Content = PageHeaderContent;
PageHeader.Actions = PageHeaderActions;

export default PageHeader;
