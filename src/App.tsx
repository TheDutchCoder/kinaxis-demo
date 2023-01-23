import React from 'react';
import { CalendarComponent } from './components/Calendar';
import { FavouritesComponent } from './components/Favourites';

import type { Favourites } from './types';

/**
 * The app consists of two main components: the calendar where you can pick a
 * date and list birthdays for that date, and a list of favourites birthdays.
 * 
 * I added some styles (Tailwind) to make things look somewhat decent.
 */
function App() {

  // There's probably a nicer pattern in React for injecting state setters, but
  // I wanted to avoid a global state manager for such a small app.
  const [favourites, setFavourites] = React.useState<Favourites>([]);

  return (
    <div className="bg-white py-24 font-['Inter_Tight']">
      <div className="text-center mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-lg font-semibold leading-8 text-indigo-600">Kinaxis</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl" data-testid="title">Calendar App</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500">This is the result of the Front End Technology Design Challenge. A small calendar app that lets you favourite birthdays for a given date.</p>
        <div className="grid grid-cols-2 gap-8 text-left mt-8">
          <div className="text-left">
            <CalendarComponent favourites={favourites} setFavourites={setFavourites} />
          </div>
          <div>
            <FavouritesComponent favourites={favourites} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
