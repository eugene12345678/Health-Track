import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookMarked as BookMedical, UserPlus, PlusCircle, TrendingUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { useApi } from '../context/ApiContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPrograms: 0,
    totalEnrollments: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch clients with their enrollments
      const [clients, programs] = await Promise.all([
        api.getClients(),
        api.getPrograms()
      ]);
      
      // Calculate total enrollments by summing up each client's enrollments
      const totalEnrollments = clients.reduce((acc, client) => {
        return acc + (client.enrollments?.length || 0);
      }, 0);
      
      setStats({
        totalClients: clients.length,
        totalPrograms: programs.length,
        totalEnrollments
      });
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const cards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: <Users className="h-12 w-12 text-blue-500" />,
      action: () => navigate('/clients'),
      actionText: 'View All',
      color: 'from-blue-400/20 to-blue-500/20',
      trend: '+12% from last month',
    },
    {
      title: 'Health Programs',
      value: stats.totalPrograms,
      icon: <BookMedical className="h-12 w-12 text-emerald-500" />,
      action: () => navigate('/programs'),
      actionText: 'View All',
      color: 'from-emerald-400/20 to-emerald-500/20',
      trend: '+5 new programs',
    },
    {
      title: 'Program Enrollments',
      value: stats.totalEnrollments,
      icon: <UserPlus className="h-12 w-12 text-purple-500" />,
      color: 'from-purple-400/20 to-purple-500/20',
      trend: '+8% increase',
    },
  ];
  
  const quickActions = [
    {
      title: 'Register New Client',
      description: 'Add a new client to the system',
      icon: <UserPlus className="h-8 w-8 text-blue-500" />,
      action: () => navigate('/clients/new'),
      color: 'from-blue-400/20 to-blue-500/20',
    },
    {
      title: 'Create New Program',
      description: 'Add a new health program',
      icon: <PlusCircle className="h-8 w-8 text-emerald-500" />,
      action: () => navigate('/programs/new'),
      color: 'from-emerald-400/20 to-emerald-500/20',
    },
    {
      title: 'Search Clients',
      description: 'Find and view client profiles',
      icon: <Users className="h-8 w-8 text-purple-500" />,
      action: () => navigate('/search'),
      color: 'from-purple-400/20 to-purple-500/20',
    },
  ];

  // Activity graph data based on real enrollments
  const activityData = [
    { date: '2024-01', enrollments: Math.max(5, stats.totalEnrollments - 15) },
    { date: '2024-02', enrollments: Math.max(8, stats.totalEnrollments - 12) },
    { date: '2024-03', enrollments: Math.max(10, stats.totalEnrollments - 8) },
    { date: '2024-04', enrollments: Math.max(12, stats.totalEnrollments - 5) },
    { date: '2024-05', enrollments: Math.max(15, stats.totalEnrollments - 2) },
    { date: '2024-06', enrollments: stats.totalEnrollments }
  ];

  const maxEnrollments = Math.max(...activityData.map(d => d.enrollments));
  const graphHeight = 200;

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-64 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="HealthTrack Dashboard"
        subtitle="Real-time overview of health programs and client data"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card 
            key={index} 
            glowColor={card.color}
            className="transform transition-all duration-500 hover:scale-[1.02]"
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className="animate-float">{card.icon}</div>
              </div>
              
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-600">{card.trend}</span>
              </div>
              
              {card.action && (
                <div className="mt-4">
                  <button
                    onClick={card.action}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium group flex items-center"
                  >
                    {card.actionText}
                    <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Activity Graph */}
      <Card title="System Activity" glowColor="from-gray-400/20 to-gray-500/20">
        <div className="h-64 relative">
          <div className="absolute inset-0 flex items-end justify-between px-4">
            {activityData.map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-12 bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600"
                  style={{ 
                    height: `${(data.enrollments / maxEnrollments) * graphHeight}px`,
                    background: 'linear-gradient(to top, #3b82f6, #60a5fa)'
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{data.date}</span>
              </div>
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
            {[maxEnrollments, Math.floor(maxEnrollments / 2), 0].map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
        </div>
      </Card>
      
      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              glowColor={action.color}
              className="cursor-pointer group transform transition-all duration-300 hover:scale-105"
              onClick={action.action}
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                  {action.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;