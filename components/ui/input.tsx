import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	ignorePasswordManager?: boolean;
	error?: string;
}

const passwordMangerAttributes = {
	"data-1p-ignore": true,
	"data-lpignore": "true",
	"data-form-type": "other",
	autocomplete: "off",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, error, ignorePasswordManager, type, ...props }, ref) => {
		return (
			<>
				<input
					type={type}
					className={cn(
						"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
						error && "text-destructive-foreground border-destructive",
						className,
					)}
					{...(ignorePasswordManager ? passwordMangerAttributes : {})}
					ref={ref}
					{...props}
				/>
				{error && <p className="text-red-500 text-sm">{error}</p>}
			</>
		);
	},
);
Input.displayName = "Input";

export { Input };
