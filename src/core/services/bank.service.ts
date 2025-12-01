import { ResponseDTO } from './../models/response.dto';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BankDTO } from "../models/bank.dto";
import { HttpClient } from "@angular/common/http";
import { env } from '../../environment/enviorenment';
import { UserBankDTO } from '../models/user-bank.dto';

@Injectable({
  providedIn: 'root',
})

export class BankService {

  private baseURL = `${env.apiUrl}/bank`;
  constructor(private http: HttpClient) {}

  findAll(): Observable<ResponseDTO<BankDTO[]>> {
    return this.http.get<ResponseDTO<BankDTO[]>>(`${this.baseURL}/find-all`);
  }

  findAllVinculosByUserUuid(uuid: string): Observable<BankDTO[]> {
    return this.http.get<BankDTO[]>(`${this.baseURL}/find-all/vinculos/by/user/${uuid}`);
  }

  create(bank: BankDTO): Observable<BankDTO> {
    return this.http.post<BankDTO>(`${this.baseURL}`, bank);
  }

  update(id: number, bank: BankDTO): Observable<BankDTO> {
    return this.http.patch<BankDTO>(`${this.baseURL}/update-by-id/${id}`, bank);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/delete-by-id/${id}`);
  }

  vincularBanco(uuid: string, userBankDTO: UserBankDTO): Observable<any> {
    return this.http.post(env.apiUrl + `/bank/vinculate/by/user/${uuid}`, userBankDTO);
  }

  desvincularBanco(userBankId: number): Observable<any> {
    return this.http.delete(env.apiUrl + `/bank/delete/user-bank/by/${userBankId}`);
  }

}
