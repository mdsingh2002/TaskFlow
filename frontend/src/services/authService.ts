/**
 * Authentication service for login, logout, and user management.
 */

import api from "./api";
import { LoginCredentials, TokenResponse, User } from "../types/auth";

const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/auth/login", credentials);
    const { access_token, refresh_token } = response.data;

    // Store tokens in localStorage
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);

    return response.data;
  },

  /**
   * Logout and clear tokens
   */
  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post<{ access_token: string }>("/auth/refresh", {
      refresh_token: refreshToken,
    });

    const { access_token } = response.data;
    localStorage.setItem("access_token", access_token);

    return access_token;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  },

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  },
};

export default authService;
