import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type User = {
  id: string;
  nome: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const USER_STORAGE_KEY = '@ProEstoque:user';
const TOKEN_STORAGE_KEY = '@ProEstoque:token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem(USER_STORAGE_KEY),
          AsyncStorage.getItem(TOKEN_STORAGE_KEY),
        ]);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser) as User);
          setToken(storedToken);
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(email: string, senha: string) {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const normalizedEmail = email.trim() || 'artur@email.com';
      const loggedUser: User = {
        id: '1',
        nome: 'Artur Fonsek',
        email: normalizedEmail,
      };
      const authToken = `mock-token-${Date.now()}`;

      await Promise.all([
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser)),
        AsyncStorage.setItem(TOKEN_STORAGE_KEY, authToken),
      ]);

      setUser(loggedUser);
      setToken(authToken);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);

    try {
      await Promise.all([
        AsyncStorage.removeItem(USER_STORAGE_KEY),
        AsyncStorage.removeItem(TOKEN_STORAGE_KEY),
      ]);

      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
