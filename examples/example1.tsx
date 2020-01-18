/**
 * This is the basic usage example, including all defaults
 */

import React from 'react';
import { render, Color } from 'ink';
import QuickSearch, { Props } from '../src/QuickSearch';

function Example1() {
    const props: Partial<Props> = {
        items: [
            { value: 1, label: 'Animal' },
            { value: 3, label: 'Antilope' },
            { value: 2, label: 'Animation' },
            { value: 0, label: 'Animate' },
            { value: 4, label: 'Arizona' },
            { value: 5, label: 'Aria' },
            { value: 6, label: 'Arid' }
        ],
        onSelect: (d) => console.log('You selected', d)
    };

    return (
        <span>
            <Color red> Example 1 </Color>
            <br />
            <QuickSearch {...props} />
        </span>
    );
}

render(<Example1 />);
