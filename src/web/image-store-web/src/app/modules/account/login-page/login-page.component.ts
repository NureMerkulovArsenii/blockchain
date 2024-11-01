import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthModel, AuthResponseModel } from 'src/app/core/models/auth.model';
import { BaseResponseModel } from 'src/app/core/models/base-response';
import { AccountService } from 'src/app/core/services/account.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  loginForm!: FormGroup;
  hide = true;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private readonly toastr: ToastrService

  ) { }

  ngOnInit(): void {
    this.initForm();

  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  getErrorMessage(field: string) {
    const control = this.loginForm.get(field);
    if (control && control.errors) {
      if (control.hasError('required')) {
        return 'You must enter a value';
      } else if (control.hasError('email')) {
        return 'Not a valid email';
      }
    }
    return '';
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  login() {
    console.log('login form submitted');
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      const loginModel: AuthModel = { username, password }
      console.log(loginModel);

      this.accountService.login(loginModel).subscribe({
        next: (response: BaseResponseModel<AuthResponseModel>) => {
          if (response.isSuccess) {
            localStorage.setItem("username", username ?? "");
            localStorage.setItem("access_token", response.data?.accessToken ?? "");
            window.location.reload();
          } else{
            this.toastr.error(response.message ?? 'Error', 'Error');
          }
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error.error.error, 'Error');
        }
      });

    }
  }

  register() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      const loginModel: AuthModel = { username, password }

      this.accountService.register(loginModel).subscribe({
        next: (response: BaseResponseModel<AuthResponseModel>) => {
          if (response.isSuccess) {
            this.toastr.success('User registered successfully', 'Success');
          }
        },
        error: (error) => {
          this.toastr.error(error.error.error, 'Error');
        }
      });

    }
  }
}
