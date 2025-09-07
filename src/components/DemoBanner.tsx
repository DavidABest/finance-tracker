import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function DemoBanner() {
  const { isDemoMode } = useAuth();
  const navigate = useNavigate();

  if (!isDemoMode) return null;

  const handleConvertToLive = () => {
    localStorage.removeItem('demoMode');
    navigate('/login');
  };

  return (
    <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
      <AlertDescription className="flex items-center gap-3 flex-wrap">
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          🎬 DEMO MODE
        </Badge>
        <span className="flex-1 min-w-0">
          You're viewing a live demo with sample data. All features work including real Plaid APIs.
        </span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleConvertToLive}
          className="text-xs"
        >
          Sign Up For Real →
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export default DemoBanner;