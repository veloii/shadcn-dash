import logo from "@/assets/vosa.png";
import Image from "next/image";
import { ReactNode } from "react";
import { ThemeToggle } from "../theme-toggle";
import { PageItems } from "./pages/page-item";
import { AddPageButton } from "./pages/add-page";
import { ScrollArea } from "../ui/scroll-area";
import { useRootStore } from "@/stores/root";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeftIcon, PanelLeftCloseIcon } from "lucide-react";

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
	const open = useRootStore((s) => s.sidebarOpen);
	const toggle = useRootStore((s) => s.toggleSidebar);

	return (
		<div className="flex flex-1">
			<div
				className={cn(
					"h-full flex-shrink-0 px-5 w-72 ease-in-out absolute transition bg-background py-6 pt-8 flex flex-col justify-between duration-200",
					open ? "" : "-translate-x-full opacity-0",
				)}
			>
				<div className="space-y-8">
					<div className="flex justify-between items-center">
						<Image
							src={logo}
							alt="Vosa Logo"
							width={76}
							className="invert dark:invert-0 object-contain"
						/>
						<Button
							size="sm"
							className="size-8 p-0 opacity-90"
							variant="ghost"
							onClick={toggle}
						>
							<ChevronLeftIcon className="h-5" />
						</Button>
					</div>
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
			<div className="w-full flex-1 flex-col flex">
				{/* TODO: fix this mess */}
				<div
					className={cn(
						"flex-1 transition-transform ease-in-out duration-200",
						open ? "border-l translate-x-72" : "translate-x-0",
					)}
				>
					<div
						className={cn(
							"transition-[width] duration-0",
							open ? "w-[calc(100vw-18rem)] delay-100" : "w-screen",
						)}
					>
						<div
							className={cn(
								"overflow-auto h-screen flex-grow dark:bg-background bg-white relative",
							)}
						>
							{children}
							<div className="pb-16" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
