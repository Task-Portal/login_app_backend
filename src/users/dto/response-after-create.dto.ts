export class RespondAfterCreateUserDto {
  userToken: string;
  userInfo: {
    username: string;
    email: string;
  };
}
