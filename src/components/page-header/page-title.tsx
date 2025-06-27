import { type Factory, factory } from "@/components/factory";

export interface PageHeaderTitleProps {
	children?: React.ReactNode;
}

export type PageHeaderTitleFactory = Factory<{
	props: PageHeaderTitleProps;
}>;

const PageHeaderTitle = factory<PageHeaderTitleFactory>(({ children }, _) => {
	return <h1 className="text-3xl font-semibold">{children}</h1>;
});

export default PageHeaderTitle;
