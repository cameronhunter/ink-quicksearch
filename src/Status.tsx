import React from 'react';
import { Color } from 'ink';

export type Props = {
    hasMatch: boolean;
    children: React.ReactNode;
};

function Status({ hasMatch, children }: Props) {
    return <Color hex={hasMatch ? '#00FF00' : '#FF0000'}>{children}</Color>;
}

export default React.memo(Status);
