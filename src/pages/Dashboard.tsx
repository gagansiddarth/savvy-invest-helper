
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ArrowUpRight, LogOut, RefreshCw, ChevronRight } from 'lucide-react';
import { getRiskProfileDescription, getInvestmentRecommendations } from '@/utils/riskCalculator';
import RiskMeter from '@/components/RiskMeter';
import InvestmentCard from '@/components/InvestmentCard';
import ChatAssistant from '@/components/ChatAssistant';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login');
      return;
    }
    
    // Redirect to risk assessment if no risk profile
    if (isAuthenticated && user && !user.riskProfile) {
      navigate('/risk-assessment');
      toast({
        title: "Risk Assessment Required",
        description: "Please complete the risk assessment to view your dashboard.",
      });
    }
  }, [isAuthenticated, navigate, user, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // If not authenticated or no risk profile, show nothing (will redirect)
  if (!isAuthenticated || !user?.riskProfile) return null;

  const riskProfile = user.riskProfile;
  const profileDescription = getRiskProfileDescription(riskProfile);
  const recommendations = getInvestmentRecommendations(riskProfile);
  
  // Prepare data for pie chart
  const allocationData = recommendations.allocations
    .filter(item => item.percentage > 0) // Only show allocations with value > 0
    .map(item => ({
      name: item.category,
      value: item.percentage
    }));

  const COLORS = ['#90CAF9', '#A5D6A7', '#FFECB3', '#EF9A9A', '#CE93D8'];

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Your Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.email.split('@')[0]}. Here's your financial overview.
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid md:grid-cols-3 grid-cols-1 h-auto gap-2 w-full max-w-xl">
              <TabsTrigger value="overview" className="py-3">
                Overview
              </TabsTrigger>
              <TabsTrigger value="investments" className="py-3">
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="assistant" className="py-3">
                AI Assistant
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Risk Profile</CardTitle>
                        <CardDescription>Your investment risk tolerance</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-secondary">
                        {profileDescription.title}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="pt-6 pb-8">
                      <RiskMeter riskProfile={riskProfile} />
                    </div>
                    
                    <div className="mt-4 space-y-4">
                      <p className="text-muted-foreground">
                        {profileDescription.description}
                      </p>
                      
                      <div>
                        <h4 className="font-medium mb-2">Profile Characteristics:</h4>
                        <ul className="space-y-2">
                          {profileDescription.characteristics.map((char, index) => (
                            <li key={index} className="flex items-start">
                              <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Suggested Time Horizon: {profileDescription.timeHorizon}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Allocation</CardTitle>
                    <CardDescription>Based on your risk profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={allocationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {allocationData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                                stroke="none"
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Allocation']} 
                            contentStyle={{ 
                              borderRadius: '0.5rem', 
                              border: 'none', 
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                          />
                          <Legend 
                            layout="horizontal" 
                            verticalAlign="bottom" 
                            align="center"
                            formatter={(value) => <span className="text-xs">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-2 pt-4 border-t">
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab('investments')}>
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        View Investment Recommendations
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="investments" className="animate-fade-in">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Investment Recommendations</h2>
                  <p className="text-muted-foreground">
                    Personalized investment options based on your {profileDescription.title.toLowerCase()} profile
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.specificInvestments.map((investment, index) => (
                  <InvestmentCard
                    key={index}
                    name={investment.name}
                    type={investment.type}
                    description={investment.description}
                    riskLevel={investment.riskLevel}
                    expectedReturn={investment.expectedReturn}
                  />
                ))}
              </div>
              
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Allocation Strategy</CardTitle>
                  <CardDescription>Recommended portfolio allocation for your risk profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium mb-4">Asset Allocation</h4>
                      <div className="space-y-4">
                        {recommendations.allocations.map((allocation, index) => (
                          allocation.percentage > 0 && (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{allocation.category}</span>
                                <span className="text-sm font-medium">{allocation.percentage}%</span>
                              </div>
                              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full"
                                  style={{ 
                                    width: `${allocation.percentage}%`,
                                    backgroundColor: COLORS[index % COLORS.length] 
                                  }}
                                ></div>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Investment Strategy Notes</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            This allocation is designed for investors with a {profileDescription.title.toLowerCase()} risk tolerance.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            Consider a time horizon of at least {profileDescription.timeHorizon.toLowerCase()} for this strategy.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            Regular rebalancing (every 6-12 months) is recommended to maintain your target allocation.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            Consider consulting with a financial advisor before making significant investment decisions.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="assistant" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="h-[600px]">
                    <ChatAssistant />
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Suggested Topics</CardTitle>
                      <CardDescription>Questions to ask the AI Assistant</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="p-2 bg-secondary rounded-md text-sm cursor-pointer hover:bg-primary/10 transition-colors">
                          What is investing?
                        </li>
                        <li className="p-2 bg-secondary rounded-md text-sm cursor-pointer hover:bg-primary/10 transition-colors">
                          How to start investing?
                        </li>
                        <li className="p-2 bg-secondary rounded-md text-sm cursor-pointer hover:bg-primary/10 transition-colors">
                          What's the difference between ETFs and mutual funds?
                        </li>
                        <li className="p-2 bg-secondary rounded-md text-sm cursor-pointer hover:bg-primary/10 transition-colors">
                          How much should I save for retirement?
                        </li>
                        <li className="p-2 bg-secondary rounded-md text-sm cursor-pointer hover:bg-primary/10 transition-colors">
                          What is dollar-cost averaging?
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>About the Assistant</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        This AI assistant can help answer your general questions about investing and personal finance. While it provides helpful information, it does not offer personalized financial advice.
                      </p>
                      <p className="text-sm text-muted-foreground mt-4">
                        For specific financial advice tailored to your situation, please consult with a qualified financial advisor.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
