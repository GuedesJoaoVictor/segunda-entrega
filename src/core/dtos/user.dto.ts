export class UserDTO {
  id?: number;
  uuid?: string;
  cpf?: string;
  name?: string;
  email?: string;
  password?: string;
  userBanks?: any[]; //TODO create UserBankDTO
}
