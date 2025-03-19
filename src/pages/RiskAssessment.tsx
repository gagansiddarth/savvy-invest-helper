
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, HelpCircle } from 'lucide-react';
import { riskAssessmentQuestions, calculateRiskProfile } from '@/utils/riskCalculator';
import Navbar from '@/components/Navbar';

const RiskAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInfo, setShowInfo] = useState<number | null>(null);
  
  const { user, isAuthenticated, updateUserRiskProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login');
    }
  }, [isAuthenticated, navigate]);

  const handleAnswerSelect = (questionId: number, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const nextStep = () => {
    if (currentStep < riskAssessmentQuestions.length) {
      const currentQuestionId = riskAssessmentQuestions[currentStep].id;
      
      if (!answers[currentQuestionId]) {
        toast({
          title: "Selection required",
          description: "Please select an answer before continuing.",
          variant: "destructive",
        });
        return;
      }
      
      if (currentStep === riskAssessmentQuestions.length - 1) {
        // Last question, submit assessment
        handleSubmit();
      } else {
        // Move to next question
        setCurrentStep(prev => prev + 1);
        setShowInfo(null); // Reset info state when moving to next question
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowInfo(null); // Reset info state when moving to previous question
    } else {
      // First question, go back to previous page
      navigate(-1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate risk profile
      const riskProfile = calculateRiskProfile(answers);
      
      // Update user's risk profile
      updateUserRiskProfile(riskProfile);
      
      toast({
        title: "Assessment Complete!",
        description: "Your risk profile has been calculated successfully.",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your risk assessment. Please try again.",
        variant: "destructive",
      });
      console.error("Risk assessment submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInfo = (questionId: number) => {
    if (showInfo === questionId) {
      setShowInfo(null);
    } else {
      setShowInfo(questionId);
    }
  };

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) return null;

  const currentQuestion = riskAssessmentQuestions[currentStep];
  const progress = ((currentStep + 1) / riskAssessmentQuestions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Risk Assessment</h1>
            <p className="text-muted-foreground max-w-lg">
              Answer these questions to help us determine your investment risk profile and provide personalized recommendations.
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentStep + 1} of {riskAssessmentQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleInfo(currentQuestion.id)}
                  className="rounded-full h-8 w-8"
                >
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
              {showInfo === currentQuestion.id && (
                <CardDescription className="mt-2 p-3 bg-muted rounded-md animate-fade-in">
                  This question helps us understand your {
                    currentStep === 0 ? "investment objectives" :
                    currentStep === 1 ? "risk tolerance during market volatility" :
                    currentStep === 2 ? "investment time horizon" :
                    currentStep === 3 ? "investment experience level" :
                    currentStep === 4 ? "capacity to invest" :
                    currentStep === 5 ? "liquidity needs" :
                    currentStep === 6 ? "risk vs. return preferences" :
                    "preferred investment allocation strategy"
                  }.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={answers[currentQuestion.id] || ""} 
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
              >
                <div className="space-y-4">
                  {currentQuestion.options.map((option) => (
                    <div 
                      key={option.id} 
                      className={`flex items-center space-x-2 border rounded-lg p-4 transition-all ${
                        answers[currentQuestion.id] === option.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    >
                      <RadioGroupItem value={option.id} id={option.id} className="text-primary" />
                      <Label 
                        htmlFor={option.id} 
                        className={`flex-1 cursor-pointer font-normal ${
                          answers[currentQuestion.id] === option.id ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {option.text}
                      </Label>
                      {answers[currentQuestion.id] === option.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary animate-scale-in" />
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {currentStep === 0 ? 'Back' : 'Previous'}
              </Button>
              <Button onClick={nextStep} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : currentStep === riskAssessmentQuestions.length - 1 ? (
                  <>
                    Complete
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Your answers help us create a personalized investment strategy. All information is kept confidential.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RiskAssessment;
