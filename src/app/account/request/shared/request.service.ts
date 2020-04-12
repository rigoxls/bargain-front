import {Injectable, OnInit} from '@angular/core';
import {MessageService} from '../../../messages/message.service';
import {config} from '../../../shared/config';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class RequestService {
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {
  }

  public async getRequests(userId: number) {
    const requests = await this.http.get<any>(`${config.backUrl}request/requests/${userId}`).toPromise();

    return requests.map(request => {
      return {
        id: request.Id,
        status: request.Status,
        date: request.Creation_Date
      };
    });
  }
}
