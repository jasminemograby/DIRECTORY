import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

const stats = [
  {
    name: 'Total Employees',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Active Trainers',
    value: '89',
    change: '+5%',
    changeType: 'positive',
    icon: GraduationCap,
  },
  {
    name: 'Training Requests',
    value: '156',
    change: '+23%',
    changeType: 'positive',
    icon: FileText,
  },
  {
    name: 'Completion Rate',
    value: '87%',
    change: '+3%',
    changeType: 'positive',
    icon: TrendingUp,
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'training_request',
    title: 'New training request submitted',
    description: 'Sarah Johnson requested "Advanced React Development"',
    time: '2 hours ago',
    status: 'pending',
  },
  {
    id: 2,
    type: 'employee_update',
    title: 'Employee profile updated',
    description: 'Mike Chen updated their skills profile',
    time: '4 hours ago',
    status: 'completed',
  },
  {
    id: 3,
    type: 'trainer_approved',
    title: 'Trainer approved',
    description: 'Dr. Emily Rodriguez approved for Data Science courses',
    time: '6 hours ago',
    status: 'completed',
  },
  {
    id: 4,
    type: 'training_completed',
    title: 'Training completed',
    description: 'Alex Thompson completed "Project Management Fundamentals"',
    time: '1 day ago',
    status: 'completed',
  },
];

const upcomingTrainings = [
  {
    id: 1,
    title: 'React Advanced Patterns',
    trainer: 'Dr. Sarah Wilson',
    date: '2024-01-15',
    participants: 24,
    status: 'confirmed',
  },
  {
    id: 2,
    title: 'Data Science Fundamentals',
    trainer: 'Prof. Michael Brown',
    date: '2024-01-18',
    participants: 18,
    status: 'pending',
  },
  {
    id: 3,
    title: 'Leadership Skills',
    trainer: 'Lisa Anderson',
    date: '2024-01-22',
    participants: 12,
    status: 'confirmed',
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-100">Dashboard</h1>
          <p className="text-secondary-400 mt-2">
            Overview of your corporate learning platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-secondary-400">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover-lift"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-secondary-100 mt-1">
                  {stat.value}
                </p>
                <p className={`text-sm mt-1 ${
                  stat.changeType === 'positive' 
                    ? 'text-success-400' 
                    : 'text-error-400'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 bg-primary-600/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-100">
              Recent Activities
            </h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'completed' 
                    ? 'bg-success-600/20' 
                    : 'bg-warning-600/20'
                }`}>
                  {activity.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-success-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-warning-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-100">
                    {activity.title}
                  </p>
                  <p className="text-sm text-secondary-400 mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Trainings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-100">
              Upcoming Trainings
            </h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {upcomingTrainings.map((training) => (
              <div key={training.id} className="border border-secondary-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-secondary-100">
                      {training.title}
                    </h3>
                    <p className="text-sm text-secondary-400 mt-1">
                      by {training.trainer}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-secondary-500">
                      <span>{new Date(training.date).toLocaleDateString()}</span>
                      <span>{training.participants} participants</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    training.status === 'confirmed'
                      ? 'bg-success-600/20 text-success-400'
                      : 'bg-warning-600/20 text-warning-400'
                  }`}>
                    {training.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
