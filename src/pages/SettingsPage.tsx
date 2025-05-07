import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IconSelector } from '../components/icons';
import { X, Plus } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useApp();
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3B82F6',
    icon: 'ShoppingBag'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newCategory.name.trim().length === 0) {
      return;
    }
    
    addCategory({
      name: newCategory.name,
      color: newCategory.color,
      icon: newCategory.icon
    });
    
    setNewCategory({
      name: '',
      color: '#3B82F6',
      icon: 'ShoppingBag'
    });
  };

  const colorOptions = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F97316', // orange
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F59E0B', // amber
    '#06B6D4', // cyan
    '#6B7280', // gray
    '#059669', // emerald
    '#D946EF'  // fuchsia
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Configurações
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Personalize o aplicativo de acordo com suas necessidades
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Gerenciar Categorias
          </h2>
          
          <div className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome da categoria
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Ex: Transporte"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cor
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCategory({ ...newCategory, color })}
                        className={`w-8 h-8 rounded-full ${
                          newCategory.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Cor ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ícone
                </label>
                <IconSelector
                  value={newCategory.icon}
                  onChange={(value) => setNewCategory({ ...newCategory, icon: value })}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus size={16} />
                  <span>Adicionar Categoria</span>
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Categorias Atuais
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span className="text-gray-800 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label={`Excluir categoria ${category.name}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Sobre o Aplicativo
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Saldus é um aplicativo de finanças pessoais projetado para ajudar você a acompanhar seus gastos, 
              categorizar despesas e receber insights personalizados para economizar.
            </p>
            
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recursos Principais
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Registro fácil de despesas</li>
                <li>Categorização automatizada</li>
                <li>Relatórios mensais detalhados</li>
                <li>Recomendações personalizadas</li>
                <li>Suporte a tema claro/escuro</li>
                <li>Exportação de relatórios (em breve)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Versão
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};