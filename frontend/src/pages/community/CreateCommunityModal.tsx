import React, { useState } from 'react';
import { X, Upload, Users, Lock, Globe, Image as ImageIcon } from 'lucide-react';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityCreated: (community: any) => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ 
  isOpen, 
  onClose, 
  onCommunityCreated 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    isPrivate: false,
    image: '',
    rules: [''],
    tags: ['']
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Meio Ambiente',
    'Lifestyle',
    'Conservação',
    'Tecnologia',
    'Agricultura',
    'Pesquisa',
    'Finanças',
    'Educação',
    'Saúde',
    'Arte & Cultura'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field: 'rules' | 'tags', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'rules' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'rules' | 'tags', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da comunidade é obrigatório';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newCommunity = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      members: 1, // Creator is the first member
      image: imagePreview || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      isPrivate: formData.isPrivate,
      category: formData.category,
      rules: formData.rules.filter(rule => rule.trim()),
      tags: formData.tags.filter(tag => tag.trim()),
      createdAt: new Date().toISOString(),
      isOwner: true
    };

    onCommunityCreated(newCommunity);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      isPrivate: false,
      image: '',
      rules: [''],
      tags: ['']
    });
    setImagePreview('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Criar Nova Comunidade</h2>
            <p className="text-gray-600 mt-1">Construa sua própria comunidade sustentável</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Community Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem da Comunidade
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="community-image"
                  />
                  <label
                    htmlFor="community-image"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={16} className="mr-2" />
                    Escolher Imagem
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
                </div>
              </div>
            </div>

            {/* Community Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Comunidade *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Comunidade Verde Sustentável"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Descreva o propósito e objetivos da sua comunidade..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Privacy Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Comunidade
              </label>
              <div className="space-y-3">
                <div
                  onClick={() => handleInputChange('isPrivate', false)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    !formData.isPrivate ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Globe size={20} className={!formData.isPrivate ? 'text-green-600' : 'text-gray-400'} />
                    <div>
                      <h4 className="font-medium text-gray-900">Pública</h4>
                      <p className="text-sm text-gray-600">Qualquer pessoa pode encontrar e participar</p>
                    </div>
                  </div>
                </div>
                
                <div
                  onClick={() => handleInputChange('isPrivate', true)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.isPrivate ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Lock size={20} className={formData.isPrivate ? 'text-blue-600' : 'text-gray-400'} />
                    <div>
                      <h4 className="font-medium text-gray-900">Privada</h4>
                      <p className="text-sm text-gray-600">Apenas membros aprovados podem participar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (opcional)
              </label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ex: sustentabilidade, meio-ambiente"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('tags')}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                + Adicionar tag
              </button>
            </div>

            {/* Community Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regras da Comunidade (opcional)
              </label>
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleArrayChange('rules', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ex: Seja respeitoso com todos os membros"
                  />
                  {formData.rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('rules', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('rules')}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                + Adicionar regra
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Ao criar uma comunidade, você concorda com nossos termos de uso
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors flex items-center space-x-2"
              >
                <Users size={16} />
                <span>Criar Comunidade</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};