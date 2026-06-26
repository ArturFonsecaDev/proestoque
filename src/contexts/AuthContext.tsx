import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  type ReactNode,
} from 'react';

import { api, setApiToken, setUnauthorizedHandler } from '@/services/api';

export type User = {
  id: string;
  nome: string;
  email: string;
};

type AuthResponse = {
  usuario: User;
  token: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
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

  const clearSession = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(USER_STORAGE_KEY),
      AsyncStorage.removeItem(TOKEN_STORAGE_KEY),
    ]);

    setUser(null);
    setToken(null);
    setApiToken(null);
  }, []);

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
          setApiToken(storedToken);
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
    });

    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  async function persistSession(authResponse: AuthResponse) {
    await Promise.all([
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authResponse.usuario)),
      AsyncStorage.setItem(TOKEN_STORAGE_KEY, authResponse.token),
    ]);

    setUser(authResponse.usuario);
    setToken(authResponse.token);
    setApiToken(authResponse.token);
  }

  async function login(email: string, senha: string) {
    setIsLoading(true);

    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        senha,
      });

      await persistSession(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  async function registrar(nome: string, email: string, senha: string) {
    setIsLoading(true);

    try {
      const response = await api.post<AuthResponse>('/auth/registro', {
        nome,
        email,
        senha,
      });

      await persistSession(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);

    try {
      await clearSession();
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
      registrar,
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
