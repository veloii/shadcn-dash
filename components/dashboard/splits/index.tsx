import { SplitProvider } from "@/stores/split";
import { ViewGroup } from "../view-group";
import { useCurrentPage } from "@/stores/page";

export default function SplitViews() {
	const splits = useCurrentPage((s) => s.page.splits);

	return splits.map((split) => (
		<SplitProvider key={split.id} id={split.id}>
			{split.viewGroups.map((viewGroup) => (
				<ViewGroup key={viewGroup.id} id={viewGroup.id} />
			))}
		</SplitProvider>
	));
}
