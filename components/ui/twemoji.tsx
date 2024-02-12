import React, { memo } from "react";
import twemoji from "twemoji";

const Twemoji = ({
	emoji,
	...props
}: { emoji: string } & React.ComponentPropsWithoutRef<"span">) => (
	<span
		// biome-ignore lint/security/noDangerouslySetInnerHtml: twemoji is safe
		dangerouslySetInnerHTML={{
			__html: twemoji.parse(emoji, {
				folder: "svg",
				ext: ".svg",
			}),
		}}
		{...props}
	/>
);

export default memo(Twemoji);
