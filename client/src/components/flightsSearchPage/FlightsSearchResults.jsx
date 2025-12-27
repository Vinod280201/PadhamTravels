import React from "react";

export function FlightsSearchResults({ flights, hasSearched, loading }) {
  return (
    <div className="my-3 p-2 bg-slate-600 rounded-md">
      <div className="py-5 space-y-3">
        {flights.map((f, idx) => {
          const firstLeg = f.flights?.[0];
          const lastLeg = f.flights?.[f.flights.length - 1];
          return (
            <div
              key={idx}
              className="bg-white rounded p-4 flex flex-col border border-slate-800 md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <div className="font-semibold text-slate-800">
                  {firstLeg?.departure_airport?.id} →{" "}
                  {lastLeg?.arrival_airport?.id}
                </div>
                <div className="text-sm text-slate-800">
                  {firstLeg?.departure_airport?.time} →{" "}
                  {lastLeg?.arrival_airport?.time}
                </div>
                <div className="text-sm text-slate-800">
                  {f.flights?.map((leg) => leg.airline).join(", ")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-800">
                  ₹{f.price?.toLocaleString?.("en-IN") ?? f.price}
                </div>
                <div className="text-xs text-slate-800">
                  {Math.round((f.total_duration || 0) / 60)} hrs total
                </div>
              </div>

              {/* booking options only for first flight, for now 
              <FlightBookingOptions options={idx === 0 ? bookingOptions : []} /> */}
            </div>
          );
        })}

        {!hasSearched && !loading && (
          <p className="text-slate-100 text-lg font-medium text-center">
            Search your flights to see available flights here.
          </p>
        )}

        {hasSearched && !loading && flights.length === 0 && (
          <p className="text-slate-100 text-lg font-medium text-center">
            No flights found for this search. Try different dates or airports.
          </p>
        )}
      </div>
    </div>
  );
}
