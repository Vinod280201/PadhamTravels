import Tour from "../models/Tour.js";

// GET all tours
export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.status(200).json(tours);
  } catch (err) {
    console.error("Get All Tours Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch tours" });
  }
};

export const getTours = getAllTours;

// GET single tour by ID
export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }
    res.status(200).json(tour);
  } catch (err) {
    console.error("Get Tour By ID Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch tour" });
  }
};

export const getSingleTour = getTourById;

// CREATE new tour
export const createTour = async (req, res) => {
  try {
    const { title, name, destination, duration, price, currency, pricingUnit, rating, reviews, inclusions, exclusions, highlights, isFeatured } = req.body;

    let imagePaths = [];
    let singleImage = "";
    let itineraryPath = "";

    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach((file) => {
          const fileUrl = `/uploads/${file.filename}`;
          if (file.fieldname === "itinerary") {
            itineraryPath = fileUrl;
          } else if (file.fieldname === "image") {
            singleImage = fileUrl;
            imagePaths.push(fileUrl);
          } else {
            imagePaths.push(fileUrl);
          }
        });
      } else if (typeof req.files === "object") {
        if (req.files.image && req.files.image.length > 0) {
          singleImage = `/uploads/${req.files.image[0].filename}`;
          imagePaths.push(singleImage);
        }
        if (req.files.images && Array.isArray(req.files.images)) {
          req.files.images.forEach((file) => imagePaths.push(`/uploads/${file.filename}`));
        }
        if (req.files.itinerary && req.files.itinerary.length > 0) {
          itineraryPath = `/uploads/${req.files.itinerary[0].filename}`;
        }
      }
    } else if (req.file) {
      const fileUrl = `/uploads/${req.file.filename}`;
      if (req.file.fieldname === "itinerary") {
        itineraryPath = fileUrl;
      } else {
        singleImage = fileUrl;
        imagePaths.push(fileUrl);
      }
    }

    const parseListField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === "string") {
        try {
          const parsed = JSON.parse(field);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          // Fallback: split by newline if present, otherwise by comma
          const separator = field.includes("\n") ? "\n" : ",";
          return field
            .split(separator)
            .map((item) => item.replace(/^[\s•\-\*]+/, "").trim())
            .filter((item) => item.length > 0);
        }
      }
      return [];
    };

    const newTour = new Tour({
      name: name || title || "Untitled Tour",
      destination: destination || "N/A",
      duration: duration || "",
      price: price !== undefined ? String(price) : "0",
      currency: currency || "INR",
      pricingUnit: pricingUnit || "per person",
      rating: rating ? Number(rating) : 0,
      reviews: reviews ? Number(reviews) : 0,
      inclusions: parseListField(inclusions),
      exclusions: parseListField(exclusions),
      highlights: parseListField(highlights),
      isFeatured: isFeatured === "true" || isFeatured === true,
      image: singleImage || (imagePaths.length > 0 ? imagePaths[0] : ""),
      images: imagePaths,
      itinerary: itineraryPath,
    });

    await newTour.save();
    const tourObj = newTour.toObject();
    res.status(201).json({ success: true, tour: newTour, ...tourObj });
  } catch (error) {
    console.error("Create Tour Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE tour
export const updateTour = async (req, res) => {
  try {
    const { title, name, destination, duration, price, currency, pricingUnit, rating, reviews, inclusions, exclusions, highlights, isFeatured } = req.body;

    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }

    let updateData = { ...req.body };

    if (name || title) updateData.name = name || title;
    if (destination) updateData.destination = destination;
    if (duration !== undefined) updateData.duration = duration;
    if (price !== undefined) updateData.price = String(price);
    if (currency) updateData.currency = currency;
    if (pricingUnit) updateData.pricingUnit = pricingUnit;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (reviews !== undefined) updateData.reviews = Number(reviews);

    const parseListField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === "string") {
        try {
          const parsed = JSON.parse(field);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          const separator = field.includes("\n") ? "\n" : ",";
          return field
            .split(separator)
            .map((item) => item.replace(/^[\s•\-\*]+/, "").trim())
            .filter((item) => item.length > 0);
        }
      }
      return [];
    };

    if (inclusions !== undefined) {
      updateData.inclusions = parseListField(inclusions);
    }
    if (exclusions !== undefined) {
      updateData.exclusions = parseListField(exclusions);
    }
    if (highlights !== undefined) {
      updateData.highlights = parseListField(highlights);
    }
    if (isFeatured !== undefined) {
      updateData.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (req.files) {
      let imagePaths = [];
      let singleImage = "";
      let itineraryPath = "";

      if (Array.isArray(req.files)) {
        req.files.forEach((file) => {
          const fileUrl = `/uploads/${file.filename}`;
          if (file.fieldname === "itinerary") {
            itineraryPath = fileUrl;
          } else if (file.fieldname === "image") {
            singleImage = fileUrl;
            imagePaths.push(fileUrl);
          } else {
            imagePaths.push(fileUrl);
          }
        });
      } else if (typeof req.files === "object") {
        if (req.files.image && req.files.image.length > 0) {
          singleImage = `/uploads/${req.files.image[0].filename}`;
          imagePaths.push(singleImage);
        }
        if (req.files.images && Array.isArray(req.files.images)) {
          req.files.images.forEach((file) => imagePaths.push(`/uploads/${file.filename}`));
        }
        if (req.files.itinerary && req.files.itinerary.length > 0) {
          itineraryPath = `/uploads/${req.files.itinerary[0].filename}`;
        }
      }

      if (singleImage) updateData.image = singleImage;
      if (imagePaths.length > 0) updateData.images = imagePaths;
      if (itineraryPath) updateData.itinerary = itineraryPath;
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    const tourObj = updatedTour.toObject();
    res.status(200).json({ success: true, tour: updatedTour, ...tourObj });
  } catch (error) {
    console.error("Update Tour Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE tour
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }
    res.status(200).json({ success: true, message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Delete Tour Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
