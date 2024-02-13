import { cn } from "@/lib/utils";
import { useCurrentPage } from "@/stores/page";
import React from "react";

function WholeSplit({
	className,
	width = 120,
	height = 90,
	...props
}: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 120 90"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("group", className)}
			{...props}
		>
			<title>Whole Split</title>
			<rect
				x="0.5"
				y="0.5"
				width="119"
				height="89"
				rx="7.5"
				className="stroke-foreground/[.1] fill-foreground/[.05] dark:fill-foreground/[.09] group-hover:fill-primary/[.09] dark:group-hover:fill-primary/[.11] group-hover:stroke-primary/[.11] dark:group-hover:stroke-primary/[.13] transition"
			/>
		</svg>
	);
}

function HalfSplit({
	className,
	width = 120,
	height = 90,
	...props
}: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 120 90"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("group", className)}
			{...props}
		>
			<title>Half Split</title>
			<g clip-path="url(#clip0_42_18)">
				<path
					d="M8 0.5H53.5C55.433 0.5 57 2.067 57 4V86C57 87.933 55.433 89.5 53.5 89.5H8C3.85786 89.5 0.5 86.1421 0.5 82V8C0.5 3.85786 3.85786 0.5 8 0.5Z"
					className="stroke-foreground/[.1] fill-foreground/[.05] dark:fill-foreground/[.09] group-hover:fill-primary/[.09] dark:group-hover:fill-primary/[.11] group-hover:stroke-primary/[.11] dark:group-hover:stroke-primary/[.13] transition"
				/>
				<path
					d="M66.5 0.5H112C116.142 0.5 119.5 3.85786 119.5 8V82C119.5 86.1421 116.142 89.5 112 89.5H66.5C64.567 89.5 63 87.933 63 86V4C63 2.067 64.567 0.5 66.5 0.5Z"
					className="stroke-foreground/[.1] fill-foreground/[.05] dark:fill-foreground/[.09] group-hover:fill-primary/[.09] dark:group-hover:fill-primary/[.11] group-hover:stroke-primary/[.11] dark:group-hover:stroke-primary/[.13] transition"
				/>
			</g>
			<defs>
				<clipPath id="clip0_42_18">
					<rect width="120" height="90" rx="8" />
				</clipPath>
			</defs>
		</svg>
	);
}

function ThirdSplit({
	className,
	width = 120,
	height = 90,
	...props
}: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 120 90"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("group", className)}
			{...props}
		>
			<title>Third Split</title>
			<g clip-path="url(#clip0_42_27)">
				<path
					d="M8 0.5H32.6666C34.5996 0.5 36.1666 2.067 36.1666 4V86C36.1666 87.933 34.5996 89.5 32.6666 89.5H8C3.85786 89.5 0.5 86.1421 0.5 82V8C0.5 3.85786 3.85786 0.5 8 0.5Z"
					className="stroke-foreground/[.1] fill-foreground/[.05] dark:fill-foreground/[.09] group-hover:fill-primary/[.09] dark:group-hover:fill-primary/[.11] group-hover:stroke-primary/[.11] dark:group-hover:stroke-primary/[.13] transition"
				/>
				<rect
					x="42.1666"
					y="0.5"
					width="35.6666"
					height="89"
					rx="3.5"
					className="stroke-foreground/[.1] fill-foreground/[.05] dark:fill-foreground/[.09] group-hover:fill-primary/[.09] dark:group-hover:fill-primary/[.11] group-hover:stroke-primary/[.11] dark:group-hover:stroke-primary/[.13] transition"
				/>
				<path
					d="M87.3333 0.5H112C116.142 0.5 119.5 3.85786 119.5 8V82C119.5 86.1421 116.142 89.5 112 89.5H87.3332C85.4003 89.5 83.8333 87.933 83.8333 86V4C83.8333 2.067 85.4003 0.5 87.3333 0.5Z"
					className="stroke-foreground/[.1] fill-foreground/[.05] dark:fill-foreground/[.09] group-hover:fill-primary/[.09] dark:group-hover:fill-primary/[.11] group-hover:stroke-primary/[.11] dark:group-hover:stroke-primary/[.13] transition"
				/>
			</g>
			<defs>
				<clipPath id="clip0_42_27">
					<rect width="120" height="90" rx="8" />
				</clipPath>
			</defs>
		</svg>
	);
}

export function EmptyBlock() {
	const addSplit = useCurrentPage((s) => s.addSplit);

	return (
		<button
			className="border-dashed w-full h-96 bg-background border-2 rounded-lg grid place-items-center cursor-default"
			type="button"
		>
			<div className="flex gap-4">
				<WholeSplit onClick={() => addSplit("whole")} />
				<HalfSplit onClick={() => addSplit("half")} />
				<ThirdSplit onClick={() => addSplit("third")} />
			</div>
		</button>
	);
}
