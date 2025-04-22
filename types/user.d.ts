export interface User {
  id: string;
  alias: string;
  password: string;
  publicProfile: boolean;
  createdAt: Date;
  avatarUrl?: string | null;
}
