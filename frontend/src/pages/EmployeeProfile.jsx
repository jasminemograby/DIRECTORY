import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Award,
  BookOpen,
  TrendingUp,
  Edit,
  Star,
  Clock
} from 'lucide-react';

export function EmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEmployee({
        id: id,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        phone: '+1 (555) 123-4567',
        position: 'Senior Software Engineer',
        department: 'Engineering',
        team: 'Frontend Team',
        location: 'San Francisco, CA',
        startDate: '2022-03-15',
        manager: 'Mike Chen',
        avatar: null,
        skills: [
          { name: 'React', level: 'Expert', category: 'Frontend' },
          { name: 'TypeScript', level: 'Advanced', category: 'Frontend' },
          { name: 'Node.js', level: 'Intermediate', category: 'Backend' },
          { name: 'AWS', level: 'Intermediate', category: 'Cloud' },
        ],
        certifications: [
          { name: 'AWS Certified Developer', issuer: 'Amazon', date: '2023-06-15' },
          { name: 'React Professional', issuer: 'Meta', date: '2023-03-20' },
        ],
        trainingHistory: [
          { title: 'Advanced React Patterns', completed: '2023-11-15', score: 95 },
          { title: 'TypeScript Fundamentals', completed: '2023-09-20', score: 88 },
          { title: 'AWS Cloud Architecture', completed: '2023-07-10', score: 92 },
        ],
        currentTrainings: [
          { title: 'Microservices Architecture', progress: 65, dueDate: '2024-02-15' },
          { title: 'DevOps Best Practices', progress: 30, dueDate: '2024-03-01' },
        ],
        performance: {
          overall: 4.2,
          technical: 4.5,
          communication: 4.0,
          leadership: 3.8,
        }
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-400">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-100">
            {employee.name}
          </h1>
          <p className="text-secondary-400 mt-2">
            {employee.position} • {employee.department}
          </p>
        </div>
        <button className="btn-primary">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-secondary-100">
                {employee.name}
              </h2>
              <p className="text-secondary-400 mt-1">{employee.position}</p>
              <p className="text-sm text-secondary-500 mt-1">
                {employee.team} • {employee.department}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-secondary-400" />
                <span className="text-sm text-secondary-300">{employee.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-secondary-400" />
                <span className="text-sm text-secondary-300">{employee.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-secondary-400" />
                <span className="text-sm text-secondary-300">{employee.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-secondary-400" />
                <span className="text-sm text-secondary-300">
                  Started {new Date(employee.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-secondary-100 mb-4">
              Performance Rating
            </h3>
            <div className="space-y-3">
              {Object.entries(employee.performance).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-secondary-300 capitalize">
                    {key}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-secondary-700 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(value / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-secondary-300 w-8">
                      {value.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Skills & Training */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-100">
                Skills & Competencies
              </h3>
              <button className="text-sm text-primary-400 hover:text-primary-300">
                Manage Skills
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employee.skills.map((skill, index) => (
                <div key={index} className="border border-secondary-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-secondary-100">{skill.name}</h4>
                    <span className={`badge ${
                      skill.level === 'Expert' ? 'badge-primary' :
                      skill.level === 'Advanced' ? 'badge-success' :
                      'badge-secondary'
                    }`}>
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-400">{skill.category}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Current Training */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-secondary-100 mb-4">
              Current Training
            </h3>
            <div className="space-y-4">
              {employee.currentTrainings.map((training, index) => (
                <div key={index} className="border border-secondary-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-secondary-100">
                      {training.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-secondary-400">
                      <Clock className="w-4 h-4" />
                      <span>Due {new Date(training.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${training.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-secondary-400">
                    {training.progress}% complete
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Training History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-secondary-100 mb-4">
              Training History
            </h3>
            <div className="space-y-3">
              {employee.trainingHistory.map((training, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-secondary-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-secondary-100">
                      {training.title}
                    </h4>
                    <p className="text-sm text-secondary-400">
                      Completed {new Date(training.completed).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-accent-400" />
                    <span className="text-sm font-medium text-secondary-100">
                      {training.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
