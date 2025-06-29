import type { OrganizationUnitDto } from "@/types/organization-units";
import type { IdentityUserCreateDto } from "@/types/users";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";
import { Switch } from "antd";
import { useForm } from "react-hook-form";
import OrganizationUnitSelect from "./organization-unit-select";

interface MemberOnboardingDialogProps {
	opened?: boolean;
	onClose?: () => void;

	/**
	 * The ID of the organization for which the member onboarding is being done.
	 */
	selectedOrganizationUnits?: OrganizationUnitDto[];
}

const MemberOnboardingDialog = ({ selectedOrganizationUnits = [], opened = false, onClose }: MemberOnboardingDialogProps) => {
	const form = useForm<IdentityUserCreateDto & { organizationUnits: OrganizationUnitDto[] }>({
		defaultValues: {
			shouldChangePasswordOnNextLogin: true,
			organizationUnits: selectedOrganizationUnits,
		},
	});

	return (
		<Dialog defaultOpen={false} open={opened} onOpenChange={(open) => !open && onClose?.()}>
			<DialogContent className="sm:max-w-[800px] sm:min-w-[800px]">
				<DialogHeader>
					<DialogTitle>Member Onboarding</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<div className="grid grid-cols-2 gap-x-4 gap-y-6 py-2">
						<FormField
							control={form.control}
							name="userName"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="text-right">Username</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Please enter username" />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="organizationUnits"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="text-right">Departments</FormLabel>
									<FormControl>
										<OrganizationUnitSelect {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-x-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="">
										<FormLabel className="text-right">Name</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Please enter name" />
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
											<Input {...field} placeholder="Please enter surname" />
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
										<Input {...field} placeholder="Please enter email address" />
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
										<Input {...field} placeholder="Please enter phone number" />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="col-start-1">
									<FormLabel className="text-right">Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} placeholder="Please enter password" />
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
