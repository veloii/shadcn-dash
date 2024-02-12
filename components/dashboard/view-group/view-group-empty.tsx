import { useViewGroup } from "@/stores/view-group";
import { useCallback } from "react";
import { AddView, demoStats } from "./add-view";

export function ViewGroupEmpty() {
	const add = useViewGroup((s) => s.createViewFromStat);
	const select = useViewGroup((s) => s.selectView);

	const onNew = useCallback(
		(stat: string) => {
			const { id } = add(stat);
			select(id);
		},
		[select, add],
	);

	return <AddView onSelect={onNew} stats={demoStats} />;
}
