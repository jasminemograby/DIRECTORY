import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../../pages/Dashboard';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Test wrapper with router
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Dashboard Component', () => {
  it('renders without crashing', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('displays page header', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Overview of your corporate learning platform')).toBeInTheDocument();
    });
  });

  it('displays stats cards', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Employees')).toBeInTheDocument();
      expect(screen.getByText('Active Trainers')).toBeInTheDocument();
      expect(screen.getByText('Training Requests')).toBeInTheDocument();
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    });
  });

  it('displays stats values', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('1,234')).toBeInTheDocument(); // Total Employees
      expect(screen.getByText('89')).toBeInTheDocument(); // Active Trainers
      expect(screen.getByText('156')).toBeInTheDocument(); // Training Requests
      expect(screen.getByText('87%')).toBeInTheDocument(); // Completion Rate
    });
  });

  it('displays recent activities section', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Recent Activities')).toBeInTheDocument();
      expect(screen.getByText('New training request submitted')).toBeInTheDocument();
      expect(screen.getByText('Employee profile updated')).toBeInTheDocument();
    });
  });

  it('displays upcoming trainings section', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Upcoming Trainings')).toBeInTheDocument();
      expect(screen.getByText('React Advanced Patterns')).toBeInTheDocument();
      expect(screen.getByText('Data Science Fundamentals')).toBeInTheDocument();
    });
  });

  it('displays activity status indicators', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for status badges
      expect(screen.getByText('pending')).toBeInTheDocument();
      expect(screen.getByText('completed')).toBeInTheDocument();
    });
  });

  it('displays training status badges', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('confirmed')).toBeInTheDocument();
    });
  });

  it('displays trainer information', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Wilson')).toBeInTheDocument();
      expect(screen.getByText('Prof. Michael Brown')).toBeInTheDocument();
      expect(screen.getByText('Lisa Anderson')).toBeInTheDocument();
    });
  });

  it('displays participant counts', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('24 participants')).toBeInTheDocument();
      expect(screen.getByText('18 participants')).toBeInTheDocument();
      expect(screen.getByText('12 participants')).toBeInTheDocument();
    });
  });

  it('displays time information', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('2 hours ago')).toBeInTheDocument();
      expect(screen.getByText('4 hours ago')).toBeInTheDocument();
      expect(screen.getByText('6 hours ago')).toBeInTheDocument();
    });
  });

  it('displays change indicators', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/\+12%/)).toHaveLength(1);
      expect(screen.getAllByText(/\+5%/)).toHaveLength(1);
      expect(screen.getAllByText(/\+23%/)).toHaveLength(1);
      expect(screen.getAllByText(/\+3%/)).toHaveLength(1);
    });
  });

  it('applies correct CSS classes', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      const dashboardContainer = screen.getByText('Dashboard').closest('div');
      expect(dashboardContainer).toHaveClass('space-y-8');
    });
  });

  it('displays last updated timestamp', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });
  });
});
