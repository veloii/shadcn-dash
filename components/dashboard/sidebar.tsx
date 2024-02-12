import logo from "@/assets/vosa.png";
import Image from "next/image";
import { ReactNode } from "react";
import { ThemeToggle } from "../theme-toggle";
import { PageItems } from "./pages/page-item";
import { AddPageButton } from "./pages/add-page";
import { ScrollArea } from "../ui/scroll-area";

type SidebarCategoryProps = {
	children: ReactNode;
	title: string;
};

function SidebarCategory({ title, children }: SidebarCategoryProps) {
	return (
		<div className="space-y-2">
			<div className="text-xs opacity-50 font-semibold">{title}</div>
			<div>{children}</div>
		</div>
	);
}

function UserProfile() {
	return <div />;
}

export function Sidebar({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-1 divide-x dark:divide-neutral-800">
			<div className="flex-shrink-0 w-72 bg-background px-5 py-6 pt-8 flex flex-col justify-between">
				<div className="space-y-8">
					<Image
						src={logo}
						alt="Vosa Logo"
						width={76}
						className="invert dark:invert-0"
					/>
					<div className="space-y-2">
						<SidebarCategory title={"Your Pages"}>
							<PageItems />
						</SidebarCategory>
						<AddPageButton className="w-full" variant="outline">
							New Page
						</AddPageButton>
					</div>
				</div>
				<div>
					<UserProfile />
					<ThemeToggle />
				</div>
			</div>
			<ScrollArea className="h-screen flex-grow dark:bg-background bg-white">
				{children}
				<div className="pb-16" />
			</ScrollArea>
		</div>
	);
}
