import React from 'react';
import { isExpired, decodeToken } from 'react-jwt';
import { Navigate, useLocation } from 'react-router-dom';

let AuthContext = React.createContext<any>(null);

export const AuthProvider = ({ children }: { children: any }) => {
  let [token, setToken] = React.useState(localStorage.getItem('token'));

  let signin = (token: string, callback: any) => {
    setToken(token);
    localStorage.setItem('token', token);
    callback();
  };

  let signout = (callback: any) => {
    setToken(null);
    localStorage.removeItem('token');
    callback();
  };

  let isAuthenticated = () => {
    return token != null && !isExpired(token);
  };

  let getDn = () => {
    if (isAuthenticated()) {
      //@ts-ignore
      return decodeToken(token)['dn'];
    }
    return '';
  };

  let value = { token, signin, signout, isAuthenticated, getDn };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export function RequireAuth({ children }: { children: any }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.token || isExpired(auth.token)) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
