import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService
  ) {
    this.registerForm = this.fb.group({
      Username: ['', Validators.required],
      UserEmail: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  register() {
    if (this.registerForm.valid) {
      console.log('Form Values:', this.registerForm.value);
      this.registerService.register(this.registerForm.value).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);
          // Handle successful registration (e.g., redirect to login page)
        },
        (error) => {
          console.error('Registration error:', error);
          // Handle registration errors (e.g., display error messages)
        }
      );
      // Implement your registration logic using the form values (e.g., call a backend service)
    } else {
      console.log('Form is invalid');
      // Handle form validation errors (optional)
    }
  }

  getErrorMessage(fieldName: string) {
    const field = this.registerForm.get(fieldName);
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
