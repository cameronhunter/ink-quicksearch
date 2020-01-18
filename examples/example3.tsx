/**
 * Example with disappearing options
 */

import React from 'react';
import { render, Color } from 'ink';
import QuickSearch, { Props, ItemProps } from '../src/QuickSearch';

const ItemComponent = ({ isHighlighted, isSelected, children }: ItemProps) => {
    if (!isHighlighted) {
        return <span></span>;
    }
    return <Color hex={isSelected ? '#00FF00' : ''}>{children}</Color>;
};

const StatusComponent = () => <span></span>; // No-op

function Example3() {
    const props: Partial<Props> = {
        items: [
            { label: 'Animal' },
            { label: 'Antilope' },
            { label: 'Animation' },
            { label: 'Animate' },
            { label: 'Arizona' },
            { label: 'Aria' },
            { label: 'Arid' }
        ],
        onSelect: (d) => console.log(d),
        itemComponent: ItemComponent,
        statusComponent: StatusComponent
    };

    return (
        <span>
            <Color red> Example 3 </Color>
            <br />
            <QuickSearch {...props} />
        </span>
    );
}

render(<Example3 />);
