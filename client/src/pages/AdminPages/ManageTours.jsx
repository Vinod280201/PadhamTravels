import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { apiGet, apiDelete } from "@/apiClient";
import {
  X,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  MapPin,
  Clock,
} from "lucide-react";

// 1. Get Backend URL for images
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const initialForm = {
  name: "",
  destination: "",
  duration: "",
  price: "",
  rating: "",
  reviews: "",
  itinerary: "", // Stores DB path string
  highlights: "",
  image: null, // Stores DB path string
};

const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // File states hold the actual File objects when selected
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load existing tours
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const res = await apiGet("/admin/tours");
        const data = await res.json();
        setTours(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- File Handlers ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePdfChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedPdf(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setSelectedFile(null);
    setSelectedPdf(null);
    setEditingId(null);
    // Reset file inputs visually
    if (document.getElementById("image-upload"))
      document.getElementById("image-upload").value = "";
    if (document.getElementById("pdf-upload"))
      document.getElementById("pdf-upload").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.destination || !form.price) {
      alert("Name, Destination, and Price are required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("destination", form.destination);
      formData.append("duration", form.duration);
      formData.append("price", form.price);
      formData.append("rating", form.rating || 0);
      formData.append("reviews", form.reviews || 0);
      formData.append("highlights", form.highlights);

      // Only append files if a *new* one was selected
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (selectedPdf) {
        formData.append("itinerary", selectedPdf);
      }

      const url = editingId
        ? `${API_BASE}/api/admin/tours/${editingId}`
        : `${API_BASE}/api/admin/tours`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to save tour");
      }

      const savedData = await res.json();

      if (!editingId) {
        setTours((prev) => [savedData, ...prev]);
      } else {
        setTours((prev) =>
          prev.map((t) =>
            t.id === editingId || t._id === editingId ? savedData : t
          )
        );
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("SAVE ERROR:", err);
      setError("Could not save tour.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (tour) => {
    setEditingId(tour.id || tour._id);
    setForm({
      name: tour.name || "",
      destination: tour.destination || "",
      duration: tour.duration || "",
      price: tour.price || "",
      rating: tour.rating || "",
      reviews: tour.reviews || "",
      itinerary: tour.itinerary || "",
      highlights: Array.isArray(tour.highlights)
        ? tour.highlights.join(", ")
        : tour.highlights,
      image: tour.image || "",
    });
    setSelectedFile(null);
    setSelectedPdf(null);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (!confirm("Delete this tour?")) return;
    try {
      await apiDelete(`/admin/tours/${id}`);
      setTours((prev) => prev.filter((t) => (t.id || t._id) !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Manage Tours
          </h1>
          <p className="text-slate-500 text-sm">
            Create, update or remove tour packages
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
        >
          + Add New Tour
        </Button>
      </div>

      {/* FORM SECTION */}
      {showForm && (
        <Card className="mb-8 border-slate-300 shadow-md">
          <CardContent className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold text-slate-800">
                {editingId ? "Edit Tour Details" : "Add New Tour"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                className="h-8 w-8 p-0 text-slate-400"
              >
                <X size={20} />
              </Button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            >
              {/* Name */}
              <div>
                <Label htmlFor="name" className="mb-1.5 block font-medium">
                  Tour Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Swiss Alps Adventure"
                  className="bg-white"
                />
              </div>

              {/* Destination */}
              <div>
                <Label
                  htmlFor="destination"
                  className="mb-1.5 block font-medium"
                >
                  Destination <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="destination"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="e.g. Switzerland"
                  className="bg-white"
                />
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration" className="mb-1.5 block font-medium">
                  Duration
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 7 Days / 6 Nights"
                  className="bg-white"
                />
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price" className="mb-1.5 block font-medium">
                  Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. ₹1,25,000"
                  className="bg-white"
                />
              </div>

              {/* Rating */}
              <div>
                <Label htmlFor="rating" className="mb-1.5 block font-medium">
                  Rating (0-5)
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  max="5"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="e.g. 4.8"
                  className="bg-white"
                />
              </div>

              {/* Reviews */}
              <div>
                <Label htmlFor="reviews" className="mb-1.5 block font-medium">
                  Review Count
                </Label>
                <Input
                  id="reviews"
                  name="reviews"
                  type="number"
                  value={form.reviews}
                  onChange={handleChange}
                  placeholder="e.g. 124"
                  className="bg-white"
                />
              </div>

              {/* PDF UPLOAD */}
              <div className="md:col-span-2">
                <Label className="mb-1.5 block font-medium">
                  Itinerary PDF
                </Label>
                <Input
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />

                {!selectedPdf ? (
                  <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      className="cursor-pointer bg-white"
                    >
                      <label
                        htmlFor="pdf-upload"
                        className="flex items-center gap-2"
                      >
                        <UploadCloud size={16} /> Select PDF
                      </label>
                    </Button>
                    <div className="flex-1 text-center sm:text-left">
                      {editingId && form.itinerary ? (
                        <a
                          href={`${API_BASE}${form.itinerary}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center justify-center sm:justify-start gap-1"
                        >
                          <FileText size={14} /> View Current PDF
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">
                          No file chosen
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={20} className="text-blue-600 shrink-0" />
                      <span className="text-sm font-medium text-blue-900 truncate max-w-[150px] sm:max-w-xs">
                        {selectedPdf.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                      onClick={() => {
                        setSelectedPdf(null);
                        document.getElementById("pdf-upload").value = "";
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </div>

              {/* IMAGE UPLOAD */}
              <div className="md:col-span-2">
                <Label className="mb-1.5 block font-medium">Tour Image</Label>
                <Input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!selectedFile ? (
                  <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      className="cursor-pointer bg-white"
                    >
                      <label
                        htmlFor="image-upload"
                        className="flex items-center gap-2"
                      >
                        <ImageIcon size={16} /> Select Image
                      </label>
                    </Button>

                    {editingId && form.image ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={`${API_BASE}${form.image}`}
                          alt="Current"
                          className="h-10 w-16 object-cover rounded border border-slate-200"
                        />
                        <span className="text-xs text-slate-500">
                          Current Image
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        JPG, PNG or WEBP
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2 truncate">
                      <ImageIcon
                        size={20}
                        className="text-green-600 shrink-0"
                      />
                      <span className="text-sm font-medium text-green-900 truncate max-w-[150px] sm:max-w-xs">
                        {selectedFile.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                      onClick={() => {
                        setSelectedFile(null);
                        document.getElementById("image-upload").value = "";
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </div>

              {/* Highlights */}
              <div className="md:col-span-2">
                <Label
                  htmlFor="highlights"
                  className="mb-1.5 block font-medium"
                >
                  Highlights
                </Label>
                <Textarea
                  id="highlights"
                  name="highlights"
                  value={form.highlights}
                  onChange={handleChange}
                  placeholder="e.g. Mountain Hiking, Cable Car Rides"
                  rows={3}
                  className="bg-white"
                />
              </div>

              {/* Actions */}
              <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {saving ? "Saving..." : "Save Tour"}
                </Button>
              </div>
            </form>
            {error && (
              <p className="text-red-500 mt-4 text-center text-sm">{error}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* TOUR GRID */}
      {/* - Mobile: 1 col
         - Tablet: 1 col (but horizontal cards)
         - Desktop: 2 cols
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {tours.map((t) => (
          <Card
            key={t.id || t._id}
            className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
          >
            {/* Responsive Card Layout:
               - Mobile: Flex-col (Image Top, Content Bottom)
               - Tablet+: Flex-row (Image Left, Content Right)
            */}
            <div className="flex flex-col sm:flex-row h-full">
              {/* IMAGE SECTION */}
              <div className="relative w-full sm:w-40 md:w-48 h-48 sm:h-auto shrink-0 bg-slate-100">
                {t.image ? (
                  <img
                    src={`${API_BASE}${t.image}`}
                    alt={t.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image")
                    }
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT SECTION */}
              <div className="flex flex-col flex-1 p-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-tight">
                      {t.name}
                    </h3>
                    <span className="font-bold text-orange-600 whitespace-nowrap">
                      {t.price}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm text-slate-500 mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="truncate">{t.destination}</span>
                    </div>
                    {t.duration && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        <span>{t.duration}</span>
                      </div>
                    )}
                  </div>

                  {t.itinerary && (
                    <a
                      href={`${API_BASE}${t.itinerary}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 inline-flex items-center gap-1 transition-colors"
                    >
                      <FileText size={12} /> View Itinerary
                    </a>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditClick(t)}
                    className="h-8 px-3 text-xs"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(t.id || t._id)}
                    className="h-8 px-3 text-xs bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!loading && tours.length === 0 && (
        <div className="text-center py-10 text-slate-500">
          No tours found. Click "Add New Tour" to create one.
        </div>
      )}
    </div>
  );
};

export default ManageTours;
