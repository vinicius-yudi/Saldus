import React from 'react';
import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

export const getCategoryIcon = (iconName: string): React.FC<LucideIcons.LucideProps> => {
  // Default to Wallet if the icon name doesn't exist
  return (LucideIcons[iconName as IconName] || LucideIcons.Wallet) as React.FC<LucideIcons.LucideProps>;
};

export const IconSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const commonIcons: IconName[] = [
    'ShoppingBag',
    'Utensils',
    'Bus',
    'Home',
    'Briefcase',
    'Heart',
    'Tv',
    'Plane',
    'Landmark',
    'Wallet',
    'Gift',
    'Smartphone',
    'BookOpen',
    'CreditCard',
    'Coffee',
    'ShoppingCart',
    'Car',
    'Shirt',
    'GraduationCap',
    'DollarSign',
    'Tag',
    'Flame',
    'Cloud',
    'Wine',
    'Music'
  ];

  return (
    <div className="grid grid-cols-5 gap-2 mt-2">
      {commonIcons.map((iconName) => {
        const IconComponent = LucideIcons[iconName];
        return (
          <button
            key={iconName}
            type="button"
            onClick={() => onChange(iconName)}
            className={`p-2 rounded-lg flex items-center justify-center ${
              value === iconName
                ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <IconComponent size={20} />
          </button>
        );
      })}
    </div>
  );
};