import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

function Landing() {
  const navigate = useNavigate();

  const handleDemoMode = () => {
    localStorage.setItem('demoMode', 'true');
    navigate('/dashboard');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Clarity Finance
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <Badge variant="outline" className="text-xs">React</Badge>
          <Badge variant="outline" className="text-xs">Plaid</Badge>
          <Badge variant="outline" className="text-xs">OAuth</Badge>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-20">
        
        {/* Main Interface Preview */}
        <div className="mb-16">
          <Card className="w-[480px] p-8 bg-white/60 backdrop-blur border border-gray-200 shadow-xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Dashboard Preview</div>
                <div className="text-2xl font-semibold">$12,847.32</div>
                <div className="text-sm text-gray-600">Total Balance</div>
              </div>

              {/* Mini Transaction List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">💰</div>
                    <div>
                      <div className="font-medium text-sm">Salary Deposit</div>
                      <div className="text-xs text-gray-500">Aug 15, 2024</div>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">+$3,600.00</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">🏠</div>
                    <div>
                      <div className="font-medium text-sm">Rent Payment</div>
                      <div className="text-xs text-gray-500">Aug 01, 2024</div>
                    </div>
                  </div>
                  <div className="text-gray-900 font-semibold">-$1,800.00</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">🍕</div>
                    <div>
                      <div className="font-medium text-sm">Groceries</div>
                      <div className="text-xs text-gray-500">Aug 14, 2024</div>
                    </div>
                  </div>
                  <div className="text-gray-900 font-semibold">-$127.85</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Headline */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
            Take control of your finances
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Connect your banks, track spending, and gain insights into your financial health
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={handleDemoMode}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
          >
            Try Live Demo
          </Button>
          <Button 
            onClick={handleLogin}
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 px-8 py-3 text-lg font-semibold hover:bg-gray-50"
          >
            Sign In
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 max-w-lg">
          <p>Secure banking integration powered by Plaid • Enterprise-grade authentication</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;