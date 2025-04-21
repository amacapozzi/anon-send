export interface User {
  id: string;
  alias: string;
  avatarUrl?: string;
  publicProfile: boolean;
  createdAt: Date;
}
