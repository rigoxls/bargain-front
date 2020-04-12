import {Component, OnInit, ViewChild, OnChanges} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators
} from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {MessageService} from '../../messages/message.service';
import {AuthService} from '../shared/auth.service';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.scss']
})
export class RegisterLoginComponent implements OnInit {
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public registerErrors: string;
  private userType = null;

  constructor(
    private authenticationService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.initLoginForm();
    this.initRegisterForm();
  }

  private initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required)
    });
  }

  private initRegisterForm() {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      userType: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      business_Name: new FormControl(null, Validators.required),
      nit: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      representative: new FormControl(null, Validators.required),


      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required)
    });
  }

  public onRegister() {
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.registerErrors = 'Passwords don\'t match!';
      this.registerForm.controls.password.setErrors({password: true});
      this.registerForm.controls.confirmPassword.setErrors({confirmPassword: true});
    } else {
      this.authenticationService.emailSignUp(this.registerForm.value);
      this.registerForm.reset();
    }
  }

  async onLogin() {
    const loginData = await this.authenticationService.emailLogin(this.loginForm.value.email, this.loginForm.value.password);
    this.router.navigate(['/provider/add']);
  }

  userTypeEvent(type) {
    this.userType = type;
    if (type === 1) {
      this.registerForm.controls['business_Name'].setValue('null');
      this.registerForm.controls['nit'].setValue('null');
      this.registerForm.controls['representative'].setValue('null');

      this.registerForm.controls['name'].setValue('');
      this.registerForm.controls['lastName'].setValue('');
    } else {
      this.registerForm.controls['name'].setValue('null');
      this.registerForm.controls['lastName'].setValue('null');

      this.registerForm.controls['business_Name'].setValue('');
      this.registerForm.controls['nit'].setValue('');
      this.registerForm.controls['representative'].setValue('');
    }
  }
}
