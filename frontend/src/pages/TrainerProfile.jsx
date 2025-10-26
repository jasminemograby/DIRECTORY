import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Star, 
  BookOpen,
  DollarSign,
  Globe,
  Edit
} from 'lucide-react';

export function TrainerProfile() {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTrainer({
        id,
        name: 'Dr. Sarah Wilson',
        title: 'Senior Data Science Instructor',
        email: 'sarah.wilson@company.com',
        phone: '+1 (555) 987-6543',
        bio: 'Experienced data scientist with 10+ years in machine learning and AI. PhD in Computer Science from Stanford University.',
        avatar: null,
        rating: 4.8,
        reviewCount: 127,
        hourlyRate: 150,
        languages: ['English', 'Spanish'],
        specializations: [
          'Machine Learning',
          'Deep Learning',
          'Data Analysis',
          'Python Programming',
          'Statistics'
        ],
        certifications: [
          { name: 'AWS Machine Learning Specialty', issuer: 'Amazon', date: '2023-08-15' },
          { name: 'Google Cloud ML Engineer', issuer: 'Google', date: '2023-05-20' },
          { name: 'Certified Data Scientist', issuer: 'Data Science Council', date: '2022-12-10' },
        ],
        teachingExperience: '8 years',
        courses: [
          {
            id: 1,
            title: 'Machine Learning Fundamentals',
            description: 'Introduction to ML algorithms and techniques',
            duration: '40 hours',
            level: 'Beginner',
            students: 245,
            rating: 4.7,
            price: 299
          },
          {
            id: 2,
            title: 'Advanced Deep Learning',
            description: 'Deep neural networks and advanced architectures',
            duration: '60 hours',
            level: 'Advanced',
            students: 89,
            rating: 4.9,
            price: 499
          },
          {
            id: 3,
            title: 'Data Science with Python',
            description: 'Complete data science workflow using Python',
            duration: '50 hours',
            level: 'Intermediate',
            students: 156,
            rating: 4.6,
            price: 399
          }
        ],
        availability: {
          timezone: 'PST',
          schedule: [
            { day: 'Monday', hours: '9:00 AM - 5:00 PM' },
            { day: 'Tuesday', hours: '9:00 AM - 5:00 PM' },
            { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' },
            { day: 'Thursday', hours: '9:00 AM - 5:00 PM' },
            { day: 'Friday', hours: '9:00 AM - 3:00 PM' },
          ]
        },
        recentReviews: [
          {
            id: 1,
            student: 'Alex Thompson',
            rating: 5,
            comment: 'Excellent instructor! Very knowledgeable and patient.',
            date: '2024-01-10'
          },
          {
            id: 2,
            student: 'Maria Garcia',
            rating: 5,
            comment: 'Great course structure and practical examples.',
            date: '2024-01-08'
          },
          {
            id: 3,
            student: 'John Smith',
            rating: 4,
            comment: 'Good content, but could use more hands-on exercises.',
            date: '2024-01-05'
          }
        ]
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

  if (!trainer) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-400">Trainer not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-100">
            {trainer.name}
          </h1>
          <p className="text-secondary-400 mt-2">
            {trainer.title}
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
              <div className="w-24 h-24 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-secondary-100">
                {trainer.name}
              </h2>
              <p className="text-secondary-400 mt-1">{trainer.title}</p>
              
              {/* Rating */}
              <div className="flex items-center justify-center space-x-2 mt-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(trainer.rating)
                          ? 'text-accent-400 fill-current'
                          : 'text-secondary-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-secondary-300">
                  {trainer.rating} ({trainer.reviewCount} reviews)
                </span>
              </div>

              {/* Rate */}
              <div className="flex items-center justify-center space-x-2 mt-3">
                <DollarSign className="w-4 h-4 text-secondary-400" />
                <span className="text-lg font-semibold text-secondary-100">
                  ${trainer.hourlyRate}/hour
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-secondary-400" />
                <span className="text-sm text-secondary-300">
                  {trainer.languages.join(', ')}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-4 h-4 text-secondary-400" />
                <span className="text-sm text-secondary-300">
                  {trainer.teachingExperience} teaching experience
                </span>
              </div>
            </div>
          </motion.div>

          {/* Specializations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-secondary-100 mb-4">
              Specializations
            </h3>
            <div className="flex flex-wrap gap-2">
              {trainer.specializations.map((spec, index) => (
                <span key={index} className="badge badge-primary">
                  {spec}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-secondary-100 mb-4">
              Availability ({trainer.availability.timezone})
            </h3>
            <div className="space-y-2">
              {trainer.availability.schedule.map((day, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-secondary-300">{day.day}</span>
                  <span className="text-secondary-400">{day.hours}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Courses & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-secondary-100 mb-4">
              About
            </h3>
            <p className="text-secondary-300 leading-relaxed">
              {trainer.bio}
            </p>
          </motion.div>

          {/* Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-100">
                Courses
              </h3>
              <button className="text-sm text-primary-400 hover:text-primary-300">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {trainer.courses.map((course) => (
                <div key={course.id} className="border border-secondary-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-secondary-100 mb-1">
                        {course.title}
                      </h4>
                      <p className="text-sm text-secondary-400 mb-2">
                        {course.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-secondary-500">
                        <span>{course.duration}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          course.level === 'Beginner' ? 'bg-success-600/20 text-success-400' :
                          course.level === 'Intermediate' ? 'bg-warning-600/20 text-warning-400' :
                          'bg-error-600/20 text-error-400'
                        }`}>
                          {course.level}
                        </span>
                        <span>{course.students} students</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 text-accent-400 fill-current" />
                        <span className="text-sm text-secondary-300">
                          {course.rating}
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-secondary-100">
                        ${course.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-secondary-100 mb-4">
              Recent Reviews
            </h3>
            <div className="space-y-4">
              {trainer.recentReviews.map((review) => (
                <div key={review.id} className="border border-secondary-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-secondary-100">
                        {review.student}
                      </h4>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-accent-400 fill-current'
                                : 'text-secondary-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-secondary-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-300 mt-2">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
