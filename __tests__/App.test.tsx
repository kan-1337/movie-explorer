import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

// This is a simple test to ensure the testing setup works
// You'll want to replace this with actual component tests
describe('Basic test setup', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Text>Hello, World!</Text>);
    expect(getByText('Hello, World!')).toBeTruthy();
  });
});
