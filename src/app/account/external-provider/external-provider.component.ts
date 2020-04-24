import {Component, OnInit, OnDestroy} from '@angular/core';
import {ExternalProviderService} from './shared/external-provider.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../shared/auth.service';
import beautify from 'xml-beautifier';

import {User} from '../../models/user.model';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './external-provider.component.html',
  styleUrls: ['./external-provider.component.scss']
})
export class ExternalProviderComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  private user: User;
  private requests: any;
  public connectionPubSub = null;
  public payloadJson = null;
  public payloadXml = null;
  public payloadForm: FormGroup;
  public dataType = 1;

  constructor(
    public providerService: ExternalProviderService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = JSON.parse(atob(localStorage.getItem('user')));
    if (this.user) {
    }
    this.payloadForm = new FormGroup({
      payload: new FormControl(null, Validators.required),
      dataType: new FormControl(null, Validators.required),
    });

    this.connectionPubSub = `
      async function rabbitMQBootstrap() {
          const app = await NestFactory.createMicroservice(AppModule, {
          strategy: new RabbitMQServer(
            'amqp://kxsfcakg:jahgl20UG_mvcXK9f7keJpazfDSJtarc@prawn.rmq.cloudamqp.com/kxsfcakg'
          ),
        });
        await app.listen(() => {});
    }`;

    this.payloadJson = `
        [{
          "id": 1,
          "userId": ${this.user.id},
          "catalogId": 1,
          "price": 50000,
          "name": "Product 1",
          "description": "Product 1 description",
          "imageUrl": "https://www.psdmockups.com/wp-content/uploads/2017/08/Square-Corrugated-Cardboard-Shipping-Box-PSD-Mockup-520x392.jpg"
        }]`;

    this.payloadXml = beautify(`
      <?xml version="1.0" encoding="UTF-8"?>
      <Products>
        <Product>
          <id>1</id>
          <userId>${this.user.id}</userId>
          <catalogId>1</catalogId>
          <price>5000</price>
          <name>Product 1</name>
          <description>Product 1 description</heading>
          <imageUrl>https://www.psdmockups.com/wp-content/uploads/2017/08/Square-Corrugated-Cardboard-Shipping-Box-PSD-Mockup-520x392.jpg</imageUrl>
        </Product>
      </Products>`);
  }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe(
      user => {
        this.user = user;
        if (this.user) {

        }
      }
    );
  }

  async submit() {
    await this.providerService.savePayloadUrl(this.payloadForm.value.payload, this.dataType);
  }

  dataTypeEvent(type) {
    this.dataType = type;
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
