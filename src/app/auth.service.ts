import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isLoggedIn() {
    console.log(JSON.parse(localStorage.getItem('user') ?? '{}'));
    if (localStorage.getItem('user')) return true;
    return false;
  }
}
