import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { env } from '../../environment/enviorenment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login(email: string, password: string) {
    return this.httpClient.post<any>(env.apiUrl + "/auth/login", { email, password });
  }

  register(name: string, cpf: string, email: string, password: string) {
    return this.httpClient.post<any>(env.apiUrl + "/auth/register", { name, cpf, email, password });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    const user = this.userFromToken(token);
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      console.log('Usuário salvo no localStorage:', user);
    } else {
      console.error('Não foi possível extrair usuário do token');
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLogged(): boolean {
    const token = this.getToken();
    return !!token && token.split('.').length === 3;
  }

  getUser(): Usuario | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }

  private userFromToken(token: string): Usuario | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Token JWT inválido: não contém 3 partes');
        return null;
      }

      const payload = parts[1];
      if (!payload) {
        console.error('Token não contém payload');
        return null;
      }

      const base64 = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      const decodedJson = atob(padded);
      const decoded = JSON.parse(decodedJson);

      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role ?? 'user'
      } as Usuario;

    } catch (e) {
      console.error('Erro ao decodificar token:', e);

      try {
        const parts = token.split('.');
        const payload = parts[1];
        console.log('Payload problemático:', payload);
        console.log('Tamanho do payload:', payload?.length);
      } catch (debugError) {
        console.error('Erro no debug:', debugError);
      }

      return null;
    }
  }

  getUserId(): string | null {
    const user = this.getUser();
    return user?.id || null;
  }

  getUserEmail(): string | null {
    const user = this.getUser();
    return user?.email || null;
  }

  getUserName(): string | null {
    const user = this.getUser();
    return user?.name || null;
  }

  redirect() {
    this.route.queryParams.subscribe(params => {
      const returnUrl = params['returnUrl'] || '/home';
      this.router.navigateByUrl(returnUrl);
    });
  }

}
