// Test setup for frontend
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock fetch
global.fetch = jest.fn();

// Mock environment variables
process.env.VITE_API_URL = 'http://localhost:3001';
process.env.VITE_USE_MOCK = 'true';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  }),
  useParams: () => ({}),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
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
jest.mock('lucide-react', () => ({
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
jest.mock('react-hot-toast', () => ({
  Toaster: () => 'Toaster',
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});