import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen,
  Award,
  Clock,
  DollarSign,
  Target
} from 'lucide-react';

export function Analytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-100">
            Analytics & Insights
          </h1>
          <p className="text-secondary-400 mt-2">
            Training performance and organizational insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-400">
                Training Completion Rate
              </p>
              <p className="text-2xl font-bold text-secondary-100 mt-1">
                87%
              </p>
              <p className="text-sm text-success-400 mt-1">
                +5% from last month
              </p>
            </div>
            <div className="p-3 bg-success-600/20 rounded-lg">
              <Target className="w-6 h-6 text-success-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-400">
                Average Score
              </p>
              <p className="text-2xl font-bold text-secondary-100 mt-1">
                4.2/5
              </p>
              <p className="text-sm text-success-400 mt-1">
                +0.3 from last month
              </p>
            </div>
            <div className="p-3 bg-accent-600/20 rounded-lg">
              <Award className="w-6 h-6 text-accent-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-400">
                Training Hours
              </p>
              <p className="text-2xl font-bold text-secondary-100 mt-1">
                2,847
              </p>
              <p className="text-sm text-success-400 mt-1">
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-primary-600/20 rounded-lg">
              <Clock className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-400">
                Training Investment
              </p>
              <p className="text-2xl font-bold text-secondary-100 mt-1">
                $45,230
              </p>
              <p className="text-sm text-success-400 mt-1">
                +8% from last month
              </p>
            </div>
            <div className="p-3 bg-warning-600/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-warning-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Training Progress by Department */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-secondary-100 mb-6">
            Training Progress by Department
          </h3>
          <div className="space-y-4">
            {[
              { department: 'Engineering', progress: 92, employees: 45, completed: 41 },
              { department: 'Product', progress: 87, employees: 23, completed: 20 },
              { department: 'Marketing', progress: 78, employees: 18, completed: 14 },
              { department: 'Sales', progress: 85, employees: 32, completed: 27 },
              { department: 'HR', progress: 95, employees: 12, completed: 11 },
            ].map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-100">
                    {dept.department}
                  </span>
                  <span className="text-sm text-secondary-400">
                    {dept.completed}/{dept.employees} employees
                  </span>
                </div>
                <div className="w-full bg-secondary-700 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${dept.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-secondary-500">
                  {dept.progress}% completion rate
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Performing Trainers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-secondary-100 mb-6">
            Top Performing Trainers
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Dr. Sarah Wilson', rating: 4.9, students: 245, courses: 8 },
              { name: 'Prof. Michael Brown', rating: 4.8, students: 189, courses: 6 },
              { name: 'Lisa Anderson', rating: 4.7, students: 156, courses: 5 },
              { name: 'Dr. Mike Chen', rating: 4.6, students: 134, courses: 4 },
              { name: 'Emily Rodriguez', rating: 4.5, students: 98, courses: 3 },
            ].map((trainer, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-secondary-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {trainer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-100">
                      {trainer.name}
                    </p>
                    <p className="text-xs text-secondary-400">
                      {trainer.students} students • {trainer.courses} courses
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold text-secondary-100">
                      {trainer.rating}
                    </span>
                    <span className="text-xs text-secondary-400">★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Training Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-secondary-100 mb-6">
          Training Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-primary-400" />
            </div>
            <h4 className="font-medium text-secondary-100 mb-1">
              Most Popular Skills
            </h4>
            <div className="space-y-1 text-sm text-secondary-400">
              <p>React Development</p>
              <p>Data Science</p>
              <p>Project Management</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-success-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-success-400" />
            </div>
            <h4 className="font-medium text-secondary-100 mb-1">
              Employee Engagement
            </h4>
            <div className="space-y-1 text-sm text-secondary-400">
              <p>92% completion rate</p>
              <p>4.2 average rating</p>
              <p>156 active learners</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-8 h-8 text-accent-400" />
            </div>
            <h4 className="font-medium text-secondary-100 mb-1">
              Course Performance
            </h4>
            <div className="space-y-1 text-sm text-secondary-400">
              <p>24 active courses</p>
              <p>89% satisfaction</p>
              <p>2.8k total hours</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Note about external analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card bg-warning-600/10 border-warning-600/30"
      >
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-5 h-5 text-warning-400" />
          <div>
            <h4 className="font-medium text-warning-400">
              Advanced Analytics Available
            </h4>
            <p className="text-sm text-warning-300 mt-1">
              For detailed reporting and advanced analytics, visit the external HR Reporting service.
              This directory provides organizational data to support comprehensive analysis.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
