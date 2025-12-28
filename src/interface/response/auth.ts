export interface IProfileResponse {
  statusCode?: number;
  message?: string;
  data?: {
    accessToken?: string;
    user?: {
      email: string;
      role: string;
      name: string;
    };
  };
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      email: string;
      role: string;
      name: string;
    };
  };
}
