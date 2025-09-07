import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

function Landing() {
  const navigate = useNavigate();

  const handleDemoMode = () => {
    // Set demo mode and navigate directly to dashboard
    localStorage.setItem('demoMode', 'true');
    navigate('/dashboard');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Clarity Finance
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8">
              Connect your banks. Track spending. See insights.
            </p>
            
            {/* Tech Stack for Recruiters */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 opacity-75">
              <Badge variant="outline" className="text-xs">React + TypeScript</Badge>
              <Badge variant="outline" className="text-xs">Plaid Banking API</Badge>
              <Badge variant="outline" className="text-xs">OAuth (Google + GitHub)</Badge>
              <Badge variant="outline" className="text-xs">Supabase + PostgreSQL</Badge>
              <Badge variant="outline" className="text-xs">shadcn/ui + Tailwind</Badge>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
            
            {/* Demo Card - Primary */}
            <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800 text-xl">
                  🎬 Try Live Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-lg">
                  Explore the full app instantly with sample data
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ No signup needed</li>
                  <li>✓ Real bank integration demos</li>
                  <li>✓ Interactive charts & insights</li>
                  <li>✓ All features unlocked</li>
                </ul>
                <Button 
                  onClick={handleDemoMode}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Enter Demo →
                </Button>
              </CardContent>
            </Card>

            {/* Login Card - Secondary */}
            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  🔐 Sign In
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Use your own data and connect real accounts
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Google or GitHub login</li>
                  <li>✓ Secure bank connections</li>
                  <li>✓ Your personal data</li>
                  <li>✓ Real transaction sync</li>
                </ul>
                <Button 
                  onClick={handleLogin}
                  variant="outline"
                  size="lg"
                  className="w-full border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
                >
                  Sign In with OAuth
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center p-6">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="font-semibold mb-2">Real Bank Data</h3>
              <p className="text-sm text-gray-600">Connect 12,000+ banks via Plaid's secure API</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold mb-2">Smart Insights</h3>
              <p className="text-sm text-gray-600">Categorized spending with visual breakdowns</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-semibold mb-2">Bank-Level Security</h3>
              <p className="text-sm text-gray-600">Enterprise auth and encrypted storage</p>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>Built with modern web technologies for portfolio demonstration</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;