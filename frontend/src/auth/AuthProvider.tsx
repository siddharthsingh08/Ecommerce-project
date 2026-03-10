import { createContext, useContext, useEffect, useState, useRef } from "react";
import keycloak from "./keycloak";
import LoadingScreen from "../components/LoadingScreen";

interface AuthContextType {
  isAuthenticated: boolean;
  token?: string;
  login: () => void;
  logout: () => void;
  roles: string[];
  tenant?: string;
  userName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | undefined>();
  const [userName, setUserName] = useState<string | undefined>();
  const initialized = useRef(false);
  const [tenant, setTenant] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    keycloak
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setToken(keycloak.token);

        setRoles((keycloak.tokenParsed as any)?.realm_access?.roles ?? []);

        setTenant((keycloak.tokenParsed as any)?.tenant);

        setUserName(keycloak.tokenParsed?.preferred_username);

        setLoading(false); 
      });

    setInterval(() => {
      keycloak.updateToken(60).catch(() => {
        keycloak.logout();
      });
    }, 60000);
  }, []);

  const login = () => keycloak.login();

  const logout = () => keycloak.logout();

  if(loading)
  {
    return ( <LoadingScreen />);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        login,
        logout,
        roles,
        tenant,
        userName,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
