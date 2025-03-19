import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import OTPVerification from '@/components/OTPVerification';

const SUPABASE_URL = "https://cfnzzbimqbmqhzorazmd.supabase.co";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get('mode');
    
    if (modeParam === 'login' || modeParam === 'signup') {
      setMode(modeParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Invalid input",
        description: "Please provide both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Invalid input",
        description: "Please provide both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate OTP");
      }

      setShowOTPVerification(true);
      
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to resend OTP");
      }
      
      toast({
        title: "Verification code resent",
        description: "Please check your email for the new verification code.",
      });
    } catch (error) {
      toast({
        title: "Failed to resend code",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setIsSubmitting(true);
    
    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ email, otp, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });

      await login(email, password);
      
      navigate('/risk-assessment');
      
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowOTPVerification(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          {showOTPVerification ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Verify Your Account</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetForm}
                  >
                    Back
                  </Button>
                </div>
                <CardDescription>
                  Enter the verification code sent to your email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OTPVerification 
                  email={email} 
                  onVerifySuccess={handleVerifyOTP} 
                  onResendOTP={handleResendOTP} 
                />
              </CardContent>
            </Card>
          ) : (
            <Tabs value={mode} onValueChange={(v) => setMode(v as 'login' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                      Log in to your account to access your financial insights.
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password">Password</Label>
                          <Button variant="link" className="p-0 h-auto text-xs" type="button">
                            Forgot password?
                          </Button>
                        </div>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging In...
                          </>
                        ) : (
                          "Log In"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="signup" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>
                      Sign up to start your personalized investment journey.
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSignupInitiate}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Password must be at least 8 characters long.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Verification Code...
                          </>
                        ) : (
                          "Get Verification Code"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our{' '}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
};

export default Auth;
