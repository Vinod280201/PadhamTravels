import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import apiClient, { apiGet, apiPost, apiPut, apiDelete } from "@/apiClient";
import { formatPrice, getTourImageUrl } from "@/lib/utils";
import {
  X,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  MapPin,
  Clock,
  Plus,
} from "lucide-react";

const SERVER_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
const API_BASE = SERVER_BASE;

const parseBulletLines = (text) => {
  if (!text) return [];
  if (Array.isArray(text)) return text;
  return text
    .split("\n")
    .map((line) => line.replace(/^[\s•\-\*]+/, "").trim())
    .filter((line) => line.length > 0);
};

const initialForm = {
  name: "",
  destination: "",
  duration: "",
  price: "",
  currency: "INR",
  pricingUnit: "per person",
  rating: "",
  reviews: "",
  itinerary: "",
  highlights: "",
  inclusions: "",
  exclusions: "",
  isFeatured: false,
  image: null,
};

const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load existing tours
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const res = await apiGet("/tours");
        const data = await res.json();
        const tourList = Array.isArray(data) ? data : (data.tours || []);
        setTours(tourList);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        alert("File size exceeds 20MB. Please choose an optimized image under 20MB.");
        e.target.value = null;
        return;
      }
      setSelectedFile(file);
    }
  };

  const handlePdfChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        alert("File size exceeds 20MB. Please choose a PDF file under 20MB.");
        e.target.value = null;
        return;
      }
      setSelectedPdf(file);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setSelectedFile(null);
    setSelectedPdf(null);
    setEditingId(null);
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
      formData.append("currency", form.currency || "INR");
      formData.append("pricingUnit", form.pricingUnit || "per person");
      formData.append("rating", form.rating || 0);
      formData.append("reviews", form.reviews || 0);
      formData.append("highlights", JSON.stringify(parseBulletLines(form.highlights)));
      formData.append("inclusions", JSON.stringify(parseBulletLines(form.inclusions)));
      formData.append("exclusions", JSON.stringify(parseBulletLines(form.exclusions)));
      formData.append("isFeatured", form.isFeatured);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (selectedPdf) {
        formData.append("itinerary", selectedPdf);
      }

      const path = editingId ? `/tours/${editingId}` : "/tours";
      const res = editingId
        ? await apiPut(path, formData)
        : await apiPost(path, formData);

      const savedData = await res.json();
      const savedTour = savedData.tour || savedData;

      if (!editingId) {
        setTours((prev) => [savedTour, ...prev]);
      } else {
        setTours((prev) =>
          prev.map((t) =>
            (t.id || t._id) === editingId ? savedTour : t
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
      name: tour.name || tour.title || "",
      destination: tour.destination || "",
      duration: tour.duration || "",
      price: tour.price || "",
      currency: tour.currency || "INR",
      pricingUnit: tour.pricingUnit || "per person",
      rating: tour.rating || "",
      reviews: tour.reviews || "",
      itinerary: tour.itinerary || "",
      highlights: Array.isArray(tour.highlights)
        ? tour.highlights.join("\n")
        : tour.highlights || "",
      inclusions: Array.isArray(tour.inclusions)
        ? tour.inclusions.join("\n")
        : tour.inclusions || "",
      exclusions: Array.isArray(tour.exclusions)
        ? tour.exclusions.join("\n")
        : tour.exclusions || "",
      isFeatured: tour.isFeatured || false,
      image: tour.image || "",
    });
    setSelectedFile(null);
    setSelectedPdf(null);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (!confirm("Delete this tour?")) return;
    try {
      await apiDelete(`/tours/${id}`);
      setTours((prev) => prev.filter((t) => (t.id || t._id) !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Manage Tour Packages
          </h1>
          <p className="text-slate-500 text-sm">
            Create, update or remove tour packages for your website showcase
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Plus size={18} />
          <span>Add New Tour</span>
        </button>
      </div>

      {/* FORM SECTION */}
      {showForm && (
        <Card className="bg-white border-slate-200 shadow-md rounded-2xl">
          <CardContent className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
              <h2 className="text-xl font-extrabold text-slate-800">
                {editingId ? "Edit Tour Details" : "Add New Tour Package"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700"
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
                <Label htmlFor="name" className="mb-1.5 block font-bold text-slate-700 text-xs uppercase">
                  Tour Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Swiss Alps Adventure"
                  className="bg-slate-50/50 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl"
                />
              </div>

              {/* Destination */}
              <div>
                <Label
                  htmlFor="destination"
                  className="mb-1.5 block font-bold text-slate-700 text-xs uppercase"
                >
                  Destination <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="destination"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="e.g. Switzerland"
                  className="bg-slate-50/50 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl"
                />
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration" className="mb-1.5 block font-bold text-slate-700 text-xs uppercase">
                  Duration
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 7 Days / 6 Nights"
                  className="bg-slate-50/50 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl"
                />
              </div>

              {/* Price & Currency */}
              <div>
                <Label htmlFor="price" className="mb-1.5 block font-bold text-slate-700 text-xs uppercase">
                  Price & Currency <span className="text-red-500">*</span>
                </Label>
                <div className="flex rounded-xl border border-slate-200 bg-slate-50/50 focus-within:ring-2 focus-within:ring-cyan-100 focus-within:border-cyan-500 overflow-hidden transition">
                  {/* Currency Selector */}
                  <select
                    id="currency"
                    name="currency"
                    value={form.currency || "INR"}
                    onChange={handleChange}
                    className="bg-slate-100/80 border-r border-slate-200 text-slate-700 text-sm font-semibold px-3 py-2.5 outline-none cursor-pointer hover:bg-slate-200/60 transition shrink-0"
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="AED">AED</option>
                    <option value="SGD">S$ SGD</option>
                    <option value="THB">฿ THB</option>
                  </select>

                  {/* Amount Input */}
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="e.g. 35000"
                    className="w-full border-0 bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus-visible:ring-0 shadow-none rounded-none"
                  />
                </div>
              </div>

              {/* Pricing Basis */}
              <div>
                <Label htmlFor="pricingUnit" className="mb-1.5 block font-bold text-slate-700 text-xs uppercase">
                  Pricing Basis <span className="text-red-500">*</span>
                </Label>
                <select
                  id="pricingUnit"
                  name="pricingUnit"
                  value={form.pricingUnit || "per person"}
                  onChange={handleChange}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 font-medium outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 transition cursor-pointer"
                >
                  <option value="per person">Per Person</option>
                  <option value="for 2 persons">For 2 Persons (Twin Sharing)</option>
                  <option value="for couple">For Couple</option>
                  <option value="total package">Total Package</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <Label htmlFor="rating" className="mb-1.5 block font-bold text-slate-700 text-xs uppercase">
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
                  className="bg-slate-50/50 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl"
                />
              </div>

              {/* Reviews */}
              <div>
                <Label htmlFor="reviews" className="mb-1.5 block font-bold text-slate-700 text-xs uppercase">
                  Review Count
                </Label>
                <Input
                  id="reviews"
                  name="reviews"
                  type="number"
                  value={form.reviews}
                  onChange={handleChange}
                  placeholder="e.g. 124"
                  className="bg-slate-50/50 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl"
                />
              </div>

              {/* PDF UPLOAD */}
              <div className="md:col-span-2">
                <Label className="mb-1.5 block font-bold text-slate-700 text-xs uppercase">
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
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      className="cursor-pointer bg-white border-slate-200"
                    >
                      <label
                        htmlFor="pdf-upload"
                        className="flex items-center gap-2 font-semibold"
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
                          className="text-xs font-semibold text-cyan-600 hover:underline flex items-center justify-center sm:justify-start gap-1"
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
                  <div className="flex items-center justify-between p-3 bg-cyan-50 border border-cyan-200 rounded-xl">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={20} className="text-cyan-600 shrink-0" />
                      <span className="text-sm font-semibold text-cyan-900 truncate max-w-[150px] sm:max-w-xs">
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
                <Label className="mb-1.5 block font-bold text-slate-700 text-xs uppercase">Tour Image</Label>
                <Input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!selectedFile ? (
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      className="cursor-pointer bg-white border-slate-200"
                    >
                      <label
                        htmlFor="image-upload"
                        className="flex items-center gap-2 font-semibold"
                      >
                        <ImageIcon size={16} /> Select Image
                      </label>
                    </Button>

                    {editingId && form.image ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={getTourImageUrl({ image: form.image })}
                          alt="Current"
                          className="h-10 w-16 object-cover rounded-md border border-slate-200"
                        />
                        <span className="text-xs font-medium text-slate-500">
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
                  <div className="flex items-center justify-between p-3 bg-cyan-50 border border-cyan-200 rounded-xl">
                    <div className="flex items-center gap-2 truncate">
                      <ImageIcon
                        size={20}
                        className="text-cyan-600 shrink-0"
                      />
                      <span className="text-sm font-semibold text-cyan-900 truncate max-w-[150px] sm:max-w-xs">
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
                  className="mb-1.5 block font-bold text-slate-700 text-xs uppercase"
                >
                  HIGHLIGHTS (ONE PER LINE OR BULLETS)
                </Label>
                <Textarea
                  id="highlights"
                  name="highlights"
                  value={form.highlights}
                  onChange={handleChange}
                  placeholder={`• Mountain Hiking & Trekking\n• Cable Car Rides in Alps\n• Scenic River Cruise`}
                  rows={4}
                  className="bg-slate-50/50 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl font-sans text-sm"
                />
              </div>

              {/* Inclusions */}
              <div>
                <Label
                  htmlFor="inclusions"
                  className="mb-1.5 block font-bold text-emerald-700 text-xs uppercase"
                >
                  PACKAGE INCLUSIONS (ONE PER LINE OR BULLETS)
                </Label>
                <Textarea
                  id="inclusions"
                  name="inclusions"
                  value={form.inclusions}
                  onChange={handleChange}
                  placeholder={`• Accommodation on Double Sharing Basis\n• Breakfast & Dinner throughout the tour\n• Private Vehicle for Transfers & Sightseeing`}
                  rows={4}
                  className="bg-slate-50/50 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl font-sans text-sm"
                />
              </div>

              {/* Exclusions */}
              <div>
                <Label
                  htmlFor="exclusions"
                  className="mb-1.5 block font-bold text-red-700 text-xs uppercase"
                >
                  PACKAGE EXCLUSIONS (ONE PER LINE OR BULLETS)
                </Label>
                <Textarea
                  id="exclusions"
                  name="exclusions"
                  value={form.exclusions}
                  onChange={handleChange}
                  placeholder={`• Personal Expenses & Laundry\n• Flight / Train Tickets\n• Any optional activity fees`}
                  rows={4}
                  className="bg-slate-50/50 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl font-sans text-sm"
                />
              </div>

              {/* Is Featured Toggle */}
              <div className="md:col-span-2 flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <Label htmlFor="isFeatured" className="font-semibold text-slate-800 cursor-pointer text-sm">
                  Feature this package on the Landing Page Hero Showcase
                </Label>
              </div>

              {/* Actions */}
              <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="w-full sm:w-auto rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold"
                >
                  {saving ? "Saving..." : "Save Tour Package"}
                </Button>
              </div>
            </form>
            {error && (
              <p className="text-red-500 mt-4 text-center text-sm font-semibold">{error}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* TOUR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {tours.map((t) => (
          <Card
            key={t.id || t._id}
            className="bg-white overflow-hidden border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group rounded-2xl"
          >
            <div className="flex flex-col sm:flex-row h-full">
              {/* IMAGE SECTION */}
              <div className="relative w-full sm:w-40 md:w-48 h-48 sm:h-auto shrink-0 bg-slate-100">
                {t.image || (t.images && t.images.length > 0) ? (
                  <img
                    src={getTourImageUrl(t)}
                    alt={t.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image")
                    }
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT SECTION */}
              <div className="flex flex-col flex-1 p-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-extrabold text-base md:text-lg text-slate-900 line-clamp-2 leading-tight">
                      {t.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-cyan-600 whitespace-nowrap text-base block">
                        {formatPrice(t.price, t.currency)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium capitalize block">
                        /{t.pricingUnit || "person"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-3">
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
                      className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-lg hover:bg-cyan-100 inline-flex items-center gap-1 transition-colors border border-cyan-100"
                    >
                      <FileText size={12} /> View Itinerary PDF
                    </a>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditClick(t)}
                    className="h-8 px-3 text-xs rounded-lg font-semibold"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(t.id || t._id)}
                    className="h-8 px-3 text-xs bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-lg font-semibold"
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
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm font-medium">
          No tours found. Click "Add New Tour" to create one.
        </div>
      )}
    </div>
  );
};

export default ManageTours;
