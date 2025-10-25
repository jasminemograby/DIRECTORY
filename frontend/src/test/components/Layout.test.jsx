import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../../components/Layout';

// Mock child component
const MockChild = () => <div data-testid="child-content">Child Content</div>;

// Test wrapper with router
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Layout Component', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <Layout>
          <MockChild />
        </Layout>
      </TestWrapper>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders sidebar and header', () => {
    render(
      <TestWrapper>
        <Layout>
          <MockChild />
        </Layout>
      </TestWrapper>
    );

    // Check if sidebar is present (should be hidden on mobile by default)
    const sidebar = screen.getByRole('navigation', { hidden: true });
    expect(sidebar).toBeInTheDocument();

    // Check if header is present
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('opens sidebar when menu button is clicked', () => {
    render(
      <TestWrapper>
        <Layout>
          <MockChild />
        </Layout>
      </TestWrapper>
    );

    // Find and click the menu button
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    // Sidebar should now be visible
    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toHaveClass('translate-x-0');
  });

  it('closes sidebar when close button is clicked', () => {
    render(
      <TestWrapper>
        <Layout>
          <MockChild />
        </Layout>
      </TestWrapper>
    );

    // Open sidebar first
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Sidebar should be hidden again
    const sidebar = screen.getByRole('navigation', { hidden: true });
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('closes sidebar when backdrop is clicked', () => {
    render(
      <TestWrapper>
        <Layout>
          <MockChild />
        </Layout>
      </TestWrapper>
    );

    // Open sidebar first
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    // Find and click the backdrop
    const backdrop = screen.getByRole('button', { name: '' }); // Backdrop has no accessible name
    fireEvent.click(backdrop);

    // Sidebar should be hidden again
    const sidebar = screen.getByRole('navigation', { hidden: true });
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('renders main content area', () => {
    render(
      <TestWrapper>
        <Layout>
          <MockChild />
        </Layout>
      </TestWrapper>
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-1', 'overflow-y-auto', 'bg-secondary-900');
  });

  it('applies correct CSS classes', () => {
    render(
      <TestWrapper>
        <Layout>
          <MockChild />
        </Layout>
      </TestWrapper>
    );

    const layoutContainer = screen.getByRole('main').parentElement;
    expect(layoutContainer).toHaveClass('flex', 'h-screen', 'bg-secondary-900');
  });
});
