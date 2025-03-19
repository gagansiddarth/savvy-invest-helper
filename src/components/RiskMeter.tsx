
import React from 'react';
import { cn } from '@/lib/utils';

type RiskProfile = 'no' | 'low' | 'medium' | 'high' | 'very-high';

interface RiskMeterProps {
  riskProfile: RiskProfile;
  className?: string;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ riskProfile, className }) => {
  const levels = ['no', 'low', 'medium', 'high', 'very-high'];
  const currentIndex = levels.indexOf(riskProfile);
  
  const calculatePosition = () => {
    return currentIndex * 25; // 0%, 25%, 50%, 75%, 100%
  };
  
  const getRiskColor = () => {
    const colors = {
      'no': 'bg-finance-blue-accent',
      'low': 'bg-finance-green-accent',
      'medium': 'bg-finance-yellow-accent',
      'high': 'bg-finance-orange-accent',
      'very-high': 'bg-finance-red-accent'
    };
    
    return colors[riskProfile] || colors.medium;
  };
  
  const getRiskLabel = () => {
    return {
      'no': 'No Risk',
      'low': 'Low Risk',
      'medium': 'Medium Risk',
      'high': 'High Risk',
      'very-high': 'Very High Risk'
    }[riskProfile];
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Conservative</span>
        <span className="text-sm font-medium">Aggressive</span>
      </div>
      
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        {/* Background segments for visual reference */}
        <div className="absolute inset-0 flex">
          <div className="w-1/5 h-full bg-finance-blue opacity-40"></div>
          <div className="w-1/5 h-full bg-finance-green opacity-40"></div>
          <div className="w-1/5 h-full bg-finance-yellow opacity-40"></div>
          <div className="w-1/5 h-full bg-finance-orange opacity-40"></div>
          <div className="w-1/5 h-full bg-finance-red opacity-40"></div>
        </div>
        
        {/* Active risk indicator */}
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${getRiskColor()}`}
          style={{ width: `${calculatePosition() + 20}%` }}
        ></div>
      </div>
      
      {/* Risk level marker */}
      <div 
        className="absolute mt-[-10px] transition-all duration-500 ease-out"
        style={{ left: `calc(${calculatePosition()}% + 10px)` }}
      >
        <div className={`h-5 w-5 rounded-full ${getRiskColor()} shadow-md border-2 border-white`}></div>
      </div>
      
      <div className="mt-4 text-center">
        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-secondary">
          {getRiskLabel()}
        </span>
      </div>
    </div>
  );
};

export default RiskMeter;
