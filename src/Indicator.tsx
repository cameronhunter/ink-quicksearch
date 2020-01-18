import React from 'react';
import { Color } from 'ink';

export type Props = {
    isSelected: boolean;
};

function Indicator({ isSelected }: Props) {
    return <Color hex='#00FF00'>{isSelected ? '>' : ' '} </Color>;
}

export default React.memo(Indicator);
