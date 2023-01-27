import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { User } from './_models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private openProfile = new BehaviorSubject <boolean>(false);

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(
      localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public getProfileOpen():Observable<boolean> {
    return this.openProfile.asObservable()
  }
  public setProfileOpen(value: boolean) {
    return this.openProfile.next(value)
  }
  
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`/authenticate`, { username, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isLoginSubject.next(true);
        return user;
      }));
      
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null as any);
    this.isLoginSubject.next(false);
  }

  public hasToken() {
    return !!localStorage.getItem('token');
  }
}
