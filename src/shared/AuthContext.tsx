import { createContext } from 'react';
import { DecodedToken } from '../entities/DecodedToken';
import { User } from './hooks/useUser';

export interface AuthContext {
  user: User | null;
  setUser: (user: User | null) => void;
  getUser: () => DecodedToken | null;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {},
  getUser: () => null,
});