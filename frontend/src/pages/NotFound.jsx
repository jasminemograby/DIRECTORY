import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-900">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 404 Illustration */}
          <div className="text-6xl font-bold text-primary-400">
            404
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-secondary-100">
              Page Not Found
            </h1>
            <p className="text-secondary-400 max-w-md mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Link to="/" className="btn-primary">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
