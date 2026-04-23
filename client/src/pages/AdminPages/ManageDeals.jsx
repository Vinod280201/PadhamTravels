import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  Plane,
  Calendar,
  AlertTriangle,
  Loader2,
  Tag,
  Edit,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ManageDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // --- FORM STATE ---
  const initialFormState = {
    origin: "",
    destination: "",
    type: "Direct Flight",
    dealName: "",
    date: "",
    price: "",
    alert: "",
    validity: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/deals`);
      if (res.ok) {
        const data = await res.json();
        setDeals(data);
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleEditClick = (deal) => {
    setEditingId(deal._id);
    setFormData({
      origin: deal.origin,
      destination: deal.destination,
      type: deal.type,
      dealName: deal.dealName || "",
      date: deal.date,
      price: deal.price,
      alert: deal.alert || "",
      validity: deal.validity || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSaveDeal = async () => {
    if (!formData.origin || !formData.destination || !formData.price) {
      alert("Please fill in required fields (Origin, Dest, Price)");
      return;
    }

    try {
      const isEditing = !!editingId;
      const url = isEditing
        ? `${baseUrl}/deals/${editingId}`
        : `${baseUrl}/deals`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchDeals();
        handleCancelEdit();
      } else {
        alert(`Failed to ${isEditing ? "update" : "create"} deal`);
      }
    } catch (error) {
      console.error("Error saving deal:", error);
    }
  };

  const handleDeleteDeal = async (id) => {
    if (!confirm("Delete this deal?")) return;
    try {
      const res = await fetch(`${baseUrl}/deals/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeals(deals.filter((d) => d._id !== id));
        if (id === editingId) handleCancelEdit();
      }
    } catch (error) {
      console.error("Error deleting deal:", error);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
          Manage Deals & Offers
        </h1>
        <p className="text-slate-500">
          Create and manage flight offers displayed on the Search Page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- LEFT COLUMN: FORM --- */}
        <div className="lg:col-span-1">
          <Card
            className={`border shadow-sm sticky pt-0 top-6 ${editingId ? "border-orange-400 ring-1 ring-orange-200" : "border-slate-300"}`}
          >
            <CardHeader className="bg-slate-100 border-b border-slate-200 rounded-t-xl pt-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit className="w-5 h-5 text-orange-600" />
                    Edit Deal
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-orange-600" />
                    Add New Deal
                  </>
                )}
              </CardTitle>
              {editingId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="h-6 px-2 text-slate-500"
                >
                  <X size={16} className="mr-1" /> Cancel
                </Button>
              )}
            </CardHeader>
            <CardContent className="pb-3 px-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Origin
                  </label>
                  <Input
                    name="origin"
                    placeholder="e.g. Chennai"
                    value={formData.origin}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Destination
                  </label>
                  <Input
                    name="destination"
                    placeholder="e.g. Jaipur"
                    value={formData.destination}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Flight Type
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Direct Flight">
                        Direct Flight
                      </SelectItem>
                      <SelectItem value="Connecting">
                        Connecting Flight
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Deal Name (Optional)
                  </label>
                  <Input
                    name="dealName"
                    placeholder="e.g. Feb Month SPL Deal"
                    value={formData.dealName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Date
                  </label>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Price (₹)
                  </label>
                  <Input
                    name="price"
                    type="number"
                    placeholder="e.g. 4500"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">
                  Badge Text (Optional)
                </label>
                <Input
                  name="alert"
                  placeholder="e.g. Last Seat"
                  value={formData.alert}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">
                  Validity Text
                </label>
                <Input
                  name="validity"
                  placeholder="e.g. Valid till midnight"
                  value={formData.validity}
                  onChange={handleInputChange}
                />
              </div>

              <Button
                onClick={handleSaveDeal}
                className={`w-full text-white mt-4 ${editingId ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600"}`}
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? "Update Deal" : "Publish Deal"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: EXISTING DEALS LIST --- */}
        <div className="lg:col-span-2">
          <Card className="border-slate-300 shadow-sm">
            {/* FIX: Removed border-b to remove white gap */}
            <CardHeader className="">
              <CardTitle className="text-xl flex items-center justify-between">
                <span>Active Deals ({deals.length})</span>
                {loading && (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Route</TableHead>
                    <TableHead>Deal Info</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.length === 0 && !loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-slate-500"
                      >
                        No active deals. Add one from the left.
                      </TableCell>
                    </TableRow>
                  ) : (
                    deals.map((deal) => (
                      <TableRow
                        key={deal._id}
                        className={editingId === deal._id ? "bg-orange-50" : ""}
                      >
                        <TableCell>
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            {deal.origin}{" "}
                            <Plane className="w-3 h-3 text-slate-400" />{" "}
                            {deal.destination}
                          </div>
                          <div className="text-xs text-slate-500">
                            {deal.type}
                          </div>
                        </TableCell>
                        <TableCell>
                          {deal.dealName ? (
                            <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                              <Tag className="w-3 h-3" /> {deal.dealName}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              No name
                            </span>
                          )}
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {deal.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-emerald-600">
                            ₹{deal.price.toLocaleString("en-IN")}
                          </span>
                        </TableCell>
                        <TableCell>
                          {deal.alert && (
                            <Badge
                              variant="outline"
                              className="border-red-200 text-red-600 bg-red-50"
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {deal.alert}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(deal)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDeal(deal._id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
