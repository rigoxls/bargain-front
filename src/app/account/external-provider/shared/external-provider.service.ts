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


}
