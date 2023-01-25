import { render, screen, waitFor } from '@testing-library/react';
import { CalendarComponent } from '../Calendar';
import userEvent from '@testing-library/user-event';

import type { Favourites } from '../../types';

beforeEach(() => {
    // Globally mock fetch.
    //
    // NOTE: this is probably NOT the proper way to do it in Jest, but I'm not
    // familiar with a clean way to test state that depends on flushed promises.
    global.fetch = jest.fn(() =>
        new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    json: () => Promise.resolve({ births: [
                        { text: 'birthday 1', year: 2000 },
                        { text: 'birthday 2', year: 2001 },
                    ]}),
                })
            }, 250)
        }))  as jest.Mock
})

// The calendar should render the UI, which depends on different states (idle,
// loading, error, results).
test('renders the datepicker', () => {
    const favourites: Favourites = []
    const setFavourites = () => jest.fn()

    render(<CalendarComponent favourites={favourites} setFavourites={setFavourites} />);

    const headingElement = screen.getByTestId('heading');
    expect(headingElement).toBeInTheDocument();
});

// A loading message should show while fetching data and should be removed after
// fetching has finished and the list of birthdays should be displayed
test('renders a loading message while fetching data', async () => {
    const favourites: Favourites = []
    const setFavourites = () => jest.fn()

    render(<CalendarComponent favourites={favourites} setFavourites={setFavourites} />);

    const calendarElement = screen.getByPlaceholderText('mm/dd/yyyy')
    await userEvent.click(calendarElement)
    await userEvent.type(calendarElement, '01/01/2000')
    await userEvent.type(calendarElement, '{enter}')

    // Loading message should show while waiting for data
    expect(screen.getByTestId('loading')).toBeInTheDocument()

    // After data has been resolved, the loading message should not be there
    await waitFor(() => expect(screen.queryByTestId('loading')).toBeFalsy())

    // Now the list of birthdays should be shown
    expect(screen.getByTestId('month-day')).toBeInTheDocument()

    expect(screen.getByTestId('birthday-list')).toBeInTheDocument()
    expect(screen.getAllByTestId('birthday-list-item')).toHaveLength(2)
});

// An error message should show when fetching was unsuccessful
test('renders a loading message while fetching data', async () => {
    // Override the global fetch mock
    global.fetch = jest.fn(() => Promise.reject('whoops')) as jest.Mock

    const favourites: Favourites = []
    const setFavourites = () => jest.fn()

    render(<CalendarComponent favourites={favourites} setFavourites={setFavourites} />);

    const calendarElement = screen.getByPlaceholderText('mm/dd/yyyy')
    await userEvent.click(calendarElement)
    await userEvent.type(calendarElement, '01/01/2000')
    await userEvent.type(calendarElement, '{enter}')

    // Error message should show
    expect(screen.getByTestId('error')).toBeInTheDocument()
});