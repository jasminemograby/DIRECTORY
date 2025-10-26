// Test setup for frontend
import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock fetch
globalThis.fetch = vi.fn();

// Mock environment variables
globalThis.process = {
  env: {
    VITE_API_URL: 'http://localhost:3001',
    VITE_USE_MOCK: 'true'
  }
};

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  }),
  useParams: () => ({}),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Users: () => 'Users',
  GraduationCap: () => 'GraduationCap',
  FileText: () => 'FileText',
  BarChart3: () => 'BarChart3',
  Settings: () => 'Settings',
  X: () => 'X',
  Building2: () => 'Building2',
  Menu: () => 'Menu',
  Bell: () => 'Bell',
  Search: () => 'Search',
  User: () => 'User',
  TrendingUp: () => 'TrendingUp',
  Clock: () => 'Clock',
  CheckCircle: () => 'CheckCircle',
  AlertCircle: () => 'AlertCircle',
  Mail: () => 'Mail',
  Phone: () => 'Phone',
  MapPin: () => 'MapPin',
  Calendar: () => 'Calendar',
  Award: () => 'Award',
  BookOpen: () => 'BookOpen',
  Edit: () => 'Edit',
  Star: () => 'Star',
  Plus: () => 'Plus',
  Filter: () => 'Filter',
  DollarSign: () => 'DollarSign',
  Globe: () => 'Globe',
  MessageCircle: () => 'MessageCircle',
  Home: () => 'Home',
  ArrowLeft: () => 'ArrowLeft',
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  Toaster: () => 'Toaster',
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// Mock axios
vi.mock('axios', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  create: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Global test timeout
vi.setConfig({ testTimeout: 10000 });

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});