import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor() { }

  /**
   * Fake proccessing
   * @returns Promise
   */
  delay() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }

  /**
   * toDo: create REST API resource
   * @param data
   * @returns Promise
   */
  async sendEmail(data: any) {

    await this.delay();

    const response = await fetch('/api/sendMail/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    })
    return response;
  }
}
