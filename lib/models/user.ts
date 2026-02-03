export default interface User {
  id: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
}
