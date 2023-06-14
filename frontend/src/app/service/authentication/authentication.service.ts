import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

interface AuthenticationBean {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private BASE_URL: string = 'http://localhost:8080/api';
  private TOKEN_PREFIX: string = 'Bearer ';
  private AUTH_USER_KEY: string = 'authenticatedUser';
  private TOKEN_KEY = 'token';
  private ROLE_KEY = 'role';
  private AVATAR_KEY = 'avatar';

  constructor(private http: HttpClient) {}

  signup(userRegistration: any) {
    return this.http
      .post<any>(`${this.BASE_URL}/signup`, userRegistration)
      .pipe(
        map((data) => {
          console.log(data);
          let token = this.TOKEN_PREFIX + data.token;
          this.setSessionStorage(data.email, token, data.avatarUrl, data.roles);
          return data;
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${this.BASE_URL}/login`, { email, password })
      .pipe(
        map((data) => {
          let token = this.TOKEN_PREFIX + data.token;
          this.setSessionStorage(data.email, token, data.avatarUrl, data.roles);
          return data;
        })
      );
  }

  getAuthenticatedUser(): string {
    return sessionStorage.getItem(this.AUTH_USER_KEY);
  }

  isUserLoggedIn(): boolean {
    let user = sessionStorage.getItem(this.AUTH_USER_KEY);
    return user !== null;
  }

  getAuthenticationToken(): string {
    if (this.getAuthenticatedUser() && this.isUserLoggedIn()) {
      return sessionStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getProfileAvatar(): string {
    const avatar = sessionStorage.getItem(this.AVATAR_KEY);
    if (this.getAuthenticatedUser() && this.isUserLoggedIn() && avatar != "null") {
      return sessionStorage.getItem(this.AVATAR_KEY);
    }
    return null;
  }

  logout() {
    this.removeSessionStorage();
  }

  getUserRoles() {
    return sessionStorage.getItem(this.ROLE_KEY)?.split(',');
  }

  checkRole(role: string): boolean {
    return this.getUserRoles()?.includes(role) ?? false;
  }

  isAdmin(): boolean {
    return this.checkRole('ROLE_ADMIN');
  }

  isUser(): boolean {
    return this.checkRole('ROLE_USER');
  }

  private setSessionStorage(
    email: string,
    token: string,
    avatarUrl: string,
    roles: string
  ) {
    sessionStorage.setItem(this.AUTH_USER_KEY, email);
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.ROLE_KEY, roles);
    sessionStorage.setItem(this.AVATAR_KEY, avatarUrl);
  }

  private removeSessionStorage() {
    sessionStorage.removeItem(this.AUTH_USER_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.ROLE_KEY);
    sessionStorage.removeItem(this.AVATAR_KEY);
  }
}
