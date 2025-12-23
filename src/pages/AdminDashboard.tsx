import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Plus,
  Search,
  LogOut,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Eye,
  Trash2,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/integrations/supabase/client";

interface Shipment {
  id: string;
  tracking_number: string;
  status: string;
  sender_name: string | null;
  recipient_name: string | null;
  origin_location: string;
  destination_location: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "in-transit": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "out-for-delivery": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const AdminDashboard = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/auth");
      return;
    }
    fetchShipments();
  }, [isAuthenticated, navigate]);

  const fetchShipments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch shipments");
      console.error(error);
    } else {
      setShipments(data || []);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/auth");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return;

    const { error } = await supabase.from("shipments").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete shipment");
    } else {
      toast.success("Shipment deleted");
      fetchShipments();
    }
  };

  const filteredShipments = shipments.filter(
    (s) =>
      s.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sender_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === "in-transit").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
    pending: shipments.filter((s) => s.status === "processing").length,
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-foreground">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Shipment Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Shipments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.inTransit}</p>
                  <p className="text-xs text-muted-foreground">In Transit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipments Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-display">Shipments</CardTitle>
                <CardDescription>Manage all shipments and packages</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search shipments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Button variant="hero" onClick={() => navigate("/admin/shipments/new")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Package
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No shipments found</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => navigate("/admin/shipments/new")}
                >
                  Create your first shipment
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Sender</TableHead>
                      <TableHead className="hidden md:table-cell">Recipient</TableHead>
                      <TableHead className="hidden lg:table-cell">Route</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-mono font-medium">
                          {shipment.tracking_number}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusColors[shipment.status] || "bg-muted text-muted-foreground"}
                          >
                            {shipment.status.replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {shipment.sender_name || "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {shipment.recipient_name || "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {shipment.origin_location} → {shipment.destination_location}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {new Date(shipment.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/track/${shipment.tracking_number}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/shipments/${shipment.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(shipment.id)}
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
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
