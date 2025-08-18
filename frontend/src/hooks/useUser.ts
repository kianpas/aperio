import { useState, useEffect, useCallback } from 'react';
import { userAPI, UserProfile } from '@/lib/api';

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const useUser = () => {
  const [userState, setUserState] = useState<UserState>({
    profile: null,
    loading: true,
    error: null,
  });

  const fetchProfile = useCallback(async () => {
    setUserState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const profileData = await userAPI.getUserProfile();
      setUserState({
        profile: profileData,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error(err);
      setUserState({
        profile: null,
        loading: false,
        error: '프로필 정보를 불러오는 데 실패했습니다.',
      });
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    ...userState,
    refetchProfile: fetchProfile,
  };
};