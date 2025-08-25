import { useState, useEffect } from "react";
import { authAPI } from "@/lib/api/auth";
import { LoginData, User, LoginResponse } from "@/types/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  // 초기 사용자 정보 로드
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        if (userData.authenticated && userData.user) {
          setAuthState({
            user: userData.user,
            loading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.log(error);
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    loadUser();
  }, []);

  const login = async (
    credentials: LoginData
  ): Promise<{ success: boolean; user?: User }> => {
    try {
      // 백엔드에서 LoginUserResponse 직접 반환
      const result: LoginResponse = await authAPI.login(credentials);

      console.log("useAuth-login-result => ", result);

      const user: User = {
        email: result.email,
        name: result.name,
      };

      console.log("useAuth-login-user => ", user);

      setAuthState({
        user,
        loading: false,
        isAuthenticated: true,
      });

      console.log("useAuth-login-authstate => ", authState);

      return { success: true, user };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
      });
    }
  };

  const refetch = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      const userData = await authAPI.getCurrentUser();
      if (userData.authenticated && userData.user) {
        setAuthState({
          user: userData.user,
          loading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    } catch {
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
      });
    }
  };

  return {
    ...authState,
    login,
    logout,
    refetch,
  };
};
