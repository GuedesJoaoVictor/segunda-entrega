import { BankDTO } from "./bank.dto";
import { Usuario } from "./usuario.dto";

export class UserBankDTO {
  id?: number;
  name?: string;
  totalAmount?: number;
  bankId?: number;
  bank?: BankDTO;
  user?: Usuario;
}
