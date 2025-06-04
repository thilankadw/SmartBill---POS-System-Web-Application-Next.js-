interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  login: (userData: { uid: string; email: string; username: string; token: string }) => void;
  logout: () => void;
  updateToken: (token: string) => void;
}