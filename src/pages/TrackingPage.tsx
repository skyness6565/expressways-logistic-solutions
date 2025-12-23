import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ArrowLeft,
  Plane,
  Ship,
  Building2,
  Home,
  Box,
  PackageCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ShipmentData {
  tracking_number: string;
  status: string;
  origin_location: string;
  destination_location: string;
  current_location: string | null;
  estimated_delivery: string | null;
  sender_name: string | null;
  recipient_name: string | null;
  recipient_address: string | null;
  recipient_country: string | null;
  package_description: string | null;
  weight_kg: number | null;
  shipping_fee: number | null;
  currency: string | null;
  service_type: string;
}

interface TrackingEvent {
  id: string;
  title: string;
  location: string;
  event_date: string;
  completed: boolean;
}

const statusIcons: Record<string, React.ReactNode> = {
  "processing": <Box className="w-5 h-5" />,
  "picked-up": <PackageCheck className="w-5 h-5" />,
  "in-transit": <Truck className="w-5 h-5" />,
  "at-sorting-center": <Building2 className="w-5 h-5" />,
  "customs-clearance": <Ship className="w-5 h-5" />,
  "out-for-delivery": <Plane className="w-5 h-5" />,
  "delivered": <Home className="w-5 h-5" />,
};

const statusLabels: Record<string, string> = {
  "processing": "Processing",
  "picked-up": "Picked Up",
  "in-transit": "In Transit",
  "at-sorting-center": "At Sorting Center",
  "customs-clearance": "Customs Clearance",
  "out-for-delivery": "Out for Delivery",
  "delivered": "Delivered",
};

const allStatuses = [
  "processing",
  "picked-up",
  "in-transit",
  "at-sorting-center",
  "customs-clearance",
  "out-for-delivery",
  "delivered",
];

const TrackingPage = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (trackingNumber) {
      fetchShipment();
    }
  }, [trackingNumber]);

  const fetchShipment = async () => {
    setIsLoading(true);
    setNotFound(false);

    const { data: shipmentData, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_number", trackingNumber?.toUpperCase())
      .maybeSingle();

    if (shipmentError || !shipmentData) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setShipment(shipmentData);

    // Fetch events
    const { data: eventsData } = await supabase
      .from("shipment_events")
      .select("*")
      .eq("shipment_id", shipmentData.id)
      .order("event_date", { ascending: false });

    setEvents(eventsData || []);
    setIsLoading(false);
  };

  const getCurrentStatusIndex = () => {
    if (!shipment) return 0;
    return allStatuses.indexOf(shipment.status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary-foreground/70">Loading shipment details...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-primary-foreground mb-2">
            Shipment Not Found
          </h1>
          <p className="text-primary-foreground/70 mb-6">
            We couldn't find a shipment with tracking number{" "}
            <span className="font-mono font-bold">{trackingNumber}</span>
          </p>
          <Button variant="hero" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="bg-navy-light border-b border-border/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground/70 hover:text-primary-foreground"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-accent to-orange-glow rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-accent-foreground/70 text-sm mb-1">Tracking Number</p>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-accent-foreground">
                  {shipment?.tracking_number}
                </h1>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-accent-foreground/20 rounded-full backdrop-blur-sm">
                {statusIcons[shipment?.status || "processing"]}
                <span className="font-semibold text-accent-foreground">
                  {statusLabels[shipment?.status || "processing"]}
                </span>
              </div>
            </div>

            {/* Status Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                {allStatuses.map((status, index) => (
                  <div
                    key={status}
                    className={`flex-1 flex flex-col items-center ${
                      index <= currentStatusIndex ? "text-accent-foreground" : "text-accent-foreground/40"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                        index < currentStatusIndex
                          ? "bg-accent-foreground text-accent"
                          : index === currentStatusIndex
                          ? "bg-accent-foreground text-accent ring-4 ring-accent-foreground/30 animate-pulse"
                          : "bg-accent-foreground/20"
                      }`}
                    >
                      {index < currentStatusIndex ? (
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        statusIcons[status]
                      )}
                    </div>
                    <span className="text-[10px] md:text-xs text-center hidden md:block">
                      {statusLabels[status]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-accent-foreground/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-foreground rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((currentStatusIndex + 1) / allStatuses.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Shipment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-xs text-muted-foreground">Current Location</span>
                </div>
                <p className="font-semibold text-foreground">
                  {shipment?.current_location || shipment?.origin_location}
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">Est. Delivery</span>
                </div>
                <p className="font-semibold text-foreground">
                  {shipment?.estimated_delivery
                    ? new Date(shipment.estimated_delivery).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Calculating..."}
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">Service</span>
                </div>
                <p className="font-semibold text-foreground capitalize">
                  {shipment?.service_type || "Standard"}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-display font-bold text-foreground mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Tracking History
              </h2>
              {events.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tracking events available yet.
                </p>
              ) : (
                <div className="space-y-1">
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative flex gap-4 pb-6 ${
                        index === events.length - 1 ? "pb-0" : ""
                      }`}
                    >
                      {/* Timeline line */}
                      {index < events.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 w-0.5 h-[calc(100%-8px)] ${
                            event.completed ? "bg-accent" : "bg-muted"
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          event.completed
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                        } ${index === 0 && event.completed ? "ring-4 ring-accent/20" : ""}`}
                      >
                        {event.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <p
                            className={`font-medium ${
                              event.completed ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {event.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.event_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Package Info */}
          <div className="space-y-6">
            {/* Route */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Route</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Origin</p>
                    <p className="font-medium text-foreground">{shipment?.origin_location}</p>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-dashed border-muted h-8" />
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="font-medium text-foreground">{shipment?.destination_location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient */}
            {shipment?.recipient_name && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Recipient</h3>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">{shipment.recipient_name}</p>
                  {shipment.recipient_address && (
                    <p className="text-sm text-muted-foreground">{shipment.recipient_address}</p>
                  )}
                  {shipment.recipient_country && (
                    <p className="text-sm text-muted-foreground">{shipment.recipient_country}</p>
                  )}
                </div>
              </div>
            )}

            {/* Package Details */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Package Details</h3>
              <div className="space-y-3">
                {shipment?.package_description && (
                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="text-sm text-foreground">{shipment.package_description}</p>
                  </div>
                )}
                {shipment?.weight_kg && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Weight</span>
                    <span className="text-sm font-medium text-foreground">
                      {shipment.weight_kg} kg
                    </span>
                  </div>
                )}
                {shipment?.shipping_fee && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Shipping Fee</span>
                    <span className="text-sm font-medium text-foreground">
                      {shipment.currency} {shipment.shipping_fee.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackingPage;
