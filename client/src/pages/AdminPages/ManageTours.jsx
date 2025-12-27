import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { apiGet, apiPost, apiPut, apiDelete } from "@/apiClient";

const initialForm = {
  name: "",
  destination: "",
  duration: "",
  price: "",
  rating: "",
  reviews: "",
  available: "",
  highlights: "",
  image: "",
};

const isAuthError = (message = "") =>
  message.toLowerCase().includes("unauthorized") ||
  message.toLowerCase().includes("session expired");

const handleAuthError = (err) => {
  const message = err?.message || "";
  if (isAuthError(message)) {
    alert("Session expired or unauthorized. Please login again.");
    window.location.href = "/login";
    return true; // auth error handled
  }
  return false; // not an auth error
};

const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load existing tours
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiGet("/tours");
        const data = await res.json();
        setTours(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("LOAD TOURS ERROR:", err);

        if (!handleAuthError(err)) {
          setError("Could not load tours.");
        }
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

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.destination.trim() || !form.price.trim()) {
      alert("Name, destination and price are required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      destination: form.destination.trim(),
      duration: form.duration.trim(),
      price: form.price.trim(),
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      available: Number(form.available) || 0,
      highlights: form.highlights
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
      image: form.image.trim(),
    };

    try {
      setSaving(true);
      setError(null);

      if (!editingId) {
        const res = await apiPost("/tours", payload);
        const created = await res.json();
        setTours((prev) => [...prev, created]);
      } else {
        const res = await apiPut(`/tours/${editingId}`, payload);
        const updated = await res.json();

        setTours((prev) =>
          prev.map((t) =>
            t.id === editingId || t._id === editingId ? updated : t
          )
        );
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("SAVE TOUR ERROR:", err);

      // If this was NOT an auth error, show generic error text
      if (!handleAuthError(err)) {
        setError("Could not save tour. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditClick = (tour) => {
    setEditingId(tour.id || tour._id);
    setForm({
      name: tour.name || "",
      destination: tour.destination || "",
      duration: tour.duration || "",
      price: tour.price || "",
      rating: String(tour.rating ?? ""),
      reviews: String(tour.reviews ?? ""),
      available: String(tour.available ?? ""),
      highlights: (tour.highlights || []).join(", "),
      image: tour.image || "",
    });
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;

    try {
      await apiDelete(`/tours/${id}`);

      setTours((prev) => prev.filter((t) => t.id !== id && t._id !== id));
    } catch (err) {
      console.error("DELETE TOUR ERROR:", err);

      if (!handleAuthError(err)) {
        alert("Could not delete tour. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Manage Tours</h1>

        <Button
          onClick={handleAddClick}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          + Add Tour
        </Button>
      </div>

      {/* Collapsible Add/Edit Form */}
      {showForm && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Tour" : "Add New Tour"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="text-sm text-slate-500 hover:underline"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Swiss Alps Adventure"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Destination *
                </label>
                <Input
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="Switzerland"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration
                </label>
                <Input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="7 Days / 6 Nights"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Price *
                </label>
                <Input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="₹1,25,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <Input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="4.8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Reviews
                </label>
                <Input
                  name="reviews"
                  type="number"
                  min="0"
                  value={form.reviews}
                  onChange={handleChange}
                  placeholder="124"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Available Seats
                </label>
                <Input
                  name="available"
                  type="number"
                  min="0"
                  value={form.available}
                  onChange={handleChange}
                  placeholder="5"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Highlights (comma separated)
                </label>
                <Textarea
                  name="highlights"
                  rows={2}
                  value={form.highlights}
                  onChange={handleChange}
                  placeholder="Mountain Hiking, Cable Car Rides, Swiss Villages, Lake Cruises"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <Input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Tour"
                    : "Add Tour"}
                </Button>
              </div>
            </form>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </CardContent>
        </Card>
      )}

      {/* Existing Tours List */}
      <h2 className="text-xl font-semibold mb-3">Existing Tours</h2>
      {loading ? (
        <p>Loading tours...</p>
      ) : tours.length === 0 ? (
        <p>No tours found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tours.map((t) => {
            const id = t.id || t._id;
            return (
              <Card key={id} className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold">{t.name}</h3>
                      <span className="text-xs text-slate-500">
                        {t.destination}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(t)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    {t.duration} • {t.price}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Available: {t.available} • Rating: {t.rating} (
                    {Number(t.reviews || 0).toLocaleString()} reviews)
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageTours;
