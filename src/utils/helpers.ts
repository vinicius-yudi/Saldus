import { Expense, Category, MonthlyReport, RecommendationRule } from '../types';
import { MONTHS, recommendationRules } from './constants';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const getCurrentMonthYear = () => {
  const date = new Date();
  return {
    month: date.getMonth(),
    year: date.getFullYear()
  };
};

export const getMonthName = (monthIndex: number): string => {
  return MONTHS[monthIndex];
};

export const calculateMonthlyReport = (
  expenses: Expense[],
  categories: Category[]
): MonthlyReport => {
  const { month, year } = getCurrentMonthYear();
  
  const monthlyExpenses = expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
  
  const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categorySpendings: Record<string, number> = {};
  
  monthlyExpenses.forEach(expense => {
    if (categorySpendings[expense.category]) {
      categorySpendings[expense.category] += expense.amount;
    } else {
      categorySpendings[expense.category] = expense.amount;
    }
  });
  
  return {
    month,
    year,
    totalSpent,
    categorySpendings
  };
};

export const compareWithPreviousMonth = (
  currentMonth: number,
  currentYear: number,
  expenses: Expense[]
): {
  percentageDifference: number;
  previousMonthTotal: number;
  currentMonthTotal: number;
} => {
  // Calculate previous month and year
  let previousMonth = currentMonth - 1;
  let previousYear = currentYear;
  
  if (previousMonth < 0) {
    previousMonth = 11;
    previousYear = currentYear - 1;
  }
  
  // Get expenses for current month
  const currentMonthExpenses = expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  // Get expenses for previous month
  const previousMonthExpenses = expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
  });
  
  // Calculate totals
  const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate percentage difference
  let percentageDifference = 0;
  if (previousMonthTotal > 0) {
    percentageDifference = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
  }
  
  return {
    percentageDifference,
    previousMonthTotal,
    currentMonthTotal
  };
};

export const generateRecommendations = (
  expenses: Expense[],
  categories: Category[]
): string[] => {
  const recommendations: string[] = [];
  const { month, year } = getCurrentMonthYear();
  
  // Get comparison with previous month
  const comparison = compareWithPreviousMonth(month, year, expenses);
  
  // Check for total increase
  const totalIncreaseRule = recommendationRules.find(rule => rule.type === 'total_increase');
  if (totalIncreaseRule && comparison.percentageDifference > totalIncreaseRule.threshold) {
    recommendations.push(
      totalIncreaseRule.message.replace(
        '{percentage}',
        comparison.percentageDifference.toFixed(1)
      )
    );
  }
  
  // Check for category increases
  const categoryIncreaseRule = recommendationRules.find(rule => rule.type === 'category_increase');
  if (categoryIncreaseRule) {
    categories.forEach(category => {
      const currentMonthCategoryExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);
        return (
          expense.category === category.id &&
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      });
      
      const previousMonth = month === 0 ? 11 : month - 1;
      const previousYear = month === 0 ? year - 1 : year;
      
      const previousMonthCategoryExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);
        return (
          expense.category === category.id &&
          date.getMonth() === previousMonth &&
          date.getFullYear() === previousYear
        );
      });
      
      const currentTotal = currentMonthCategoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const previousTotal = previousMonthCategoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      if (previousTotal > 0 && currentTotal > 0) {
        const percentageDifference = ((currentTotal - previousTotal) / previousTotal) * 100;
        
        if (percentageDifference > categoryIncreaseRule.threshold) {
          recommendations.push(
            categoryIncreaseRule.message
              .replace('{percentage}', percentageDifference.toFixed(1))
              .replace('{category}', category.name.toLowerCase())
          );
        }
      }
    });
  }
  
  // Check for frequent small expenses
  const frequentSmallRule = recommendationRules.find(rule => rule.type === 'frequent_small');
  if (frequentSmallRule) {
    categories.forEach(category => {
      const currentMonthCategoryExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);
        return (
          expense.category === category.id &&
          date.getMonth() === month &&
          date.getFullYear() === year &&
          expense.amount < 50 // Define small expenses as less than R$50
        );
      });
      
      if (currentMonthCategoryExpenses.length >= 5) { // At least 5 small expenses
        const totalAmount = currentMonthCategoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        recommendations.push(
          frequentSmallRule.message
            .replace('{category}', category.name.toLowerCase())
            .replace('{amount}', formatCurrency(totalAmount))
        );
      }
    });
  }
  
  return recommendations;
};

export const parseNaturalLanguageExpense = (
  input: string,
  categories: Category[]
): Partial<Expense> | null => {
  // Regular expressions to match common expense entry patterns in Portuguese
  const amountRegex = /R?\$\s?(\d+[.,]?\d*)/i;
  const categoryHints: Record<string, string[]> = {
    '1': ['mercado', 'supermercado', 'compras'],
    '2': ['restaurante', 'lanche', 'almoço', 'jantar', 'café', 'comida'],
    '3': ['transporte', 'ônibus', 'metrô', 'gasolina', 'combustível', 'uber', '99', 'táxi'],
    '4': ['aluguel', 'condomínio', 'apartamento', 'casa', 'moradia', 'água', 'luz', 'energia', 'gás'],
    '5': ['trabalho', 'escritório', 'material', 'equipamento'],
    '6': ['médico', 'consulta', 'farmácia', 'remédio', 'saúde', 'hospital'],
    '7': ['cinema', 'show', 'entretenimento', 'lazer', 'jogos', 'streaming', 'netflix', 'spotify', 'diversão'],
    '8': ['viagem', 'hotel', 'passagem', 'turismo'],
    '9': ['banco', 'investimento', 'imposto', 'financeiro', 'empréstimo', 'seguro'],
    '10': ['outros', 'diversos', 'compra'],
    '11': ['presente', 'aniversário', 'natal', 'lembrança']
  };

  // Extract amount
  const amountMatch = input.match(amountRegex);
  if (!amountMatch) return null;
  
  const amountStr = amountMatch[1].replace(',', '.');
  const amount = parseFloat(amountStr);
  
  if (isNaN(amount)) return null;
  
  // Extract description (everything else)
  let description = input
    .replace(amountMatch[0], '')
    .replace(/gastei|paguei|comprei|em|no|na|para/gi, '')
    .trim();
  
  // If description is empty or too short, use a default
  if (description.length < 3) {
    description = 'Despesa';
  }
  
  // Guess category based on description
  let bestCategoryId = '10'; // Default to "Outros"
  let bestMatchCount = 0;
  
  Object.entries(categoryHints).forEach(([categoryId, hints]) => {
    const lowerDescription = description.toLowerCase();
    
    const matchCount = hints.reduce((count, hint) => {
      return lowerDescription.includes(hint.toLowerCase()) ? count + 1 : count;
    }, 0);
    
    if (matchCount > bestMatchCount) {
      bestMatchCount = matchCount;
      bestCategoryId = categoryId;
    }
  });
  
  return {
    amount,
    description,
    category: bestCategoryId,
    date: new Date().toISOString().split('T')[0]
  };
};