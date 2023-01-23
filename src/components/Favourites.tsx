import type { Birthdays, Favourites } from '../types';

type FavouritesProps = {
    favourites: Favourites
}

type FormattedFavourite = {
    date: string | undefined
    birthdays: Birthdays
}

type FormattedFavourites = FormattedFavourite[]

/**
 * This component renders the list of favourited birthdays.
 *
 * Since the array of birthdays is flat, we need to create a nested array sorted
 * by month-day and display that instead.
 * 
 * @param Props The component props.
 * @returns JSX.Element
 */
export const FavouritesComponent = ({ favourites }: FavouritesProps) => {

    // Formats the flat favourites array into a nested array like so:
    // From: [{ text: 'John Smith, writer', year: 1987, month: '02', day: '14' }]
    // To: [{ date: '02-14', birthdays: [] }]
    const formattedFavourites = favourites.reduce((acc, val) => {

        // Add a new entry for this date, if it doesn't exist yet.
        if (!acc.find(a => a.date === val.date)) {
            acc.push({ date: val.date, birthdays: [] })
        }

        // Add the birthday to this date.
        acc.find(a => a.date === val.date)?.birthdays.push(val)

        return acc
    }, [] as FormattedFavourites)

    return (
        <aside data-testid="favourites">
            <h2 className="text-lg font-semibold leading-8 text-gray-900 mb-4">Favourite Birthdays</h2>
            {!formattedFavourites.length &&
                <p className="p-5 rounded border border-dashed text-sm text-center text-gray-500 bg-gray-50" data-testid="empty">You have no favourite birthdays yet.</p>
            }
            {formattedFavourites.length > 0 &&
                <div data-testid="list">
                    {formattedFavourites.map((date) => (
                        <div data-testid="list-wrapper" key={date.date}>
                            <h3 className="mt-4 text-base font-semibold leading-8 text-gray-900" data-testid="list-day">{date.date}</h3>
                            <ul key={`ul-${date.date}`}>
                                {date.birthdays.map((birthday) => (
                                    <li className="pl-4" key={birthday.text} data-testid="birthday">{birthday.text} - {birthday.year}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            }
        </aside>
    )
}
