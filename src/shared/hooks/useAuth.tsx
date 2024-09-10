import { useEffect } from 'react';
import { useUser, User } from './useUser';
import { useLocalStorage } from './useLocalStorage';
import { DecodedToken } from '../../entities/DecodedToken';
import { decodeToken } from 'react-jwt';


export const useAuth = () => {
  const { user, addUser, removeUser } = useUser();
  const { getItem } = useLocalStorage();

  useEffect(() => {
    const user = getItem('user');
    if (user) {
      addUser(JSON.parse(user));
    }
  }, []);

  const setUser = (user: User | null) => {
    if (user !== null) addUser(user);
    else removeUser();
  };

  const getUser = () => {
    const user = localStorage.getItem("user");
    if (user){
        const token = JSON.parse(user).token;
        const userStr: DecodedToken | null = decodeToken(token);
        return userStr;
    }
    return null;
  }

  return { user, setUser, getUser };
};