
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OTPVerificationProps {
  email: string;
  onVerifySuccess: (otp: string) => void;
  onResendOTP: () => Promise<void>;
}

const OTPVerification = ({ email, onVerifySuccess, onResendOTP }: OTPVerificationProps) => {
  const [otp, setOTP] = useState('');
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await onResendOTP();
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerifySuccess(otp);
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Verify Your Email</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We've sent a 6-digit verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4 w-full">
        <InputOTP maxLength={6} value={otp} onChange={setOTP}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <Button 
          className="w-full" 
          onClick={handleVerify}
          disabled={otp.length !== 6}
        >
          Verify Email
        </Button>

        <div className="text-sm text-center mt-2">
          <span className="text-muted-foreground">Didn't receive the code? </span>
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm"
            onClick={handleResendOTP}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Resending...
              </>
            ) : (
              "Resend"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
