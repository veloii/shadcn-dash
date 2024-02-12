"use client";

import FullPageLoader from "@/components/dashboard/full-page-loader";
import { Header } from "@/components/dashboard/header";
import { PageShell } from "@/components/dashboard/page-shell";
import { useCurrentPage } from "@/components/dashboard/pages/store";
import { Sidebar } from "@/components/dashboard/sidebar";
import SplitViews from "@/components/dashboard/splits";
import { DndViews } from "@/components/dashboard/views";
import { DndContainer } from "@/components/dashboard/views/drag-n-drop";
import { EmptyBlock } from "@/components/dashboard/views/empty-states";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMinSize } from "@/hooks/use-min-size";
import { MyComponent } from "@/lib/scoped-store";
import { AppleIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

function DashboardPage() {
	const minSize = useMinSize("main-group", 450);
	const currentPage = useCurrentPage();

	return (
		// <div className="mx-auto lg:px-8 py-5 space-y-10">
		<Sidebar>
			{currentPage && (
				<PageShell page={currentPage} className="flex flex-col gap-4">
					<DndContainer>
						{currentPage.splitStoreKeys.map((key) => (
							<SplitViews syncKey={key} key={key} />
						))}
						<EmptyBlock />
						{/* <ResizablePanelGroup */}
						{/* 	direction="horizontal" */}
						{/* 	className="rounded-lg border" */}
						{/* 	id="main-group" */}
						{/* > */}
						{/* <ResizablePanel collapsible minSize={minSize} defaultSize={0}> */}
						{/* </ResizablePanel> */}
						{/* <ResizableHandle withHandle /> */}
						{/* <ResizablePanel collapsible minSize={minSize} defaultValue={0}> */}
						{/* 	<DndViews syncKey="hi" /> */}
						{/* </ResizablePanel> */}
						{/* <ResizableHandle withHandle /> */}
						{/* <ResizablePanel collapsible minSize={minSize} defaultSize={0}> */}
						{/* 	<DndViews syncKey="hi3" /> */}
						{/* </ResizablePanel> */}
						{/* </ResizablePanelGroup> */}
					</DndContainer>
				</PageShell>
			)}
		</Sidebar>
		// </div>
	);
}

const DashboardPageWithNoSSR = dynamic(() => Promise.resolve(DashboardPage), {
	loading: FullPageLoader,
	ssr: false,
});

export default DashboardPageWithNoSSR;
