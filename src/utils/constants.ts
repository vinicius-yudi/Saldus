import { Category, RecommendationRule } from '../types';
import { 
  ShoppingBag, Utensils, Bus, Home, Briefcase, Heart,
  Tv, Plane, Landmark, Wallet, Gift 
} from 'lucide-react';

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const CHART_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
];

export const defaultCategories: Category[] = [
  { id: '1', name: 'Mercado', color: '#10B981', icon: ShoppingBag.name },
  { id: '2', name: 'Alimentação', color: '#F97316', icon: Utensils.name },
  { id: '3', name: 'Transporte', color: '#3B82F6', icon: Bus.name },
  { id: '4', name: 'Moradia', color: '#8B5CF6', icon: Home.name },
  { id: '5', name: 'Trabalho', color: '#6B7280', icon: Briefcase.name },
  { id: '6', name: 'Saúde', color: '#EF4444', icon: Heart.name },
  { id: '7', name: 'Lazer', color: '#EC4899', icon: Tv.name },
  { id: '8', name: 'Viagem', color: '#F59E0B', icon: Plane.name },
  { id: '9', name: 'Finanças', color: '#059669', icon: Landmark.name },
  { id: '10', name: 'Outros', color: '#6B7280', icon: Wallet.name },
  { id: '11', name: 'Presentes', color: '#D946EF', icon: Gift.name }
];

export const recommendationRules: RecommendationRule[] = [
  {
    type: 'category_increase',
    threshold: 20,
    message: 'Você gastou {percentage}% a mais com {category} este mês. Que tal estabelecer um limite para esta categoria?'
  },
  {
    type: 'total_increase',
    threshold: 15,
    message: 'Seus gastos aumentaram {percentage}% comparado ao mês passado. Considere revisar suas despesas.'
  },
  {
    type: 'frequent_small',
    threshold: 10,
    message: 'Você fez muitas pequenas despesas em {category}. Estas pequenas compras somaram R$ {amount}.'
  }
];

export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});