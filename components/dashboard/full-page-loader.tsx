import { Loader2Icon } from "lucide-react";

export default function FullPageLoader() {
	return (
		<div className="flex flex-col justify-center items-center gap-4 flex-1">
			<div className="animate-spin">
				<Loader2Icon />
			</div>
		</div>
	);
}
