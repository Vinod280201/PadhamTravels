import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price, currency = "INR") => {
  if (!price && price !== 0) return "";
  const cleanPrice = typeof price === "string" ? price.replace(/[^0-9.]/g, "") : price;
  const numericPrice = Number(cleanPrice);
  if (isNaN(numericPrice)) return price;

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    AED: "AED ",
    SGD: "S$",
    THB: "฿",
  };

  const symbol = currencySymbols[currency] || "₹";

  if (currency === "INR") {
    return `${symbol}${numericPrice.toLocaleString("en-IN")}`;
  }
  return `${symbol}${numericPrice.toLocaleString("en-US")}`;
};

export const getTourImageUrl = (tour) => {
  if (!tour) return "https://via.placeholder.com/800x500?text=Tour+Package";

  const rawImage =
    Array.isArray(tour.images) && tour.images.length > 0 && tour.images[0]
      ? tour.images[0]
      : tour.image;

  if (!rawImage) return "https://via.placeholder.com/800x500?text=Tour+Package";

  if (
    rawImage.startsWith("http://") ||
    rawImage.startsWith("https://") ||
    rawImage.startsWith("data:")
  ) {
    return rawImage;
  }

  const backendBase = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
  ).replace(/\/api\/?$/, "");

  return `${backendBase}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;
};
