import {Injectable, OnInit} from '@angular/core';
import {MessageService} from '../../../messages/message.service';
import {config} from '../../../shared/config';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ExternalProviderService {
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {
  }

  async savePayloadUrl(payloadUrl: string) {
    const products = await this.http.get<any>(payloadUrl).toPromise();
    const formData = {products};

    this.http.post<any>(`${config.backUrl}product/createProducts`, formData).subscribe(response => {
        return response;
      },
      error => {
        this.messageService.addError(error.error.message);
        throw Error('Error');
      });
  }

}
