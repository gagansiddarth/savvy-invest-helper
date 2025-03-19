
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Shield, TrendingUp, MessageCircle, ArrowDown } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: 'Personalized Risk Assessment',
      description: 'Discover your investment risk profile through our comprehensive questionnaire tailored to your financial goals and comfort level.'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: 'Tailored Investment Recommendations',
      description: 'Receive investment suggestions perfectly matched to your risk profile, financial situation, and long-term objectives.'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Safe Investment Options',
      description: 'Access a curated selection of investment opportunities across multiple risk categories, from conservative to aggressive growth.'
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: 'AI Financial Assistant',
      description: 'Get instant answers to your financial questions with our AI-powered chat assistant, available 24/7 to guide your investment journey.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            <div className={`space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
                Smart Investing Made Simple
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Your AI-Powered Financial Guide
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover your investment risk profile and get personalized recommendations tailored to your financial goals.
              </p>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Button size="lg" asChild>
                <Link to="/auth?mode=signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
            
            <button 
              onClick={scrollToFeatures} 
              className={`mt-16 flex items-center justify-center animate-float transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              aria-label="Scroll to features"
            >
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How SavvyInvest Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our intelligent platform guides you through every step of your investment journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white shadow-card hover:shadow-card-hover border border-border/50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 bg-primary/10 h-14 w-14 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button size="lg" asChild>
              <Link to="/auth?mode=signup">
                Start Your Assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to make smarter investment decisions?
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Join thousands of users who have transformed their financial future with personalized investment guidance.
              </p>
              <Button size="lg" asChild>
                <Link to="/auth?mode=signup">
                  Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-card w-full max-w-md">
              <div className="bg-primary/10 p-6 rounded-t-xl border-b border-border">
                <div className="flex items-center space-x-4 mb-6">
                  <BarChart3 className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold">Risk Assessment</h3>
                    <p className="text-sm text-muted-foreground">Complete in 5 minutes</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-right text-muted-foreground">75% of new users complete their assessment</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-b-xl">
                <p className="text-sm text-muted-foreground mb-4">
                  "SavvyInvest helped me understand my risk tolerance and find investments that align with my financial goals. The recommendations were spot-on!"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium mr-3">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-medium">Jamie D.</p>
                    <p className="text-xs text-muted-foreground">New Investor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-medium tracking-tight">
                  <span className="text-primary">Savvy</span>
                  <span className="font-light">Invest</span>
                </span>
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                Your AI-powered financial guide
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="space-y-4">
                <h4 className="font-medium">Navigate</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
                  <li><Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link></li>
                  <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} SavvyInvest. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2 md:mt-0">
              This is a demo project. Not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
