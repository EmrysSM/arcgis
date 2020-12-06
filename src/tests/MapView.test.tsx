import React from 'react';
import { render } from '@testing-library/react';
import MapView from '../components/MapView';

test('Map renders correctly', () => {
  let tree = render(<MapView />);
  expect(tree).toMatchSnapshot();
});
