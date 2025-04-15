import  api  from '../API/axios';
import routes  from '../API/routes';

export async function uploadPhotoToServer(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post(routes.user.update, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url; // ou o campo correspondente no seu backend
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
