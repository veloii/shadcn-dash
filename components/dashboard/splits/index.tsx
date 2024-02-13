import { Split, SplitProvider, useSplit } from "@/stores/split";
import { ViewGroup } from "../view-group";
import { useCurrentPage } from "@/stores/page";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMinSize } from "@/hooks/use-min-size";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export default function SplitViews() {
	const splits = useCurrentPage((s) => s.page.splits);

	return splits.map((split) => (
		<SplitProvider key={split.id} id={split.id}>
			<SplitView split={split} />
		</SplitProvider>
	));
}

function SplitView({ split }: { split: Split }) {
	const id = split.id.toString();
	const minSize = useMinSize(id, 450);
	const deleteSplit = useSplit((s) => s.deleteSplit);

	return (
		<ResizablePanelGroup
			direction="horizontal"
			className="rounded-lg border group relative [overflow:visible_!important]"
			id={id}
		>
			<Button
				onClick={deleteSplit}
				variant="outline"
				className="h-7 w-7 p-1 transition group-hover:opacity-100 bg-background opacity-0 rounded-full absolute z-20 -top-2 -right-2 "
			>
				<XIcon />
			</Button>
			{split.viewGroups.map((viewGroup, index) => (
				<>
					<ResizablePanel collapsible minSize={minSize}>
						<ViewGroup key={viewGroup.id} id={viewGroup.id} />
					</ResizablePanel>
					{index < split.viewGroups.length - 1 && (
						<ResizableHandle withHandle />
					)}
				</>
			))}
		</ResizablePanelGroup>
	);
}
