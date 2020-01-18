import React from 'react';
import Indicator from '../Indicator';
import { render } from 'ink-testing-library';
import stripAnsi from 'strip-ansi';

test('Shows an arrow when selected', () => {
    const { lastFrame } = render(<Indicator isSelected />);
    expect(stripAnsi(lastFrame())).toEqual('> ');
});

test('Does not show an arrow when not selected', () => {
    const { lastFrame } = render(<Indicator isSelected={false} />);
    expect(stripAnsi(lastFrame())).not.toEqual('> ');
});
