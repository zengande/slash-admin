import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { cn } from "@/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";
import { Icon } from "../icon";

const personaVariants = cva("", {
	variants: {
		variant: {},
		size: {
			default: "size-8",
			sm: "size-6",
			md: "size-8",
			lg: "size-10",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

export interface PersonaProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof personaVariants> {
	asChild?: boolean;
	avatarSrc?: string;
	nickname: string;
	username: string;
}

const Persona = ({ className, size, avatarSrc, nickname, username }: PersonaProps) => {
	return (
		<div className={cn("flex gap-x-2", className)}>
			<Avatar className={cn(personaVariants({ size }))}>
				<AvatarImage src={avatarSrc} />
				<AvatarFallback>
					<Icon icon="lucide:user-round" />
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-col justify-between">
				<span className="m-0 text-sm font-medium">{nickname}</span>
				<span className="text-xs text-gray-600">{username}</span>
			</div>
		</div>
	);
};
Persona.displayName = "Persona";

export { Persona, personaVariants };
