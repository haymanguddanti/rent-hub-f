import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (localStorage.getItem('user')) this.router.navigate(['/home']);
  }

  checkLogin() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.loginService.login(email, password).subscribe(
        (user) => {
          if (user) {
            console.log('Login successful!', user);
            localStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(['/home']);
          } else {
            console.log('Invalid email and password');
            this.errorMessage = 'Invalid email or password';
          }
        },
        (error) => {
          this.errorMessage = 'An error occurred: ' + error;
          console.error('Login error:', error);
        }
      );
    } else {
      console.error('Login form is invalid');
    }
  }

  getErrorMessage(fieldName: string) {
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required.';
    } else if (field?.hasError('email')) {
      return 'Invalid email format.';
    } else if (field?.hasError('minlength')) {
      const requiredLength = field?.getError('minlength').requiredLength;
      return `Minimum length is ${requiredLength} characters.`;
    }
    return '';
  }
}
