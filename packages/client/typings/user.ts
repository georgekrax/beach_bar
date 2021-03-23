export type LoginFormData = {
  email: string;
  password: string;
};

export type SignUpFormData = LoginFormData & {
  confirmPassword: string;
};

export const OAuthProviders = ["Google", "Facebook", "Instagram"] as const;
export type OAuthProvider = typeof OAuthProviders[number];
