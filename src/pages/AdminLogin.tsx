import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Package, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/admin/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (login(password)) {
        toast.success("Welcome to Admin Panel");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid password");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ocean/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
            <Package className="w-8 h-8 text-accent" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">Admin Access</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your password to access the admin panel
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-background/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <Button
              type="submit"
              variant="hero"
              className="w-full h-12"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : (
                "Access Admin Panel"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
            >
              Back to Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
