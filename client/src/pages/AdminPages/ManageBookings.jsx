import { useState } from "react";
import { Search, Filter, Eye, Edit, Trash2, Download } from "lucide-react";
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
import CONSTANTS from "@/constants/AppConstants";

export const ManageBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const bookings = CONSTANTS.BOOKINGS;

  const getStatusBadge = (status) => {
    const styles = {
      Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Pending: "bg-amber-50 text-amber-700 border-amber-200",
      Cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return styles[status] || "bg-slate-50 text-slate-700";
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Manage Bookings
          </h1>
          <p className="text-slate-500 text-lg">
            View and manage all flight bookings
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-slate-300" data-testid="bookings-filter-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search by booking ref, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 "
                data-testid="search-bookings-input"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger
                className="w-full md:w-48 h-10"
                data-testid="status-filter-select"
              >
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md px-6 py-2"
              data-testid="export-bookings-btn"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="border-slate-300" data-testid="bookings-table-card">
        <CardHeader>
          <CardTitle className="text-2xl">
            All Bookings ({bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-300 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-900">
                    Booking Ref
                  </TableHead>
                  <TableHead className="font-semibold text-slate-900">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-slate-900">
                    Flight
                  </TableHead>
                  <TableHead className="font-semibold text-slate-900">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-slate-900">
                    Passengers
                  </TableHead>
                  <TableHead className="font-semibold text-slate-900">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold text-slate-900">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-900 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    className="hover:bg-slate-50"
                    data-testid={`booking-row-${booking.id}`}
                  >
                    <TableCell className="font-medium">
                      {booking.bookingRef}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">
                          {booking.customer}
                        </p>
                        <p className="text-sm text-slate-500">
                          {booking.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {booking.flight}
                    </TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.passengers}</TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {booking.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusBadge(booking.status)}
                        data-testid={`status-badge-${booking.id}`}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          data-testid={`view-booking-${booking.id}-btn`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          data-testid={`edit-booking-${booking.id}-btn`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`delete-booking-${booking.id}-btn`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageBookings;
