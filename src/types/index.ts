export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalSpent: number;
  categorySpendings: Record<string, number>;
}

export interface RecommendationRule {
  type: 'category_increase' | 'total_increase' | 'frequent_small';
  threshold: number;
  message: string;
}

export type ThemeMode = 'light' | 'dark';