<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Edit2, Save, Award, Camera, Image, Trophy, Star } from 'lucide-react';
import { z } from 'zod';
import api from '../services/API/axios';
import routes from '../services/API/routes';
=======
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Edit2, Save, Award, Trophy, Star, Camera, Image } from 'lucide-react';
import { z } from 'zod';
import { useState } from 'react';
>>>>>>> 75b64d3cb53a0a561786d83d7274becff5ef3b28

const profileSchema = z.object({
  bio: z.string().min(10, "Bio deve ter pelo menos 10 caracteres"),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
  profileImage: z.instanceof(File).optional().or(z.string()),
  backgroundImage: z.instanceof(File).optional().or(z.string())
});

function App() {
  const [isEditing, setIsEditing] = useState(false);
<<<<<<< HEAD
  const [bio, setBio] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || 'https://via.placeholder.com/150');
  const [backgroundImage, setBackgroundImage] = useState(localStorage.getItem('backgroundImage') || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [ecoProgress, setEcoProgress] = useState(0);
  const [rank, setRank] = useState({
    title: 'Iniciante Verde',
    level: 'Easy',
    points: 100,
    nextLevel: 150
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get(routes.user.profile);
        const data = response.data;

        setUserName(data.username || 'Usuário');
        setBio(data.bio || '');
        setDescription(data.description || '');
        setProfileImage(data.photo ? `http://localhost:8000${data.photo}` : profileImage);
        setBackgroundImage(data.backgroundImage ? `http://localhost:8000${data.backgroundImage}` : backgroundImage);
        
        const currentPoints = data.rank?.points || 0;
        const nextLevelPoints = data.rank?.difficulty?.points_for_activity || 1000;
        const progress = Math.round((currentPoints / nextLevelPoints) * 100);
        setEcoProgress(progress);
        
        setRank({
          title: data.rank?.title || 'Sem título',
          level: data.rank?.difficulty?.name || 'Bronze',
          points: currentPoints,
          nextLevel: nextLevelPoints
        });
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError('Não foi possível carregar o perfil.');
      }
    }

    fetchProfile();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'background') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    if (type === 'profile') {
      setProfileImage(imageUrl);
      localStorage.setItem('profileImage', imageUrl);

      const uploadedPhotoUrl = await uploadPhotoToServer(file);
      if (uploadedPhotoUrl) {
        setProfileImage(uploadedPhotoUrl);
        localStorage.setItem('profileImage', uploadedPhotoUrl);
        await updateUserPhoto(uploadedPhotoUrl);
      }
    } else {
      setBackgroundImage(imageUrl);
      localStorage.setItem('backgroundImage', imageUrl);

      const uploadedBackgroundUrl = await uploadPhotoToServer(file);
      if (uploadedBackgroundUrl) {
        setBackgroundImage(uploadedBackgroundUrl);
        localStorage.setItem('backgroundImage', uploadedBackgroundUrl);
        await updateUserPhoto(uploadedBackgroundUrl);
      }
    }
  };

  // Função para fazer o upload da foto para o servidor
  async function uploadPhotoToServer(_photo: any) {
    try {
      const formData = new FormData();
      formData.append('photo', _photo);

      const response = await api.patch(routes.user.update, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Supondo que a resposta do servidor contenha a URL da foto
      return `http://localhost:8000${response.data.photo}`;
    } catch (err) {
      console.error("Erro ao enviar foto:", err);
      setError('Erro ao enviar foto para o servidor.');
      return null;
    }
  }

  // Função para atualizar a foto do usuário no servidor (ou banco de dados)
  async function updateUserPhoto(uploadedPhotoUrl: string) {
    try {
      await api.patch(routes.user.update, {
        photo: uploadedPhotoUrl
      });
    } catch (err) {
      console.error("Erro ao atualizar a foto do usuário:", err);
      setError('Erro ao atualizar a foto do perfil.');
    }
  }

  const handleSave = async () => {
    try {
      profileSchema.parse({ bio, description, profileImage, backgroundImage });
      
      try {
        await api.patch(routes.user.update, { bio, description });
        setIsEditing(false);
        setError('');
      } catch (err) {
        console.error("Erro ao salvar perfil:", err);
        setError('Erro ao salvar as alterações.');
      }
=======
  const [bio, setBio] = useState("Amante da natureza e defensor do meio ambiente. Sempre buscando maneiras de contribuir para um mundo mais sustentável.");
  const [description, setDescription] = useState("Trabalho com projetos de sustentabilidade há 5 anos, focando em iniciativas de reciclagem e educação ambiental.");
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&fit=crop");
  const [backgroundImage, setBackgroundImage] = useState("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format");
  const [error, setError] = useState("");
  
  const ecoProgress = 75;
  const rank = {
    title: "Guardião da Natureza",
    level: "Ouro",
    points: 7500,
    nextLevel: 10000
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === 'profile') {
        setProfileImage(imageUrl);
      } else {
        setBackgroundImage(imageUrl);
      }
    }
  };

  const handleSave = () => {
    try {
      profileSchema.parse({ bio, description, profileImage, backgroundImage });
      setIsEditing(false);
      setError("");
>>>>>>> 75b64d3cb53a0a561786d83d7274becff5ef3b28
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    }
  };
<<<<<<< HEAD
=======


>>>>>>> 75b64d3cb53a0a561786d83d7274becff5ef3b28
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="relative">
          <motion.div 
            className="relative h-48 bg-gradient-to-r from-emerald-500 to-green-400 overflow-hidden group"
            initial={{ height: 0 }}
            animate={{ height: 192 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col items-center gap-2">
                  <Image className="text-white" size={24} />
                  <label className="cursor-pointer px-3 py-1 bg-white/90 rounded text-sm hover:bg-white/100 transition-colors">
                    Escolher Imagem de Fundo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'background')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -bottom-16 left-8 z-10"
          >
            <div className="relative group">
              <img
                src={profileImage}
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="text-white" size={24} />
                    <label className="cursor-pointer px-3 py-1 bg-white/90 rounded text-sm hover:bg-white/100 transition-colors">
                      Escolher Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'profile')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold text-gray-800 flex items-center gap-2"
              >
<<<<<<< HEAD
                {userName} <Leaf className="text-green-500" />
=======
                Maria Silva <Leaf className="text-green-500" />
>>>>>>> 75b64d3cb53a0a561786d83d7274becff5ef3b28
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mt-2"
              >
                <Award className="text-yellow-500" size={20} />
                <span className="text-sm font-medium text-gray-600">{rank.title}</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                  Nível {rank.level}
                </span>
              </motion.div>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
              {isEditing ? 'Salvar' : 'Editar'}
            </button>
          </div>
<<<<<<< HEAD

=======
>>>>>>> 75b64d3cb53a0a561786d83d7274becff5ef3b28
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 bg-emerald-50 p-6 rounded-xl border border-emerald-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Progresso ECOviva</h2>
              <div className="flex items-center gap-2">
                <Trophy className="text-emerald-500" size={20} />
                <span className="text-sm font-medium text-gray-600">
                  {rank.points} / {rank.nextLevel} pontos
                </span>
              </div>
            </div>
            <div className="bg-white rounded-full h-4 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ecoProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
              </motion.div>
            </div>
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <Star className="text-yellow-500" size={16} />
              {ecoProgress}% do próximo nível
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Bio</h2>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={3}
<<<<<<< HEAD
                  placeholder="Digite sua bio"
                />
              ) : (
                <p className="text-gray-600">{bio || 'Nenhuma bio definida'}</p>
=======
                />
              ) : (
                <p className="text-gray-600">{bio}</p>
>>>>>>> 75b64d3cb53a0a561786d83d7274becff5ef3b28
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Descrição</h2>
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={4}
<<<<<<< HEAD
                  placeholder="Digite sua descrição"
                />
              ) : (
                <p className="text-gray-600">{description || 'Nenhuma descrição definida'}</p>
=======
                />
              ) : (
                <p className="text-gray-600">{description}</p>
>>>>>>> 75b64d3cb53a0a561786d83d7274becff5ef3b28
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-emerald-50 p-6 rounded-xl border border-emerald-100"
            >
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Conquistas Ambientais</h2>
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <Leaf className="text-emerald-500" size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-700">100 árvores plantadas</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <Leaf className="text-emerald-500" size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-700">50kg reciclados</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <Leaf className="text-emerald-500" size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-700">10 eventos eco</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
<<<<<<< HEAD


=======
>>>>>>> 75b64d3cb53a0a561786d83d7274becff5ef3b28
