export type UserAccountStatus = "active" | "blocked";

export interface ApiUser {
  _id: string;
  name: string;
  role: string;
  email: string;
  image: string;
  status: UserAccountStatus;
  verified: boolean;
  interest: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: UserAccountStatus | "";
}

export interface UsersListResponse {
  success: boolean;
  message: string;
  pagination: PaginationMeta;
  data: ApiUser[];
}

export interface ChangeUserStatusPayload {
  status: UserAccountStatus;
}

export interface UserMutationResponse {
  success: boolean;
  message: string;
  data?: ApiUser;
}

export const USER_STATUS_OPTIONS: UserAccountStatus[] = ["active", "blocked"];
