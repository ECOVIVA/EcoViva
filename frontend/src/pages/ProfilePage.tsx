import { useEffect, useState } from 'react';
import {
  Leaf, TreePine, Settings, Bell, BarChart3, Calendar,
  Users,  Recycle, Heart,
  Mail, Phone, Clock,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import api from '../services/API/axios';
import routes from '../services/API/routes';
import { User } from '../types/types';


const StatsCard = ({ icon, value, label }: {icon: any, value:any, label:any}) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-center mb-2 text-green-500">{icon}</div>
    <h3 className="text-center text-2xl font-bold text-gray-900">{value}</h3>
    <p className="text-center text-sm text-gray-500">{label}</p>
  </div>
);

const ProfileCard = ({ user }: {user: User}) => {
  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center">
      {user?.photo ? (
            <img
              src={`http://localhost:8000/${user.photo}`}
              alt={user.username}
              className={"w-24 h-24 rounded-full mx-auto mb-4 border-4 border-green-100"}
            />
          ) : (
            <div className={"w-24 h-24 flex justify-center items-center rounded-full mx-auto mb-4 border-4 border-green-100"}>
              <UserIcon className="h-16 w-16" />
            </div>
          )}
        <h2 className="text-xl font-bold text-gray-900">{user.first_name} {user.last_name}</h2>
        {/*<p className="text-gray-500">{user.role}</p>*/}
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center text-gray-600">
          <span className="whitespace-pre-line">{user.bio}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Mail className="h-5 w-5 mr-2" />
          <span className="text-sm">{user.email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="h-5 w-5 mr-2" />
          <span className="text-sm">{user.phone}</span>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold text-gray-900 mb-2">Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {user.interests?.map((interest, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
          </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [user, setUser] = useState<User>({
    id: 0,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(routes.user.profile);
        if (response.status === 200) {
          setUser(response.data);
        } else if (response.status === 401) {
          console.error("Usuário não autenticado.");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Carregando perfil...</div>;
  }

  const stats = [
    { icon: <TreePine />, label: 'Árvores Plantadas', value: '1,234' },
    { icon: <Users />, label: 'Voluntários', value: '456' },
    { icon: <BarChart3 />, label: 'Projetos Ativos', value: '12' },
    { icon: <Calendar />, label: 'Eventos do Mês', value: '8' }
  ];

  const ecoGoals = [
    { title: 'Reciclagem Semanal', progress: 70, icon: <Recycle className="h-6 w-6" /> },
    { title: 'Reduzir Consumo de Água', progress: 40, icon: <Leaf className="h-6 w-6" /> },
    { title: 'Mobilidade Sustentável', progress: 80, icon: <Heart className="h-6 w-6" /> }
  ];

  const recentPosts = [
    {
      title: 'Como reduzir o uso de plástico no dia a dia',
      date: '05/04/2025',
      excerpt: 'Dicas práticas para diminuir o uso de plásticos descartáveis.'
    },
    {
      title: 'Energia solar: vale a pena?',
      date: '02/04/2025',
      excerpt: 'Analisamos os prós e contras do uso de painéis solares.'
    }
  ];

  const upcomingEvents = [
    {
      name: 'Caminhada Ecológica',
      date: '12/04/2025',
      time: '08:00',
      location: 'Parque Central'
    },
    {
      name: 'Oficina de Compostagem',
      date: '20/04/2025',
      time: '14:00',
      location: 'Centro Cultural'
    }
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda */}
          <div className="lg:col-span-1 space-y-8">
            <ProfileCard user={user} />
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Postagens Recentes</h3>
              <ul className="space-y-4">
                {recentPosts.map((post, index) => (
                  <li key={index}>
                    <h4 className="font-medium text-gray-800">{post.title}</h4>
                    <p className="text-sm text-gray-500">{post.date}</p>
                    <p className="text-sm text-gray-600">{post.excerpt}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Metas Ecológicas</h3>
              <div className="space-y-4">
                {ecoGoals.map((goal, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {goal.icon}
                        <span className="text-sm font-medium text-gray-800">{goal.title}</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-green-100 rounded-full mt-1">
                      <div
                        className="h-2 bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Próximos Eventos</h3>
              <ul className="divide-y divide-gray-200">
                {upcomingEvents.map((event, index) => (
                  <li key={index} className="py-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800">{event.name}</h4>
                        <p className="text-sm text-gray-500">
                          {event.date} às {event.time} - {event.location}
                        </p>
                      </div>
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
