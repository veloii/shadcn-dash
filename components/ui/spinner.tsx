import { cn } from "@/lib/utils";
import React from "react";

export default function Spinner({
	size = "small",
}: {
	size?: "small" | "large";
}) {
	return (
		<div
			className={cn("ispinner", {
				"ispinner-large": size === "large",
			})}
		>
			<div className="ispinner-blade" />
			<div className="ispinner-blade" />
			<div className="ispinner-blade" />
			<div className="ispinner-blade" />
			<div className="ispinner-blade" />
			<div className="ispinner-blade" />
			<div className="ispinner-blade" />
			<div className="ispinner-blade" />
		</div>
	);
}
