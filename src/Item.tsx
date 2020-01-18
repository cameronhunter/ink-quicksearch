import React from 'react';
import { Color } from 'ink';

export type Props = {
    isHighlighted: boolean;
    isSelected: boolean;
    children: React.ReactNode;
};

function Item({ isSelected, children }: Props) {
    return <Color hex={isSelected ? '#00FF00' : ''}>{children}</Color>;
}

export default React.memo(Item);
