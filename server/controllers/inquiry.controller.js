import Inquiry from "../models/Inquiry.js";

// Submit a new inquiry (Public)
export const createInquiry = async (req, res) => {
  try {
    const { name, phone, email, destination, tourId, tourTitle, travelDate, numberOfTravelers, travelers, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and Phone number are required." });
    }

    const count = Number(travelers || numberOfTravelers) || 1;

    const inquiry = new Inquiry({
      name,
      phone,
      email,
      destination,
      tourId: tourId || null,
      tourTitle,
      travelDate,
      numberOfTravelers: count,
      travelers: count,
      message,
    });

    const savedInquiry = await inquiry.save();
    res.status(201).json({ success: true, data: savedInquiry, message: "Inquiry submitted successfully!" });
  } catch (err) {
    console.error("Create Inquiry Error:", err);
    res.status(500).json({ message: "Failed to submit inquiry." });
  }
};

// Get all inquiries (Admin)
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("tourId", "title name destination duration price currency inclusions exclusions highlights images image")
      .sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (err) {
    console.error("Get Inquiries Error:", err);
    res.status(500).json({ message: "Failed to fetch inquiries." });
  }
};

// Update inquiry status (Admin)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found." });
    }
    res.status(200).json(inquiry);
  } catch (err) {
    res.status(500).json({ message: "Failed to update inquiry status." });
  }
};

// Delete inquiry (Admin)
export const deleteInquiry = async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Inquiry deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete inquiry." });
  }
};
