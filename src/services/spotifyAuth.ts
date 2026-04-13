export const spotifyAuth = {
  redirectToLogin(): void {
    window.location.href = '/auth/login';
  },

  async getAccessToken(): Promise<string | null> {
    try {
      const response = await fetch('/api/spotify/token');
      if (!response.ok) return null;
      const data = await response.json();
      return data.accessToken ?? null;
    } catch {
      return null;
    }
  },
};
