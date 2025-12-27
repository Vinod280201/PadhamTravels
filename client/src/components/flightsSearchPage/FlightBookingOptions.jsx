export function FlightBookingOptions({ options }) {
  if (!options || options.length === 0) return null;

  return (
    <div className="mt-3 border-t border-slate-200 pt-3">
      <h4 className="text-sm font-semibold text-slate-800 mb-2">
        Booking options
      </h4>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-sm bg-slate-50 border border-slate-200 rounded px-3 py-2"
          >
            <div>
              <p className="font-semibold text-slate-900">
                {opt.together?.book_with || "Seller"}
              </p>
              <p className="text-xs text-slate-600">
                {opt.together?.option_title}
              </p>
              {opt.together?.extensions?.length > 0 && (
                <p className="text-xs text-slate-500">
                  {opt.together.extensions.slice(0, 2).join(" • ")}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">
                {opt.together?.local_prices?.[0]?.currency}{" "}
                {opt.together?.local_prices?.[0]?.price}
              </p>
              {opt.together?.baggage_prices?.[0] && (
                <p className="text-xs text-slate-500">
                  {opt.together.baggage_prices[0]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
