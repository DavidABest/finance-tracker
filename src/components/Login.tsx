import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../supabaseClient';
import { logger } from '../config/environment';

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
    }
    catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
    }
    finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
    }
    catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
    }
    finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        
        logger.log('Sign up response:', { data, error });
        
        if (error) {
          logger.error('Sign up error:', error);
          throw error;
        }
        
        if (data?.user && !data.user.email_confirmed_at) {
          setError('Account created! Please check your email to confirm your account before signing in.');
        }
      }
      else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        logger.log('Sign in response:', { data, error });
        
        if (error) {
          logger.error('Sign in error:', error);
          throw error;
        }
      }
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      // Improve error messages for better UX
      if (errorMessage.includes('User already registered')) {
        setError('If an account with this email exists, please check your email to confirm your account or try signing in instead.');
      } else if (errorMessage.includes('Password should be at least')) {
        setError('Password must be at least 6 characters long and contain a mix of letters, numbers, and special characters.');
      } else if (errorMessage.includes('Unable to validate email address')) {
        setError('Please enter a valid email address.');
      } else if (errorMessage.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError(errorMessage);
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#1e2124] p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">Welcome to Clarity Finance Tracker</CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to manage your financial data
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-50 dark:border-red-900">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
            
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>
            )}
            
            <Button 
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#1e2124] text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <Button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 dark:text-white border border-gray-300"
            size="lg"
          >
            <div className="mr-2 p-1 min-h-[30px] flex items-center">
              <svg height="18" viewBox="0 0 24 24" width="18">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div>{loading ? 'Signing in...' : 'Sign in with Google'}</div>
          </Button>
          
          <Button 
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full bg-[#1A1A1A] hover:bg-[#1b1f23] text-white"
            size="lg"
            style={{ backgroundColor: '#1A1A1A' }}
          >
            <div className="mr-2 p-1 min-h-[30px] flex items-center">
              <svg height="18" viewBox="0 0 16 16" width="18" className="fill-white">
                <path
                  fillRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
              0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
              1.08.58 1.23.82.72 1.21 1.87.87
              2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12
              0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08
              2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0
              .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                />
              </svg>
            </div>
            <div>{loading ? 'Signing in...' : 'Sign in with GitHub'}</div>
          </Button>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <div>Secure authentication powered by Supabase</div>
            <div className="text-xs">Portfolio demo • Uses Plaid sandbox for demonstration</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;