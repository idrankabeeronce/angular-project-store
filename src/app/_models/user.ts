export class User {
    id!: number;
    username!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
    shippingInformation: any;
    paymentInformation: any;
    token?: string;
  }