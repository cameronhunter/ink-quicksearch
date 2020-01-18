import React from 'react';
import { Color } from 'ink';

export type Props = {
    children: string;
};

export default function Highlight({ children }: Props) {
    return <Color bgHex='#6C71C4'>{children}</Color>;
}
