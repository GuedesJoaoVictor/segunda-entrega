import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {env} from '../../environment/enviorenment';
import {Observable} from 'rxjs';
import {Aluno} from '../models/aluno';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  constructor(private httpClient: HttpClient) {
  }

  getAlunos() : Observable<Aluno[]> {
    return this.httpClient.get<any[]>(env.apiUrl + '/aluno');
  }

  create(aluno: Aluno) : Observable<Aluno> {
    return this.httpClient.post<Aluno>(env.apiUrl + '/aluno', aluno);
  }

  delete(id: number) : Observable<void> {
    return this.httpClient.delete<void>(env.apiUrl + `/aluno/${id}`);
  }

  update(aluno: Aluno) : Observable<Aluno> {
    return this.httpClient.put<Aluno>(env.apiUrl + `/aluno`, aluno);
  }
}
