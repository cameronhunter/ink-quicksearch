/**
 * Using initialSelectionIndex. Press Enter to cycle between states
 */

import React from 'react';
import { render, Color } from 'ink';
import QuickSearch, { Props as QuickSearchProps } from '../src/QuickSearch';

type Props = {};
type State = {
    setIndex: number;
};

class Example5 extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { setIndex: 0 };
    }

    render() {
        const sets = [
            [
                { label: 'Aardvark' },
                { label: 'Abyssinian' },
                { label: 'Adelie Penguin' },
                { label: 'Affenpinscher' }, // Selected
                { label: 'Afghan Hound' }
            ],
            [
                { label: 'Baboon' },
                { label: 'Bactrian Camel' }, // Selected
                { label: 'Badger' },
                { label: 'Balinese' },
                { label: 'Banded Palm Civet' }
            ]
        ];
        const selection = [3, 1];

        const props: Partial<QuickSearchProps> = {
            items: sets[this.state.setIndex],
            onSelect: () => this.setState({ setIndex: this.state.setIndex ^ 1 }),
            initialSelectionIndex: selection[this.state.setIndex]
        };

        return (
            <span>
                <Color red> Example 5 </Color>
                <br />
                <QuickSearch {...props} />
            </span>
        );
    }
}

render(<Example5 />);
