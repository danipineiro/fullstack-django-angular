import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest } from './auth.model';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.host}api/v1/auth`;

  loggedChanged$ = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private socialAuthService: SocialAuthService,
  ) {}

  login(loginDTO: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, loginDTO);
  }

  loginWithGoogle(id_token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google/`, { id_token });
  }

  register(registerDTO: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration/`, registerDTO);
  }

  logout() {
    this.socialAuthService.signOut().catch(() => {});

    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('currentUser');
    this.loggedChanged$.emit(false);
  }

  refreshToken(): Observable<string> {
    const body = {
      refresh: localStorage.getItem('refresh'),
    };

    return this.http.post<{ access: string }>(`${this.apiUrl}/token/refresh/`, body).pipe(
      tap((response) => {
        this.setAccessToken(response.access);
      }),
      map((response) => response.access),
    );
  }

  getAccessToken() {
    return localStorage.getItem('access');
  }

  setAccessToken(token: string) {
    localStorage.setItem('access', token);
    this.loggedChanged$.emit(true);
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refresh', token);
  }

  isLogged() {
    return !!localStorage.getItem('access');
  }

  verifyEmail(key: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration/verify-email/`, { key });
  }

  passwordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password/reset/`, { email });
  }

  passwordResetConfirm(
    uid: string,
    token: string,
    newPassword1: string,
    newPassword2: string,
  ): Observable<any> {
    console.log(uid, token, newPassword1, newPassword2);

    return this.http.post(`${this.apiUrl}/password/reset/confirm/`, {
      uid: uid,
      token: token,
      new_password1: newPassword1,
      new_password2: newPassword2,
    });
  }

  changePassword(oldPassword: string, newPassword1: string, newPassword2: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password/change/`, {
      old_password: oldPassword,
      new_password1: newPassword1,
      new_password2: newPassword2,
    });
  }
}
