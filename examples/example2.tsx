/**
 * This is a example that does not feature a search box and
 * is case sensitive
 */

import React from 'react';
import { render, Color } from 'ink';
import QuickSearch, { Props } from '../src/QuickSearch';

const StatusComponent = () => <span></span>; // No-op

function Example2() {
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
        caseSensitive: true,
        statusComponent: StatusComponent
    };

    return (
        <span>
            <Color red> Example 2 </Color>
            <br />
            <QuickSearch {...props} />
        </span>
    );
}

render(<Example2 />);
