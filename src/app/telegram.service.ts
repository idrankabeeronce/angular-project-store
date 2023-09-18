import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  private api_token: string = '';
  private chat_id: string = '-1001968649978';
  public url: string = 'http://api.telegram.org/bot';
  public method: string = 'sendMessage?';

  constructor() { }

  public api(type:string, method:string, body?:any) {
    return new Promise((resolve, reject) => {
      fetch(this.url + this.api_token + type, {
        method: method,
        body: body
      }).then(res => {
        resolve(res.json())
      }).catch(err => {
        reject(err)
      })
    })
  }

  public async sendMessage(messageText:string, chat_id?:string) {
    try {
      const result = await this.api(`/sendMessage?text=${messageText}&chat_id=${chat_id ? chat_id : this.chat_id}&parse_mode=html`, 'GET')
      return await result
    } catch(e) {
      return await e
    }
  }
}
