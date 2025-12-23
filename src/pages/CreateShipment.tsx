import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Package, User, MapPin, DollarSign, Clock, Link2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/integrations/supabase/client";

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY"];

const generateTrackingNumber = () => {
  const prefix = "GLX";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

const CreateShipment = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [createdTracking, setCreatedTracking] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    // Sender
    senderName: "",
    senderEmail: "",
    senderAddress: "",
    senderCountry: "",
    // Recipient
    recipientName: "",
    recipientEmail: "",
    recipientAddress: "",
    recipientCountry: "",
    // Package
    origin: "",
    destination: "",
    packageValue: "",
    packageDescription: "",
    weightKg: "",
    shippingFee: "",
    currency: "USD",
    deliveryDays: "",
    serviceType: "standard",
  });

  if (!isAuthenticated) {
    navigate("/admin");
    return null;
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const trackingNumber = generateTrackingNumber();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + (parseInt(formData.deliveryDays) || 7));

    const { error } = await supabase.from("shipments").insert({
      tracking_number: trackingNumber,
      status: "processing",
      sender_name: formData.senderName,
      sender_email: formData.senderEmail || null,
      sender_address: formData.senderAddress || null,
      sender_country: formData.senderCountry || null,
      recipient_name: formData.recipientName,
      recipient_email: formData.recipientEmail || null,
      recipient_address: formData.recipientAddress || null,
      recipient_country: formData.recipientCountry || null,
      origin_location: formData.origin,
      destination_location: formData.destination,
      package_value: formData.packageValue ? parseFloat(formData.packageValue) : null,
      package_description: formData.packageDescription || null,
      weight_kg: formData.weightKg ? parseFloat(formData.weightKg) : null,
      shipping_fee: formData.shippingFee ? parseFloat(formData.shippingFee) : null,
      currency: formData.currency,
      delivery_days: formData.deliveryDays ? parseInt(formData.deliveryDays) : null,
      service_type: formData.serviceType,
      estimated_delivery: estimatedDelivery.toISOString().split("T")[0],
    });

    if (error) {
      toast.error("Failed to create shipment");
      console.error(error);
    } else {
      toast.success("Shipment created successfully!");
      setCreatedTracking(trackingNumber);
    }

    setIsLoading(false);
  };

  const copyTrackingLink = () => {
    const link = `${window.location.origin}/track/${createdTracking}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Tracking link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdTracking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-display">Package Created!</CardTitle>
            <CardDescription>Your shipment has been successfully created</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
              <p className="text-xl font-mono font-bold text-foreground">{createdTracking}</p>
            </div>

            <div className="space-y-3">
              <Button variant="hero" className="w-full" onClick={copyTrackingLink}>
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Copy Tracking Link
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/track/${createdTracking}`)}
              >
                View Tracking Page
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    setCreatedTracking(null);
                    setFormData({
                      senderName: "",
                      senderEmail: "",
                      senderAddress: "",
                      senderCountry: "",
                      recipientName: "",
                      recipientEmail: "",
                      recipientAddress: "",
                      recipientCountry: "",
                      origin: "",
                      destination: "",
                      packageValue: "",
                      packageDescription: "",
                      weightKg: "",
                      shippingFee: "",
                      currency: "USD",
                      deliveryDays: "",
                      serviceType: "standard",
                    });
                  }}
                >
                  Create Another
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Create New Package
          </h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details to create a new shipment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sender Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Sender Information</CardTitle>
                  <CardDescription>Details of the package sender</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Full Name *</Label>
                <Input
                  id="senderName"
                  value={formData.senderName}
                  onChange={(e) => handleChange("senderName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderEmail">Email</Label>
                <Input
                  id="senderEmail"
                  type="email"
                  value={formData.senderEmail}
                  onChange={(e) => handleChange("senderEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="senderAddress">Address</Label>
                <Input
                  id="senderAddress"
                  value={formData.senderAddress}
                  onChange={(e) => handleChange("senderAddress", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderCountry">Country</Label>
                <Input
                  id="senderCountry"
                  value={formData.senderCountry}
                  onChange={(e) => handleChange("senderCountry", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recipient Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ocean/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-ocean" />
                </div>
                <div>
                  <CardTitle className="text-lg">Recipient Information</CardTitle>
                  <CardDescription>Details of the package recipient</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Full Name *</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => handleChange("recipientName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Email (optional)</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => handleChange("recipientEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="recipientAddress">Address *</Label>
                <Input
                  id="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={(e) => handleChange("recipientAddress", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientCountry">Country *</Label>
                <Input
                  id="recipientCountry"
                  value={formData.recipientCountry}
                  onChange={(e) => handleChange("recipientCountry", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Package Details</CardTitle>
                  <CardDescription>Information about the package</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin *</Label>
                <Input
                  id="origin"
                  placeholder="City, Country"
                  value={formData.origin}
                  onChange={(e) => handleChange("origin", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  placeholder="City, Country"
                  value={formData.destination}
                  onChange={(e) => handleChange("destination", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="packageDescription">Description</Label>
                <Textarea
                  id="packageDescription"
                  placeholder="Package contents description"
                  value={formData.packageDescription}
                  onChange={(e) => handleChange("packageDescription", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.1"
                  value={formData.weightKg}
                  onChange={(e) => handleChange("weightKg", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleChange("serviceType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                    <SelectItem value="freight">Freight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Delivery */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pricing & Delivery</CardTitle>
                  <CardDescription>Shipping costs and timeline</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="packageValue">Package Value</Label>
                <Input
                  id="packageValue"
                  type="number"
                  step="0.01"
                  value={formData.packageValue}
                  onChange={(e) => handleChange("packageValue", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingFee">Shipping Fee</Label>
                <Input
                  id="shippingFee"
                  type="number"
                  step="0.01"
                  value={formData.shippingFee}
                  onChange={(e) => handleChange("shippingFee", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleChange("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDays">Delivery Days</Label>
                <Input
                  id="deliveryDays"
                  type="number"
                  placeholder="Estimated days"
                  value={formData.deliveryDays}
                  onChange={(e) => handleChange("deliveryDays", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Create Package
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateShipment;
