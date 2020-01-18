import React from 'react';
import hasAnsi from 'has-ansi';
import isEqual from 'lodash.isequal';
import IndicatorComponent, { Props as IndicatorProps } from './Indicator';
import ItemComponent, { Props as ItemProps } from './Item';
import HighlightComponent, { Props as HighlightProps } from './Highlight';
import StatusComponent, { Props as StatusProps } from './Status';
import { ReadStream } from 'tty';

const defaultValue = { label: '' }; // Used as return for empty array

export { IndicatorProps, ItemProps, HighlightProps, StatusProps };

export type Item = {
    label: string;
    value?: React.Key;
};

export type Props = {
    items: Item[];
    onSelect: (item: Item) => void;
    focus: boolean;
    limit: number;
    forceMatchingQuery: boolean;
    clearQueryChars: string[];
    initialSelectionIndex: number;
    indicatorComponent: React.ComponentType<IndicatorProps>;
    itemComponent: React.ComponentType<ItemProps>;
    highlightComponent: React.ComponentType<HighlightProps>;
    statusComponent: React.ComponentType<StatusProps>;
    caseSensitive: boolean;
    stdin: ReadStream;
};

type State = {
    query: string;
    hasMatch: boolean;
    selectionIndex: number;
    startIndex: number;
};

const initialState: State = {
    query: '',
    hasMatch: true,
    selectionIndex: 0,
    startIndex: 0
};

class QuickSearch extends React.Component<Props, State> {
    public static defaultProps: Props = {
        items: [],
        onSelect: () => {}, // no-op
        focus: true,
        caseSensitive: false,
        limit: 0,
        forceMatchingQuery: false,
        clearQueryChars: [
            '\u0015', // Ctrl + U
            '\u0017' // Ctrl + W
        ],
        initialSelectionIndex: 0,
        indicatorComponent: IndicatorComponent,
        itemComponent: ItemComponent,
        highlightComponent: HighlightComponent,
        statusComponent: StatusComponent,
        stdin: process.stdin
    };

    constructor(props: Props) {
        super(props);
        this.state = { ...initialState, selectionIndex: props.initialSelectionIndex };
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    render() {
        // Cannot have these starting with lowercases
        const HighlightComponent_ = this.props.highlightComponent;
        const ItemComponent_ = this.props.itemComponent;
        const IndicatorComponent_ = this.props.indicatorComponent;
        const StatusComponent_ = this.props.statusComponent;

        const begin = this.state.startIndex;
        let end = this.props.items.length;
        if (this.props.limit !== 0) {
            end = Math.min(begin + this.props.limit, this.props.items.length);
        }
        const items = this.props.items.slice(begin, end);

        const rows = items.map((item, index) => {
            const isLast: boolean = index === items.length - 1;

            const itemProps: { isSelected: boolean; isHighlighted: boolean; item: Item } = {
                isSelected: index + this.state.startIndex === this.state.selectionIndex,
                isHighlighted: false,
                item
            };

            const label = item.label;
            const queryPosition = this.getMatchPosition(label, this.state.query);

            let labelComponent;
            if (queryPosition === -1) {
                itemProps.isHighlighted = false;
                labelComponent = <span>{label}</span>;
            } else {
                itemProps.isHighlighted = true;
                const start = queryPosition;
                const end = start + this.state.query.length;

                const first = label.slice(0, start);
                const second = label.slice(start, end);
                const third = label.slice(end);

                labelComponent = (
                    <span>
                        {first}
                        <HighlightComponent_ {...itemProps}>{second}</HighlightComponent_>
                        {third}
                    </span>
                );
            }

            return (
                <ItemComponent_ key={item.value ?? item.label} {...itemProps}>
                    <IndicatorComponent_ {...itemProps} />
                    {labelComponent}
                    {!isLast && <br />}
                </ItemComponent_>
            );
        });

        return (
            <span>
                {rows}
                <StatusComponent_ hasMatch={this.state.hasMatch}>
                    <br />
                    {this.state.query}
                </StatusComponent_>
            </span>
        );
    }

    componentDidMount() {
        this.props.stdin.on('keypress', this.handleKeyPress);
    }

    componentWillUnmount() {
        this.props.stdin.removeListener('keypress', this.handleKeyPress);
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        if (!isEqual(this.props.items, nextProps.items)) {
            this.setState(initialState);
            if (nextProps.initialSelectionIndex != null) {
                this._updateSelectionIndex(nextProps.initialSelectionIndex, nextProps);
            }
        }
    }

    handleKeyPress(ch: string, key: { name: string; shift: boolean; sequence: string }) {
        if (!this.props.focus) {
            return;
        }

        if (this.props.clearQueryChars.indexOf(ch) !== -1) {
            this.setState({ query: '' });
        } else if (key.name === 'return') {
            this.props.onSelect(this.getValue());
        } else if (key.name === 'backspace') {
            this._updateQuery(this.state.query.slice(0, -1));
        } else if (key.name === 'up') {
            this._changeSelection(-1);
        } else if (key.name === 'down') {
            this._changeSelection(1);
        } else if (key.name === 'tab') {
            if (key.shift === false) {
                this._changeSelection(1);
            } else {
                this._changeSelection(-1);
            }
        } else if (key.name === 'pageup' || key.name === 'pagedown') {
            this._handlePageChange(key.name);
        } else if (hasAnsi(key.sequence)) {
            // No-op
        } else {
            this._updateQuery(this.state.query + ch);
        }
    }

    private _updateQuery(query: string) {
        let selectionIndex = this.state.selectionIndex;
        let hasMatch = false;
        if (query.trim() === '' || this.getMatchPosition(this.getValue().label, query) !== -1) {
            hasMatch = true;
        } else {
            for (var i = 0; i < this.props.items.length; i++) {
                if (this.getMatchPosition(this.props.items[i].label, query) !== -1) {
                    selectionIndex = i;
                    hasMatch = true;
                    break;
                }
            }
        }

        if (!hasMatch && this.props.forceMatchingQuery) {
            return;
        }

        this._updateSelectionIndex(selectionIndex);
        this.setState({ query, hasMatch });
    }

    private _changeSelection(delta: number) {
        for (
            let selectionIndex = this.state.selectionIndex + delta;
            0 <= selectionIndex && selectionIndex < this.props.items.length;
            selectionIndex += delta
        ) {
            if (!this.state.hasMatch) {
                this._updateSelectionIndex(selectionIndex);
                break;
            }

            if (this.getMatchPosition(this.props.items[selectionIndex].label, this.state.query) !== -1) {
                this._updateSelectionIndex(selectionIndex);
                break;
            }
        }
    }

    private _updateSelectionIndex(selectionIndex: number, props?: Props) {
        if (props == undefined) {
            props = this.props;
        }
        this.setState({ selectionIndex });
        if (props.limit === 0) {
            return;
        }
        const begin = this.state.startIndex;
        const end = Math.min(begin + props.limit, props.items.length);
        if (begin <= selectionIndex && selectionIndex < end) {
            return;
        } else if (selectionIndex >= end) {
            if (selectionIndex >= props.items.length) {
                throw Error(`Error: selection index (${selectionIndex}) outside items range (${props.items.length}).`);
            }
            const startIndex = selectionIndex - props.limit + 1;
            this.setState({ startIndex });
        } else {
            // if (selectionIndex < begin)
            this.setState({ startIndex: selectionIndex });
        }
    }

    private _handlePageChange(keyName: 'pageup' | 'pagedown') {
        if (this.state.query.trim() !== '') {
            return; // Do not page when selecting
        }
        if (this.props.limit === 0) {
            return; // Nothing to page
        }
        let newIndex = this.state.selectionIndex;
        if (keyName === 'pageup') {
            newIndex = Math.max(this.state.selectionIndex - this.props.limit + 1, 0);
        } else if (keyName === 'pagedown') {
            newIndex = Math.min(this.state.selectionIndex + this.props.limit - 1, this.props.items.length - 1);
        }
        this._changeSelection(newIndex - this.state.selectionIndex);
    }

    getMatchPosition(label: string, query: string) {
        if (this.props.caseSensitive) {
            return label.indexOf(query);
        } else {
            return label.toLowerCase().indexOf(query.toLowerCase());
        }
    }

    getValue() {
        return this.props.items[this.state.selectionIndex] || defaultValue;
    }
}

export default QuickSearch;
