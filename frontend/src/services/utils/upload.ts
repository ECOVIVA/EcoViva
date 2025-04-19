import api from '../API/axios';
import routes from '../API/routes';

const BASE_URL = 'http://localhost:8000'; // Se necessário, defina a URL base do seu servidor

export async function uploadPhotoToServer(file: File, type: string): Promise<string | null> {
  const formData = new FormData();

  if (!file.type.startsWith('image/')) {
    console.error('O arquivo não é uma imagem válida');
    return null;
  }

  formData.append('file', file);

  try {
    const response = await api.patch(routes.user.update, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response && response.data && response.data.url) {
      // Se o servidor retornar apenas o caminho, combine com a URL base
      const fullUrl = `${BASE_URL}/${response.data.url}`; // Aqui você pode ajustar conforme o campo que o servidor retorna
      return fullUrl;
    } else {
      console.error('Resposta inesperada do servidor:', response);
      return null;
    }
  } catch (error) {
    console.error('Erro ao enviar imagem para o servidor:', error);
    return null;
  }
}

export async function updateUserPhoto(photoUrl: string): Promise<void> {
  try {
    await api.patch(routes.user.update, {
      photo: photoUrl,
    });
  } catch (error) {
    console.error('Erro ao atualizar foto do usuário:', error);
  }
}
