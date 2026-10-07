import * as Keychain from 'react-native-keychain';
import { create } from 'zustand';

import { AuthApi } from '@/api/auth';
import { UserApi } from '@/api/user';

// react-native-keychain persists one username/password-shaped credential
// per service — use two services so access/refresh tokens don't collide.
const TOKEN_SERVICE = 'pmbc_mobile_v2.access_token';
const REFRESH_SERVICE = 'pmbc_mobile_v2.refresh_token';

const saveSecret = async (service: string, value: string) =>
  Keychain.setGenericPassword('token', value, { service });

const readSecret = async (service: string): Promise<string | null> => {
  const result = await Keychain.getGenericPassword({ service });
  return result ? result.password : null;
};

const clearSecret = async (service: string) =>
  Keychain.resetGenericPassword({ service });

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: unknown | null;
  userId: number | null;
  isLoading: boolean;
  isBootstrapping: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

// Mirrors pmbc_web's FeaturesResolve → `localStorage.setItem('userId', ...)`
// flow: fetch `/user/detail` once a token exists and cache the id, since
// the chatbot conversation search/star/pin endpoints all require it as a
// query param. Swallows errors — a failed fetch just leaves userId null,
// which the conversation-list features treat as "not loaded yet".
const loadUserId = async (set: (partial: Partial<AuthState>) => void) => {
  try {
    const detail = await UserApi.getDetail();
    set({ user: detail, userId: detail?.userId ?? null });
  } catch {
    set({ userId: null });
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  user: null,
  userId: null,
  isLoading: false,
  isBootstrapping: true,
  error: null,

  // Loads a persisted session on app start, same responsibility project B
  // leaves commented out in App.tsx (`checkAuth`) — implemented here so
  // returning users don't have to log in again on every cold start.
  bootstrap: async () => {
    try {
      const [token, refreshToken] = await Promise.all([
        readSecret(TOKEN_SERVICE),
        readSecret(REFRESH_SERVICE),
      ]);
      set({ token, refreshToken });
      if (token) await loadUserId(set);
    } finally {
      set({ isBootstrapping: false });
    }
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { access_token, refresh_token } = await AuthApi.login({
        username,
        password,
      });
      await Promise.all([
        saveSecret(TOKEN_SERVICE, access_token),
        saveSecret(REFRESH_SERVICE, refresh_token),
      ]);

      set({
        token: access_token,
        refreshToken: refresh_token,
        isLoading: false,
      });
      await loadUserId(set);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        'Không thể kết nối đến máy chủ, vui lòng kiểm tra lại.';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Calls the real backend logout (best-effort — matches web's fire-and-log
  // behavior) but always clears local session state afterward regardless of
  // the API result, so the user can never get stuck logged in on mobile.
  logout: async () => {
    const token = get().token;
    if (token) {
      try {
        await AuthApi.logout(token);
      } catch {
        // ignore — local session is cleared below either way
      }
    }
    await Promise.all([
      clearSecret(TOKEN_SERVICE),
      clearSecret(REFRESH_SERVICE),
    ]);
    set({ token: null, refreshToken: null, user: null, userId: null });
  },
}));
