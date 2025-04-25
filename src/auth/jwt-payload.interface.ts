export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  ait: number //ait = 2 for login
}             //ait = 1 for reset password
