import { cn } from "@/utils";
import { NavLink } from "react-router";
import logo from "@/assets/images/logo.png";

interface Props {
	size?: "small" | "medium" | "large";
	className?: string;
}
function Logo({ size = "medium", className }: Props) {
	const sizeMap = {
		small: "size-4",
		medium: "size-8",
		large: "size-12",
	};

	return (
		<NavLink to="/" className={cn(className)}>
			<img src={logo} alt="logo" className={cn(sizeMap[size])} />
		</NavLink>
	);
}

export default Logo;
