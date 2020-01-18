import React from 'react';
import { Color } from 'ink';

export type Props = {
    children: string;
};

function Highlight({ children }: Props) {
    return <Color bgHex='#6C71C4'>{children}</Color>;
}

export default React.memo(Highlight);
