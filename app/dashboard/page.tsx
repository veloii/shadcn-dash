"use client";

import FullPageLoader from "@/components/dashboard/full-page-loader";
import { PageShell } from "@/components/dashboard/page-shell";
import { Sidebar } from "@/components/dashboard/sidebar";
import SplitViews from "@/components/dashboard/splits";
import { EmptyBlock } from "@/components/dashboard/splits/empty-states";
import dynamic from "next/dynamic";
import { CurrentPageProvider, useCurrentPage } from "@/stores/page";
import { useRootStore } from "@/stores/root";
import { PageContainer } from "@/components/dashboard/view-group/view-group-dnd";

function Page() {
	const { page } = useCurrentPage();

	return (
		<PageShell page={page} className="flex flex-col gap-4">
			<PageContainer>
				<SplitViews />
				<EmptyBlock />
			</PageContainer>
		</PageShell>
	);
}

function DashboardPage() {
	const root = useRootStore();

	return (
		<Sidebar>
			{root.selectedId && (
				<CurrentPageProvider id={root.selectedId}>
					<Page />
				</CurrentPageProvider>
			)}
		</Sidebar>
	);
}

const DashboardPageWithNoSSR = dynamic(() => Promise.resolve(DashboardPage), {
	loading: FullPageLoader,
	ssr: false,
});

export default DashboardPageWithNoSSR;
