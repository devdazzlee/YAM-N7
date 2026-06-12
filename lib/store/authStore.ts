import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Customer } from '../api/authApi';
import { authApi } from '../api/authApi';

interface AuthState {
  user: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name?: string; phone_number?: string; mobile_number?: string; address?: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  updateUser: (data: Partial<Customer>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await authApi.login(email, password);
          
          // Store token in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', response.token);
          }
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true });
          const response = await authApi.register(data);
          
          // After registration, login automatically
          if (response.customer && data.password) {
            const loginResponse = await authApi.login(data.email, data.password);
            
            // Store token in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('authToken', loginResponse.token);
            }
            
            set({
              user: loginResponse.user,
              token: loginResponse.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: response.customer,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          const token = get().token;
          if (token) {
            await authApi.logout();
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear token from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
          }
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      fetchCurrentUser: async () => {
        try {
          set({ isLoading: true });
          const user = await authApi.getCurrentCustomer();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // If fetching user fails, clear auth state
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
          }
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateUser: async (data) => {
        try {
          set({ isLoading: true });
          const updatedUser = await authApi.updateCustomer(data);
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

