import { forwardRef } from "react";

export type DataAttributes = Record<`data-${string}`, any>;

export interface FactoryPayload {
	props: Record<string, any>;
	ctx?: any;
	ref?: any;
	stylesNames?: string;
	vars?: any;
	variant?: string;
	staticComponents?: Record<string, any>;
	// Compound components cannot have classNames, styles and vars on MantineProvider
	compound?: boolean;
}

export interface ExtendCompoundComponent<Payload extends FactoryPayload> {
	defaultProps?: Partial<Payload["props"]> & DataAttributes;
}

export type StaticComponents<Input> = Input extends Record<string, any> ? Input : Record<string, never>;

export type ComponentClasses<Payload extends FactoryPayload> = {
	classes: Payload["stylesNames"] extends string ? Record<string, string> : never;
};

export type ComponentStaticProperties<Payload extends FactoryPayload> = ComponentClasses<Payload> &
	StaticComponents<Payload["staticComponents"]> &
	FactoryComponentWithProps<Payload>;

export type FactoryComponentWithProps<Payload extends FactoryPayload> = {
	withProps: (props: Partial<Payload["props"]>) => React.ForwardRefExoticComponent<
		Payload["props"] &
			React.RefAttributes<Payload["ref"]> & {
				component?: any;
				renderRoot?: (props: Record<string, any>) => React.ReactNode;
			}
	>;
};

export type Component<Payload extends FactoryPayload> = React.ForwardRefExoticComponent<
	Payload["props"] &
		React.RefAttributes<Payload["ref"]> & {
			component?: any;
			renderRoot?: (props: Record<string, any>) => React.ReactNode;
		}
> &
	ComponentStaticProperties<Payload>;

export function identity<T>(value: T): T {
	return value;
}

export function getWithProps<T, Props>(Component: T): (props: Partial<Props>) => T {
	const _Component = Component as any;
	return (fixedProps: any) => {
		const Extended = forwardRef((props, ref) => <_Component {...fixedProps} {...props} ref={ref as any} />) as any;
		Extended.extend = _Component.extend;
		Extended.displayName = `WithProps(${_Component.displayName})`;
		return Extended;
	};
}

export function factory<Payload extends FactoryPayload>(ui: React.ForwardRefRenderFunction<Payload["ref"], Payload["props"]>) {
	const Component = forwardRef(ui) as any;

	Component.extend = identity as any;
	Component.withProps = (fixedProps: any) => {
		const Extended = forwardRef((props, ref) => <Component {...fixedProps} {...props} ref={ref as any} />) as any;
		Extended.extend = Component.extend;
		Extended.displayName = `WithProps(${Component.displayName})`;
		return Extended;
	};

	return Component as Component<Payload>;
}
