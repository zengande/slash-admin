import type { IdentityUserCreateDto } from "@/types/users";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";
import { Switch } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface MemberOnboardingDialogProps {
	opened?: boolean;
	onClose?: () => void;

	/**
	 * The ID of the organization for which the member onboarding is being done.
	 */
	selectedOrganizationUnitIds?: string[];
}

const MemberOnboardingDialog = ({ opened = false, onClose }: MemberOnboardingDialogProps) => {
	const form = useForm<IdentityUserCreateDto>({
		defaultValues: {
			shouldChangePasswordOnNextLogin: true,
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		form.reset();
	}, [opened]);

	return (
		<Dialog defaultOpen={false} open={opened} onOpenChange={(open) => !open && onClose?.()}>
			<DialogContent className="sm:max-w-[800px] sm:min-w-[800px]">
				<DialogHeader>
					<DialogTitle>Member Onboarding</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<div className="grid grid-cols-2 gap-x-4 gap-y-6">
						<FormField
							control={form.control}
							name="userName"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="text-right">Username</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						{/* <FormField
							control={form.control}
							name="departments"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="text-right">Departments</FormLabel>
									<FormControl>
										<Select
											tabIndex={-1}
											className="pointer-events-none"
											variant="filled"
											showSearch={false}
											mode="tags"
											open={false}
											{...field}
											onClick={(e) => {
												console.log("sdf");
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/> */}
						<div className="grid grid-cols-2 gap-x-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="">
										<FormLabel className="text-right">Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="surname"
								render={({ field }) => (
									<FormItem className="">
										<FormLabel className="text-right">Surname</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="emailAddress"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="text-right">Email address</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phoneNumber"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="text-right">Phone number</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="text-right">Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="col-span-2">
							<FormField
								control={form.control}
								name="shouldChangePasswordOnNextLogin"
								render={({ field }) => (
									<FormItem className="flex items-center">
										<FormControl>
											<Switch size="small" {...field} />
										</FormControl>
										<FormLabel className="text-right">Force users to change their passwords on first login</FormLabel>
									</FormItem>
								)}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="secondary" onClick={onClose}>
							取消
						</Button>
						<Button>确定</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default MemberOnboardingDialog;
