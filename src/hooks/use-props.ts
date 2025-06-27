import { filterProps } from "@/utils/filter-props";

export function useProps<T extends Record<string, any>, U extends Partial<T> = any>(
	component: string,
	defaultProps: U,
	props: T,
): T & {
	[Key in Extract<keyof T, keyof U>]-?: U[Key] | NonNullable<T[Key]>;
} {
	return { component, ...defaultProps, ...filterProps(props) };
}
