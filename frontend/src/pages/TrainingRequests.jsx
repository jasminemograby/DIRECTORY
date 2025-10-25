import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  BookOpen
} from 'lucide-react';

export function TrainingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests([
        {
          id: 1,
          employee: 'Sarah Johnson',
          employeeId: 'EMP001',
          course: 'Advanced React Development',
          trainer: 'Dr. Mike Chen',
          department: 'Engineering',
          requestDate: '2024-01-10',
          startDate: '2024-02-01',
          endDate: '2024-02-15',
          cost: 1200,
          status: 'pending',
          priority: 'high',
          justification: 'Need to upgrade skills for upcoming project requirements',
          approvedBy: null,
          approvedDate: null,
        },
        {
          id: 2,
          employee: 'Alex Thompson',
          employeeId: 'EMP002',
          course: 'Project Management Fundamentals',
          trainer: 'Lisa Anderson',
          department: 'Product',
          requestDate: '2024-01-08',
          startDate: '2024-01-20',
          endDate: '2024-01-25',
          cost: 800,
          status: 'approved',
          priority: 'medium',
          justification: 'Required for new role as team lead',
          approvedBy: 'John Smith',
          approvedDate: '2024-01-09',
        },
        {
          id: 3,
          employee: 'Maria Garcia',
          employeeId: 'EMP003',
          course: 'Data Science with Python',
          trainer: 'Dr. Sarah Wilson',
          department: 'Analytics',
          requestDate: '2024-01-05',
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          cost: 1500,
          status: 'rejected',
          priority: 'low',
          justification: 'Personal development interest',
          approvedBy: 'Jane Doe',
          approvedDate: '2024-01-07',
        },
        {
          id: 4,
          employee: 'David Lee',
          employeeId: 'EMP004',
          course: 'AWS Cloud Architecture',
          trainer: 'Prof. Michael Brown',
          department: 'Engineering',
          requestDate: '2024-01-12',
          startDate: '2024-02-10',
          endDate: '2024-02-24',
          cost: 1800,
          status: 'pending',
          priority: 'high',
          justification: 'Critical for cloud migration project',
          approvedBy: null,
          approvedDate: null,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-success-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-error-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-warning-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-secondary-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'badge-error';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-100">
            Training Requests
          </h1>
          <p className="text-secondary-400 mt-2">
            Manage and approve employee training requests
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-secondary-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover-lift"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {getStatusIcon(request.status)}
                  <h3 className="text-lg font-semibold text-secondary-100">
                    {request.course}
                  </h3>
                  <span className={`badge ${getStatusBadge(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`badge ${getPriorityBadge(request.priority)}`}>
                    {request.priority} priority
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-secondary-400" />
                    <div>
                      <p className="text-sm text-secondary-400">Employee</p>
                      <p className="text-sm font-medium text-secondary-100">
                        {request.employee}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-secondary-400" />
                    <div>
                      <p className="text-sm text-secondary-400">Trainer</p>
                      <p className="text-sm font-medium text-secondary-100">
                        {request.trainer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-secondary-400" />
                    <div>
                      <p className="text-sm text-secondary-400">Duration</p>
                      <p className="text-sm font-medium text-secondary-100">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-secondary-400" />
                    <div>
                      <p className="text-sm text-secondary-400">Cost</p>
                      <p className="text-sm font-medium text-secondary-100">
                        ${request.cost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-secondary-400 mb-1">Justification</p>
                  <p className="text-sm text-secondary-300">
                    {request.justification}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-secondary-500">
                  <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
                  <span>Department: {request.department}</span>
                  {request.approvedBy && (
                    <span>Approved by: {request.approvedBy} on {new Date(request.approvedDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 ml-4">
                {request.status === 'pending' && (
                  <>
                    <button className="btn-primary text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                    <button className="btn-danger text-sm">
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </>
                )}
                <button className="btn-secondary text-sm">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-400">No training requests found</p>
        </div>
      )}
    </div>
  );
}
