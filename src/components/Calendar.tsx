import React from 'react';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CheckBoxComponent } from './CheckBox';

import type { Birthdays, Birthday, Favourites } from '../types';


/**
 * Pads a number with a leading zero and returns the last 2 characters to turn
 * numbers into zero-padded strings.
 * 
 * @param value Number The number to be paddedP(if < 10)
 * @returns String The padded number
 */
const padNumber = (value: Number): String => {
    const valueAsString = value.toString()
    return valueAsString.padStart(1, '0').substring(valueAsString.length - 2)
}


/**
 * Gets birthdays from the API from a given month and day. Month and day need to
 * be zero padded, therefore we pass a String instead of a Number.
 * 
 * @param month String The month of the year (zero padded)
 * @param day String The day of the month (zero padded)
 * @returns Array The birthdays for this date
 */
const fetchBirthdays = async (month: String, day: String) => {
    const data = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`)
    const json = await data.json();

    return json.births;
}


// I'm not entirely sure this is the right type for `setFavourites`
type Props = {
    favourites: Favourites
    setFavourites: Function
}

/**
 * Renders the calendar (date picker) and the list of birthdays for a selected
 * date.
 * 
 * Clicking a birthday in the list will toggle that birthday in the favourites
 * list.
 * 
 * States like `loading` and `error` should (in my opinion) be handled in a
 * state machine, to separate data from actual state.
 * 
 * @param Props The props for the component
 * @returns JSX.Element
 */
export const CalendarComponent = ({ favourites, setFavourites }: Props) => {
    const [loading, setLoading] = React.useState<Boolean>(false);
    const [error, setError] = React.useState<String | null>(null);
    const [value, setValue] = React.useState<Dayjs | null>(null);
    const [month, setMonth] = React.useState<String | null>(null);
    const [day, setDay] = React.useState<String | null>(null);
    const [birthdays, setBirthdays] = React.useState<Birthdays>([]);

    // Keep track of when month or day changes, and fetch the results from the
    // API accordingly.
    //
    // react doesn't seem to like calling async/await in hooks. I've researched
    // some workarounds but I found they make the code harder to read. There's
    // probably a more elegant solution to this Promise chain.
    React.useEffect(() => {
        if (month && day) {

            // These two state would be better in a state machine.
            setError(null)
            setLoading(true)

            fetchBirthdays(month, day)
                .then(birthdays => setBirthdays(birthdays))
                .catch(() => setError('Something went wrong trying to fetch data from the API. Please try again!'))
                .finally(() => setLoading(false))
        }
    }, [month, day])

    /**
     * Toggles a birthday in the list of favourites.
     * 
     * @param birthday The birthday to toggle
     */
    const toggleFavourite = (birthday: Birthday) => {

        // Add the month and day to the birthday so we can easily reduce the
        // array of favourites based on them.
        const newFavourite = Object.assign({}, birthday, { date: value?.format('MMMM D') })

        // Remove the entry when it already exists, otherwise add it to the favourites array.
        if (favourites.find(favourite => favourite.text === newFavourite.text)) {
            setFavourites([...favourites.filter(favourite => favourite.text !== newFavourite.text)])
        } else {
            setFavourites([
                ...favourites,
                newFavourite
            ])
        }
    }

    return (
        <div data-testid="calendar">
            <h2 className="text-lg font-semibold leading-8 text-gray-900 mb-4" data-testid="heading">Pick a date</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    className="w-full"
                    label="Pick a date"
                    value={value}
                    onChange={(newValue) => {
                        if (newValue) {
                            setMonth(padNumber(newValue.month() + 1)) // Months are 0-based, so add 1.
                            setDay(padNumber(newValue.date()))
                        }
                        setValue(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            {month && day &&
                <h3 className="mt-4 text-base font-semibold leading-8 text-gray-900" data-testid="month-day">Birthdays on {value?.format('MMMM D')}</h3>
            }

            {loading &&
                <p className="p-4 rounded border bg-indigo-50 text-indigo-500 border-indigo-500 text-sm text-center" data-testid="loading">Loading birthdays, please wait...</p>
            }

            {error &&
                <p className="p-4 rounded border bg-red-50 text-red-500 border-red-500 text-sm text-center" data-testid="error">{error}</p>
            }

            {!loading && birthdays.length > 0 &&
                <ul data-testid="birthday-list">
                    {birthdays.map((birthday) => (
                        <li data-testid="birthday-list-item" className="cursor-pointer flex items-start" key={birthday.text} onClick={() => toggleFavourite(birthday)}>{favourites.findIndex(fav => fav.text === birthday.text) > -1 ? <CheckBoxComponent checked={true} /> : <CheckBoxComponent />}{birthday.text}</li>
                    ))}
                </ul>
            }
        </div>
    )
}
