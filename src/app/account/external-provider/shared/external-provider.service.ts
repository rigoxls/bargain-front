import {Injectable, OnInit} from '@angular/core';
import {MessageService} from '../../../messages/message.service';
import {config} from '../../../shared/config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NgxXml2jsonService} from 'ngx-xml2json';

@Injectable()
export class ExternalProviderService {
  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    private ngxXml2jsonService: NgxXml2jsonService
  ) {
  }

  async savePayloadUrl(payloadUrl: string, type: number) {
    let products = [];
    if (type === 1) {
      products = await this.http.get<any>(payloadUrl, ).toPromise();
    } else {
      products = await this.getXMLPayload(payloadUrl);
    }
    const formData = {products};

    this.http.post<any>(`${config.backUrl}product/createProducts`, formData).subscribe(response => {
      this.messageService.add('Los productos o servicios fuerón registrados de manera satisfactoria!')
        return response;
      },
      error => {
        this.messageService.addError(error.error.message);
        throw Error('Error');
      });
  }

  async getXMLPayload(payloadUrl: string) {
    const result = await this.http.get(payloadUrl, {responseType: 'text'}).toPromise();
    const parser = new DOMParser();
    const xml = parser.parseFromString(result, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);

    return obj['Products'].Product.map(prod => {
      return {
        name: prod['@attributes'].name,
        description: prod['@attributes'].description,
        price: parseInt(prod['@attributes'].price, 10),
        idCatalogue: parseInt(prod['@attributes'].idCatalogue, 10),
        image: prod['@attributes'].image,
        userId: parseInt(prod['@attributes'].userId, 10),
      };
    });
  }
}
