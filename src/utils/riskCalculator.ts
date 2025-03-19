
export type Question = {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    riskPoints: number;
  }[];
};

export type RiskProfile = 'no' | 'low' | 'medium' | 'high' | 'very-high';

// Risk assessment questions
export const riskAssessmentQuestions: Question[] = [
  {
    id: 1,
    text: "What is your primary goal for investing?",
    options: [
      { id: "1a", text: "Preserving my capital and avoiding losses", riskPoints: 0 },
      { id: "1b", text: "Generating steady income", riskPoints: 1 },
      { id: "1c", text: "Achieving balanced growth and income", riskPoints: 2 },
      { id: "1d", text: "Growing my assets over the long term", riskPoints: 3 },
      { id: "1e", text: "Maximizing growth potential, even with significant risks", riskPoints: 4 }
    ]
  },
  {
    id: 2,
    text: "How would you react if your investments lost 20% of their value in a month?",
    options: [
      { id: "2a", text: "I would sell everything immediately to prevent further losses", riskPoints: 0 },
      { id: "2b", text: "I would sell some investments to reduce my exposure", riskPoints: 1 },
      { id: "2c", text: "I would hold on and wait for recovery", riskPoints: 2 },
      { id: "2d", text: "I would see this as an opportunity and maintain my investment strategy", riskPoints: 3 },
      { id: "2e", text: "I would invest more to take advantage of lower prices", riskPoints: 4 }
    ]
  },
  {
    id: 3,
    text: "What is your time horizon for your investments?",
    options: [
      { id: "3a", text: "Less than 1 year", riskPoints: 0 },
      { id: "3b", text: "1-3 years", riskPoints: 1 },
      { id: "3c", text: "3-5 years", riskPoints: 2 },
      { id: "3d", text: "5-10 years", riskPoints: 3 },
      { id: "3e", text: "More than 10 years", riskPoints: 4 }
    ]
  },
  {
    id: 4,
    text: "Which statement best describes your investment experience?",
    options: [
      { id: "4a", text: "I have no investment experience", riskPoints: 0 },
      { id: "4b", text: "I have some experience with basic investments like savings accounts and CDs", riskPoints: 1 },
      { id: "4c", text: "I have invested in mutual funds or exchange-traded funds (ETFs)", riskPoints: 2 },
      { id: "4d", text: "I have experience with individual stocks and bonds", riskPoints: 3 },
      { id: "4e", text: "I actively trade various investment types including options or crypto", riskPoints: 4 }
    ]
  },
  {
    id: 5,
    text: "How much of your monthly income can you comfortably save or invest?",
    options: [
      { id: "5a", text: "I'm currently unable to save or invest", riskPoints: 0 },
      { id: "5b", text: "Less than 5% of my monthly income", riskPoints: 1 },
      { id: "5c", text: "5-10% of my monthly income", riskPoints: 2 },
      { id: "5d", text: "10-20% of my monthly income", riskPoints: 3 },
      { id: "5e", text: "More than 20% of my monthly income", riskPoints: 4 }
    ]
  },
  {
    id: 6,
    text: "How important is liquidity in your investments?",
    options: [
      { id: "6a", text: "I need immediate access to all my investments", riskPoints: 0 },
      { id: "6b", text: "I need access to most of my investments within a few months", riskPoints: 1 },
      { id: "6c", text: "I need access to some of my investments, but can lock up a portion", riskPoints: 2 },
      { id: "6d", text: "I only need access to a small portion of my investments", riskPoints: 3 },
      { id: "6e", text: "I don't need access to these investments for several years", riskPoints: 4 }
    ]
  },
  {
    id: 7,
    text: "Which scenario would you prefer?",
    options: [
      { id: "7a", text: "Investment A: Guaranteed 4% annual return", riskPoints: 0 },
      { id: "7b", text: "Investment B: 90% chance of 6% return, 10% chance of 1% return", riskPoints: 1 },
      { id: "7c", text: "Investment C: 80% chance of 8% return, 20% chance of -2% return", riskPoints: 2 },
      { id: "7d", text: "Investment D: 60% chance of 12% return, 40% chance of -5% return", riskPoints: 3 },
      { id: "7e", text: "Investment E: 50% chance of 20% return, 50% chance of -10% return", riskPoints: 4 }
    ]
  },
  {
    id: 8,
    text: "How would you allocate your investments if given these options?",
    options: [
      { id: "8a", text: "100% in low-risk, low-return investments", riskPoints: 0 },
      { id: "8b", text: "75% in low-risk, 25% in medium-risk investments", riskPoints: 1 },
      { id: "8c", text: "50% in low-risk, 40% in medium-risk, 10% in high-risk investments", riskPoints: 2 },
      { id: "8d", text: "25% in low-risk, 50% in medium-risk, 25% in high-risk investments", riskPoints: 3 },
      { id: "8e", text: "10% in low-risk, 40% in medium-risk, 50% in high-risk investments", riskPoints: 4 }
    ]
  }
];

// Calculate risk profile based on answers
export const calculateRiskProfile = (answers: Record<number, string>): RiskProfile => {
  let totalPoints = 0;
  let answeredQuestions = 0;
  
  // Calculate total risk points from all answered questions
  for (const questionId in answers) {
    const question = riskAssessmentQuestions.find(q => q.id === parseInt(questionId));
    
    if (question) {
      const selectedOptionId = answers[parseInt(questionId)];
      const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
      
      if (selectedOption) {
        totalPoints += selectedOption.riskPoints;
        answeredQuestions++;
      }
    }
  }
  
  // If no questions answered, default to 'no' risk
  if (answeredQuestions === 0) return 'no';
  
  // Calculate average points per question to normalize the score
  const averagePoints = totalPoints / answeredQuestions;
  const maxPossibleAverage = 4; // Since each question can have max 4 points
  
  // Calculate percentage of max possible score (0-100%)
  const percentageOfMax = (averagePoints / maxPossibleAverage) * 100;
  
  // Determine risk profile based on percentage
  if (percentageOfMax < 20) return 'no';
  if (percentageOfMax < 40) return 'low';
  if (percentageOfMax < 60) return 'medium';
  if (percentageOfMax < 80) return 'high';
  return 'very-high';
};

// Get risk profile description
export const getRiskProfileDescription = (profile: RiskProfile): {
  title: string;
  description: string;
  characteristics: string[];
  timeHorizon: string;
} => {
  const profiles = {
    'no': {
      title: 'No Risk',
      description: 'You prioritize capital preservation above all else and are not comfortable with any investment risk.',
      characteristics: [
        'Focus on preserving capital',
        'Prefer guaranteed returns',
        'Highly concerned about any potential losses',
        'Prioritize liquidity and safety'
      ],
      timeHorizon: 'Less than 1 year'
    },
    'low': {
      title: 'Low Risk',
      description: 'You prefer stable investments with minimal volatility, accepting lower returns for greater safety.',
      characteristics: [
        'Willing to accept minimal volatility',
        'Emphasis on capital preservation with some income',
        'Limited tolerance for losses',
        'Prefer mostly conservative investments'
      ],
      timeHorizon: '1-3 years'
    },
    'medium': {
      title: 'Medium Risk',
      description: 'You seek a balance between growth and stability, willing to accept moderate fluctuations for better returns.',
      characteristics: [
        'Balance between growth and safety',
        'Comfortable with some market fluctuations',
        'Moderate tolerance for losses',
        'Diversified approach to investing'
      ],
      timeHorizon: '3-7 years'
    },
    'high': {
      title: 'High Risk',
      description: 'You prioritize growth and are comfortable with significant volatility to achieve higher long-term returns.',
      characteristics: [
        'Strong focus on capital growth',
        'Comfortable with significant market fluctuations',
        'Higher tolerance for temporary losses',
        'Willing to take calculated risks for better returns'
      ],
      timeHorizon: '7-10 years'
    },
    'very-high': {
      title: 'Very High Risk',
      description: 'You seek maximum growth potential and can tolerate extreme market volatility and significant temporary losses.',
      characteristics: [
        'Maximum growth is the primary objective',
        'Very comfortable with market volatility',
        'High tolerance for significant temporary losses',
        'Willing to invest in speculative opportunities'
      ],
      timeHorizon: '10+ years'
    }
  };
  
  return profiles[profile];
};

// Get investment recommendations based on risk profile
export const getInvestmentRecommendations = (profile: RiskProfile): {
  allocations: { category: string; percentage: number; }[];
  specificInvestments: { 
    name: string; 
    type: string; 
    description: string; 
    riskLevel: string;
    expectedReturn: string;
  }[];
} => {
  const recommendations = {
    'no': {
      allocations: [
        { category: 'High-yield Savings', percentage: 50 },
        { category: 'Certificates of Deposit', percentage: 30 },
        { category: 'Treasury Bills', percentage: 20 },
        { category: 'Stocks', percentage: 0 },
        { category: 'Alternative Investments', percentage: 0 }
      ],
      specificInvestments: [
        {
          name: 'High-Yield Savings Account',
          type: 'Cash Equivalent',
          description: 'FDIC-insured savings accounts with higher interest rates than standard accounts.',
          riskLevel: 'Very Low',
          expectedReturn: '1-3%'
        },
        {
          name: 'Certificates of Deposit (CDs)',
          type: 'Cash Equivalent',
          description: 'Time deposits with fixed terms and interest rates, typically FDIC-insured.',
          riskLevel: 'Very Low',
          expectedReturn: '2-4%'
        },
        {
          name: 'Short-Term Treasury Bills',
          type: 'Government Security',
          description: 'Short-term debt obligations backed by the U.S. government with maturities under one year.',
          riskLevel: 'Very Low',
          expectedReturn: '1.5-3.5%'
        }
      ]
    },
    'low': {
      allocations: [
        { category: 'Cash & Equivalents', percentage: 25 },
        { category: 'Bonds', percentage: 60 },
        { category: 'Stocks', percentage: 15 },
        { category: 'Real Estate', percentage: 0 },
        { category: 'Alternative Investments', percentage: 0 }
      ],
      specificInvestments: [
        {
          name: 'Short-Term Bond ETFs',
          type: 'Fixed Income',
          description: 'ETFs that invest in high-quality bonds with short maturities, reducing interest rate risk.',
          riskLevel: 'Low',
          expectedReturn: '2-4%'
        },
        {
          name: 'Municipal Bond Funds',
          type: 'Fixed Income',
          description: 'Funds that invest in tax-exempt bonds issued by state and local governments.',
          riskLevel: 'Low',
          expectedReturn: '2-4%'
        },
        {
          name: 'Conservative Allocation Mutual Funds',
          type: 'Mixed Asset',
          description: 'Mutual funds that maintain a higher percentage of bonds and a lower percentage of stocks.',
          riskLevel: 'Low to Moderate',
          expectedReturn: '3-5%'
        },
        {
          name: 'Treasury Inflation-Protected Securities (TIPS)',
          type: 'Government Security',
          description: 'U.S. government bonds that adjust with inflation to protect purchasing power.',
          riskLevel: 'Low',
          expectedReturn: '2-3%'
        }
      ]
    },
    'medium': {
      allocations: [
        { category: 'Cash & Equivalents', percentage: 10 },
        { category: 'Bonds', percentage: 40 },
        { category: 'Stocks', percentage: 40 },
        { category: 'Real Estate', percentage: 10 },
        { category: 'Alternative Investments', percentage: 0 }
      ],
      specificInvestments: [
        {
          name: 'Balanced Mutual Funds',
          type: 'Mixed Asset',
          description: 'Funds that maintain a roughly equal mix of stocks and bonds for balance between growth and income.',
          riskLevel: 'Moderate',
          expectedReturn: '4-6%'
        },
        {
          name: 'Dividend Stock ETFs',
          type: 'Equity',
          description: 'ETFs focused on companies with strong dividend payment histories, providing income and growth potential.',
          riskLevel: 'Moderate',
          expectedReturn: '5-7%'
        },
        {
          name: 'Blue-Chip Stocks',
          type: 'Equity',
          description: 'Shares of well-established companies with stable earnings and a history of reliable performance.',
          riskLevel: 'Moderate',
          expectedReturn: '6-8%'
        },
        {
          name: 'Real Estate Investment Trusts (REITs)',
          type: 'Real Estate',
          description: 'Companies that own, operate, or finance income-producing real estate across various sectors.',
          riskLevel: 'Moderate',
          expectedReturn: '5-8%'
        }
      ]
    },
    'high': {
      allocations: [
        { category: 'Cash & Equivalents', percentage: 5 },
        { category: 'Bonds', percentage: 15 },
        { category: 'Stocks', percentage: 65 },
        { category: 'Real Estate', percentage: 10 },
        { category: 'Alternative Investments', percentage: 5 }
      ],
      specificInvestments: [
        {
          name: 'Growth Stock ETFs',
          type: 'Equity',
          description: 'ETFs focused on companies expected to grow earnings at a faster rate than the market average.',
          riskLevel: 'High',
          expectedReturn: '8-12%'
        },
        {
          name: 'Mid-Cap and Small-Cap Funds',
          type: 'Equity',
          description: 'Funds investing in medium and smaller-sized companies with higher growth potential and higher risk.',
          riskLevel: 'High',
          expectedReturn: '8-12%'
        },
        {
          name: 'International and Emerging Market Funds',
          type: 'Equity',
          description: 'Funds that invest in foreign markets, including developing economies with high growth potential.',
          riskLevel: 'High',
          expectedReturn: '7-14%'
        },
        {
          name: 'Sector-Specific ETFs (Technology, Healthcare)',
          type: 'Equity',
          description: 'ETFs that focus on specific industry sectors with strong growth outlooks.',
          riskLevel: 'High',
          expectedReturn: '9-15%'
        }
      ]
    },
    'very-high': {
      allocations: [
        { category: 'Cash & Equivalents', percentage: 5 },
        { category: 'Bonds', percentage: 5 },
        { category: 'Stocks', percentage: 65 },
        { category: 'Real Estate', percentage: 10 },
        { category: 'Alternative Investments', percentage: 15 }
      ],
      specificInvestments: [
        {
          name: 'Aggressive Growth Stocks',
          type: 'Equity',
          description: 'Individual stocks of companies with high growth potential but potentially higher volatility.',
          riskLevel: 'Very High',
          expectedReturn: '12-18%'
        },
        {
          name: 'Leveraged ETFs',
          type: 'Equity',
          description: 'ETFs that use financial derivatives to amplify the returns of an underlying index.',
          riskLevel: 'Very High',
          expectedReturn: '15-25% (with higher risk of losses)'
        },
        {
          name: 'Emerging Market Small-Cap Funds',
          type: 'Equity',
          description: 'Funds focusing on smaller companies in developing economies, combining small-cap and emerging market risks and rewards.',
          riskLevel: 'Very High',
          expectedReturn: '10-20%'
        },
        {
          name: 'Private Equity Funds',
          type: 'Alternative',
          description: 'Investments in privately-held companies not available on public exchanges.',
          riskLevel: 'Very High',
          expectedReturn: '15-25%'
        },
        {
          name: 'Cryptocurrency ETFs',
          type: 'Alternative',
          description: 'Regulated ETFs that track the performance of digital currencies like Bitcoin.',
          riskLevel: 'Extremely High',
          expectedReturn: 'Highly variable (could exceed 25% or result in significant losses)'
        }
      ]
    }
  };
  
  return recommendations[profile];
};
