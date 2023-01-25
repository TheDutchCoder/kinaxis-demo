import { render, screen } from '@testing-library/react';
import { FavouritesComponent } from '../Favourites';
import { within } from '@testing-library/dom';

// The favourites list should be rendered as empty
test('renders the checkbox', () => {
    render(<FavouritesComponent favourites={[]}  />);

    const favouritesElement = screen.getByTestId('favourites')
    expect(favouritesElement).toBeInTheDocument();

    const emptyElement = screen.getByTestId('empty')
    expect(emptyElement).toBeInTheDocument();
});

// The favourites list render a list formatted by date
test('renders the checkbox', () => {
    const favourites = [
        { text: 'birthday 1', year: 2000, date: 'January 1' },
        { text: 'birthday 2', year: 2001, date: 'February 2' },
        { text: 'birthday 3', year: 2020, date: 'January 1' },
    ]

    render(<FavouritesComponent favourites={favourites}  />);

    const listElements = screen.getByTestId('list')
    expect(listElements).toBeInTheDocument();

    const listDayElements = screen.getAllByTestId('list-day')
    expect(listDayElements).toHaveLength(2)
    expect(within(listDayElements[0]).getByText('January 1')).toBeInTheDocument()
    expect(within(listDayElements[1]).getByText('February 2')).toBeInTheDocument()

    const birthdayElements = screen.getAllByTestId('birthday')
    expect(birthdayElements).toHaveLength(3)

    const listWrapperElements = screen.getAllByTestId('list-wrapper')
    expect(listWrapperElements).toHaveLength(2)

    // Check that the birthday appear in the right list
    expect(within(listWrapperElements[0]).getByText('birthday 1 - 2000')).toBeInTheDocument()
    expect(within(listWrapperElements[0]).getByText('birthday 3 - 2020')).toBeInTheDocument()
    expect(within(listWrapperElements[1]).getByText('birthday 2 - 2001')).toBeInTheDocument()
});