import React, { useState } from 'react';
import { 
  Leaf, 
  TreePine, 
  Settings, 
  LogOut, 
  Bell, 
  BarChart3, 
  Calendar, 
  FileText, 
  Users,
  ChevronRight,
  Target,
  Award,
  Recycle,
  Heart,
  MapPin,
  Mail,
  Phone,
  Link,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatsCard = ({ icon, value, label }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-center mb-2 text-green-500">{icon}</div>
    <h3 className="text-center text-2xl font-bold text-gray-900">{value}</h3>
    <p className="text-center text-sm text-gray-500">{label}</p>
  </div>
);

const ProfileCard = ({ user }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="text-center">
      <img 
        src={user.avatar} 
        alt={user.name}
        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-green-100"
      />
      <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
      <p className="text-gray-500">{user.role}</p>
      <p className="mt-2 text-sm text-gray-600">{user.bio}</p>
    </div>
    <div className="mt-6 space-y-4">
      <div className="flex items-center text-gray-600">
        <MapPin className="h-5 w-5 mr-2" />
        <span className="text-sm">{user.location}</span>
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
        {user.expertise.map((skill, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ProjectCard = ({ project }) => (
  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-medium text-gray-900">{project.name}</h3>
        <p className="text-sm text-gray-500">Prazo: {project.deadline}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          project.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' :
          project.status === 'Finalização' ? 'bg-green-100 text-green-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status}
        </span>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
    <div className="mt-4">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block text-green-600">
              {project.progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded bg-green-100">
          <div 
            style={{ width: `${project.progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
          ></div>
        </div>
      </div>
    </div>
  </div>
);

function DashboardPage() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const user = {
    name: 'Ana Silva',
    role: 'Gerente de Projetos',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    location: 'São Paulo, SP',
    email: 'ana.silva@ecoviva.com',
    phone: '+55 (11) 98765-4321',
    bio: 'Apaixonada por sustentabilidade e inovação ambiental. Trabalhando para criar um futuro mais verde.',
    socialLinks: {
      linkedin: 'linkedin.com/in/anasilva',
      twitter: 'twitter.com/anasilva',
    },
    expertise: ['Gestão Ambiental', 'Sustentabilidade', 'Projetos Sociais', 'Educação Ambiental']
  };

  const projects = [
    {
      name: 'Reflorestamento Vale Verde',
      progress: 75,
      status: 'Em andamento',
      deadline: '15 Abril 2024'
    },
    {
      name: 'Energia Solar Comunidade',
      progress: 90,
      status: 'Finalização',
      deadline: '30 Março 2024'
    },
    {
      name: 'Reciclagem Urbana',
      progress: 30,
      status: 'Iniciado',
      deadline: '1 Junho 2024'
    }
  ];

  const stats = [
    { icon: <TreePine />, label: 'Árvores Plantadas', value: '1,234' },
    { icon: <Users />, label: 'Voluntários', value: '456' },
    { icon: <BarChart3 />, label: 'Projetos Ativos', value: '12' },
    { icon: <Calendar />, label: 'Eventos do Mês', value: '8' }
  ];

  const ecoGoals = [
    {
      title: 'Plantar 1987675674 Árvores',
      progress: 65,
      deadline: 'Dezembro 2024',
      type: 'Reflorestamento'
    },
    {
      title: 'Coletar 999999999kg de Recicláveis',
      progress: 40,
      deadline: 'Junho 2024',
      type: 'Reciclagem'
    },
    {
      title: 'Educar 1000000 Crianças',
      progress: 80,
      deadline: 'Setembro 2024',
      type: 'Educação'
    }
  ];

  const recentPosts = [
    {
      title: 'Como Iniciar sua Horta Urbana',
      date: '2 dias atrás',
      likes: 156,
      comments: 23,
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    {
      title: 'Dicas de Compostagem Doméstica',
      date: '4 dias atrás',
      likes: 98,
      comments: 15,
      image: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Mutirão de Limpeza - Praia de Santos',
      date: '25 Março 2024',
      time: '09:00',
      location: 'Santos, SP',
      participants: 45
    },
    {
      title: 'Workshop de Reciclagem Criativa',
      date: '2 Abril 2024',
      time: '14:00',
      location: 'Centro Cultural, SP',
      participants: 30
    },
    {
      title: 'Plantio Comunitário',
      date: '15 Abril 2024',
      time: '08:00',
      location: 'Parque Villa-Lobos',
      participants: 80
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
          {/* Profile Section */}
          <div className="lg:col-span-1 space-y-8">
            <ProfileCard user={user} />
            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts Recentes</h3>
              <div className="space-y-4">
                {recentPosts.map((post, index) => (
                  <div key={index} className="flex space-x-4">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{post.title}</h4>
                      <p className="text-sm text-gray-500">{post.date}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center text-sm text-gray-500">
                          <Heart className="h-4 w-4 mr-1" /> {post.likes}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <MessageSquare className="h-4 w-4 mr-1" /> {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Eco Goals */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Metas ECO</h2>
                <div className="space-y-6">
                  {ecoGoals.map((goal, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Target className="h-5 w-5 text-green-500 mr-2" />
                          <h3 className="font-medium text-gray-900">{goal.title}</h3>
                        </div>
                        <span className="text-sm text-gray-500">{goal.deadline}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-green-600">{goal.progress}%</span>
                          <span className="text-sm text-gray-500">{goal.type}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar and Events */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximos Eventos</h2>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {event.date}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {event.time}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-center">
                            <Users className="h-5 w-5 text-green-500 mb-1" />
                            <span className="text-sm text-gray-600">{event.participants}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Projetos Ativos</h2>
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
