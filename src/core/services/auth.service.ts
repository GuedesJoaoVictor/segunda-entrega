import { env } from './../../enviroment/enviroment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserDTO } from '../dtos/user.dto';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) {}

  login(email: string, password: string) {
    return this.httpClient.post(`${env.apiUrl}/auth/login`, { email, password });
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
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  getUser(): UserDTO | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserDTO;
    } catch(e) {
      return null;
    }
  }

  private userFromToken(token: string): UserDTO | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const decodedPayload = JSON.parse(atob(payload));
      console.log('Decoded Payload:', decodedPayload);
      return {
        id: decodedPayload.sub ?? undefined,
        email: decodedPayload.email ?? undefined,
        name: decodedPayload.name ?? undefined
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  redirect() {
    this.route.queryParams.subscribe(params => {
      const returnUrl = params['returnUrl'] || '/';
      this.router.navigateByUrl(returnUrl);
    });
  }

}
