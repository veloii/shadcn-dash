import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "../button";
import { ChartProps } from ".";
import twColors from "tailwindcss/colors";
import { Color, cn, colors } from "@/lib/utils";
import { CustomTooltip } from "./tooltip";
import { useTheme } from "next-themes";

const geoUrl =
	"https://raw.githubusercontent.com/veloii/geo-topojson/main/geo.json";

const lightBaseColor = twColors.neutral[100];
const darkBaseColor = twColors.neutral[800];

const colorScales = (theme: string) =>
	colors.reduce(
		(acc, color) => {
			acc[color] = [
				theme === "dark" ? darkBaseColor : lightBaseColor,
				color === "primary"
					? twColors[theme === "dark" ? "white" : "black"]
					: twColors[color][theme === "dark" ? 500 : 400],
			];
			return acc;
		},
		{} as Record<Color, string[]>,
	);

const demoData = [
	{ x: "China", y: 0.1 },
	{ x: "United States", y: 0.9 },
	{ x: "Russia", y: 0.3 },
	{ x: "India", y: 0.1 },
	{ x: "Canada", y: 0.2 },
];

const createColorScale = (color: Color, theme: string) =>
	scaleLinear<string>().domain([0, 1]).range(colorScales(theme)[color]);

type Tooltip = {
	label: string;
	value: number;
} | null;

export function GeoMap<T>({
	height,
	x: propX,
	y: propY,
	data: propData,
	color,
}: ChartProps<T>) {
	const { resolvedTheme: theme } = useTheme();
	const [colorScale, setColorScale] = useState(() =>
		createColorScale(color, theme || "light"),
	);
	const data = demoData;
	const x = "x";
	const y = "y";

	const tooltipRef = useRef<HTMLDivElement>(null);
	const container = useRef<HTMLDivElement>(null);
	const [tooltip, setTooltip] = useState(null as Tooltip);

	useEffect(() => {
		setColorScale(() => createColorScale(color, theme || "light"));
	}, [color, theme]);

	const [position, setPosition] = useState({
		coordinates: [0, 20] as [number, number],
		zoom: 1.25,
	});

	const handleZoomIn = useCallback(() => {
		if (position.zoom >= 4) return;
		setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
	}, [position.zoom]);

	const handleZoomOut = useCallback(() => {
		if (position.zoom <= 1) return;
		setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
	}, [position.zoom]);

	const onMouseMove = useCallback(
		(label: string, value: number) =>
			(event: React.MouseEvent<SVGPathElement>) => {
				if (!tooltipRef.current) return;
				if (!container.current) return;
				const y =
					event.clientY - container.current.getBoundingClientRect().top - 65;
				const x =
					event.clientX - container.current.getBoundingClientRect().left + 10;
				tooltipRef.current.style.transform = `translate(${x}px, ${y}px)`;
				setTooltip({ label, value });
			},
		[],
	);

	const hideTooltip = useCallback(() => {
		setTooltip(null);
	}, []);

	return (
		<div className="relative" ref={container}>
			<div ref={tooltipRef} className="absolute pointer-events-none">
				<CustomTooltip
					active={!!tooltip}
					formatAsDate={false}
					label={tooltip?.label}
					payload={
						tooltip ? [{ value: tooltip.value as unknown as string }] : []
					}
				/>
			</div>
			<div className="absolute right-5 overflow-hidden bottom-5 flex shadow-md border rounded-md z-30 bg-background divide-x">
				<Button
					variant="ghost"
					onClick={handleZoomIn}
					size="icon"
					className="rounded-none opacity-75 hover:opacity-100"
				>
					<ZoomIn className="h-5" />
				</Button>
				<Button
					variant="ghost"
					onClick={handleZoomOut}
					size="icon"
					className="rounded-none opacity-75 hover:opacity-100"
				>
					<ZoomOut className="h-5" />
				</Button>
			</div>
			<ComposableMap
				className="w-full animate-in zoom-in-95 fade-in duration-200"
				projection="geoEqualEarth"
				style={{ height }}
				height={height}
			>
				<ZoomableGroup
					zoom={position.zoom}
					center={position.coordinates}
					onMoveEnd={setPosition}
					onMoveStart={hideTooltip}
					filterZoomEvent={(e) => "type" in e && e.type !== "wheel"}
				>
					<Geographies geography={geoUrl}>
						{({ geographies }) =>
							geographies.map((geo) => {
								const obj = data?.find((d) => d[x] === geo.properties.name);

								const value = obj
									? typeof obj[y] !== "number"
										? 0
										: (obj[y] as number)
									: 0;

								const baseColor = colorScale(value) as unknown as string;

								return (
									<Geography
										onMouseMove={onMouseMove(geo.properties.name, value)}
										onClick={hideTooltip}
										onMouseLeave={hideTooltip}
										key={geo.rsmKey}
										geography={geo}
										className={cn("focus:outline-0")}
										style={{
											default: {
												fill: baseColor,
												fillOpacity: 0.9,
											},
											hover: {
												fill: baseColor,
												filter:
													theme === "dark"
														? "brightness(1.2)"
														: "brightness(0.95)",
											},
										}}
									/>
								);
							})
						}
					</Geographies>
				</ZoomableGroup>
			</ComposableMap>
		</div>
	);
}
