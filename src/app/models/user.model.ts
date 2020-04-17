export interface Roles {
  admin: boolean;
}

export class User {
  public id: number;
  public email: string;
  public photoURL?: string;
  public roles?: Roles;
  public firstName?: string;
  public name?: string;
  public lastName?: string;
  public password?: string;
  public role: string;
  public orders?: object;
  public confirmPassword?: string;
  public uid?: string;

  constructor(authData) {
    this.email = authData.email;
    this.firstName = authData.firstName ? authData.firstName : '';
    this.lastName = authData.lastName ? authData.lastName : '';
    this.roles = {
      admin: false
    };
  }
}
