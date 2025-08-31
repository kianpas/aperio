import { useState, useEffect, useCallback } from "react";
import { authAPI } from "@/lib/api/auth";
import { accountAPI } from "@/lib/api/account";
import type { LoginData, User, AuthState } from "@/types/auth";

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  // 사용자 정보 로드 함수
  const loadUser = useCallback(async () => {
    try {
      const user = await accountAPI.getCurrentUser();
      console.log("useAuth - loadUser result:", user);
      console.log("useAuth - user type:", typeof user);
      console.log("useAuth - user keys:", user ? Object.keys(user) : 'null');
      
      setState({
        user,
        isAuthenticated: !!user,
        loading: false,
      });
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error);
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // 로그인
  const login = useCallback(async (credentials: LoginData): Promise<User> => {
    try {
      const user = await authAPI.login(credentials);
      setState({
        user,
        isAuthenticated: true,
        loading: false,
      });
      return user;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, []);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("로그아웃 요청 실패:", error);
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, []);

  // 사용자 정보 새로고침
  const refresh = useCallback(() => {
    setState(prev => ({ ...prev, loading: true }));
    return loadUser();
  }, [loadUser]);

  return {
    ...state,
    login,
    logout,
    refresh,
  };
};
