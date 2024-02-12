import { DndViews } from "../views";
import { SplitStoreProvider, useSplitStore } from "./store";

function EmbedSplitViews() {
	const viewStoreKeys = useSplitStore((s) => s.viewStoreKeys);
	return viewStoreKeys.map((key) => <DndViews key={key} syncKey={key} />);
}

export default function SplitViews({ syncKey }: { syncKey: string }) {
	return (
		<SplitStoreProvider syncKey={syncKey}>
			<EmbedSplitViews />
		</SplitStoreProvider>
	);
}
