import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { EmployeeProfile } from './pages/EmployeeProfile';
import { TrainerProfile } from './pages/TrainerProfile';
import { TrainingRequests } from './pages/TrainingRequests';
import { Analytics } from './pages/Analytics';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen bg-secondary-900">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees/:id" element={<EmployeeProfile />} />
          <Route path="/trainers/:id" element={<TrainerProfile />} />
          <Route path="/training-requests" element={<TrainingRequests />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
