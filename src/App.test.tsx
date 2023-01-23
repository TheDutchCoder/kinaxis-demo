import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// The app should render the UI and two components: CalendarComponent and
// FavouritesComponent.
test('renders the UI', () => {
  render(<App />);
  const headingElement = screen.getByTestId('title');
  expect(headingElement).toBeInTheDocument();
});

test('renders the Calendar componment', () => {
  render(<App />);
  const calendarElement = screen.getByTestId('calendar');
  expect(calendarElement).toBeInTheDocument();
})

test('renders the Favourites componment', () => {
  render(<App />);
  const favouritesElement = screen.getByTestId('favourites');
  expect(favouritesElement).toBeInTheDocument();
})
