import {combineLatest as observableCombineLatest, Observable, from as fromPromise, of} from 'rxjs';
import {Injectable} from '@angular/core';

import {catchError, tap, switchMap, map} from 'rxjs/operators';

import {HttpClient} from '@angular/common/http';

import {AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from '../../account/shared/auth.service';
import {FileUploadService} from './file-upload.service';
import {MessageService} from '../../messages/message.service';

import {Product} from '../../models/product.model';
import {ProductsUrl} from './productsUrl';
import {config} from '../../shared/config';

@Injectable()
export class ProductService {
  private productsUrl = ProductsUrl.productsUrl;
  private user = null;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private angularFireDatabase: AngularFireDatabase,
    public authService: AuthService,
    private uploadService: FileUploadService,
  ) {
    try {
      this.user = JSON.parse(atob(localStorage.getItem('user')));
    } catch (e) {
      console.info('No User');
    }
  }

  /** Log a ProductService message with the MessageService */
  private log(message: string) {
    this.messageService.add('ProductService: ' + message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  async getProduct(id: any): Promise<any> {
    const product = await this.http.get<any>(`${config.backUrl}product/${id}`).toPromise();

    return {
      id: product.Id,
      name: product.Name,
      description: product.Description,
      price: product.Price,
      idCatalogue: product.Id_Catalogue,
      imageURLs: (product.Image.includes('product-images')) ? product.Image.replace('/', '%2F') : product.Image
    };
  }

  public async getProducts(): Promise<Product[]> {
    const products = await this.http.get<any>(`${config.backUrl}product`).toPromise();
    return products.map(product => {
      return {
        id: product.Id,
        name: product.Name,
        description: product.Description,
        price: product.Price,
        idCatalogue: product.Id_Catalogue,
        userId: product.User_Id,
        imageURLs: (product.Image.includes('product-images')) ? product.Image.replace('/', '%2F') : product.Image
      };
    });
  }

  public findProducts(term): Observable<any> {
    return this.angularFireDatabase
      .list<Product>('products', (ref) =>
        ref
          .orderByChild('name')
          .startAt(term)
          .endAt(term + '\uf8ff')
      )
      .valueChanges()
      .pipe(catchError(this.handleError<Product[]>(`getProductsQuery`)));
  }

  public updateProduct(data: { product: Product; files: FileList }) {
    const dbOperation = this.uploadService
      .startUpload(data)
      .then((task) => {
        data.product.imageURLs = [];
        data.product.imageRefs = [];
        data.product.imageURLs.push(task.downloadURL);
        data.product.imageRefs.push(task.ref.fullPath);

        const productToSave = data['product'];

        const formData = {
          name: productToSave['name'],
          description: productToSave['description'],
          price: productToSave['price'],
          idCatalogue: productToSave['idCatalogue'],
          image: productToSave['imageRefs'][0],
          userId: this.user.id
        };
        this.http.post<any>(`${config.backUrl}product/${productToSave.id}`, formData).subscribe(response => {
            return response;
          },
          error => {
            this.messageService.addError(error.error.message);
            throw Error('Error');
          });

        return data;
      })
      .then((response) => {
        this.log(`Producto actualizado ${data.product.name}`);
        return data.product;
      })
      .catch((error) => {
        this.handleError(error);
        return error;
      });
    return fromPromise(dbOperation);
  }

  updateProductWithoutNewImage(product: Product) {
    return new Promise((resolve, reject) => {
      const productToSave = product;

      const formData = {
        name: productToSave['name'],
        description: productToSave['description'],
        price: productToSave['price'],
        idCatalogue: productToSave['idCatalogue'],
        image: productToSave['imageURLs'],
        userId: this.user.id
      };
      return this.http.post<any>(`${config.backUrl}product/${productToSave.id}`, formData).subscribe(response => {
          resolve(response);
        },
        error => {
          this.messageService.addError(error.error.message);
          reject(error);
        });
    });
  }

  public addProduct(data: { product: Product; files: FileList }) {
    const dbOperation = this.uploadService
      .startUpload(data)
      .then((task) => {
        data.product.imageURLs.push(task.downloadURL);
        data.product.imageRefs.push(task.ref.fullPath);

        const productToSave = data['product'];

        const formData = {
          name: productToSave['name'],
          description: productToSave['description'],
          price: productToSave['price'],
          idCatalogue: productToSave['idCatalogue'],
          image: productToSave['imageRefs'][0],
          userId: this.user.id
        };
        this.http.post<any>(`${config.backUrl}product`, formData).subscribe(response => {
            return response;
          },
          error => {
            this.messageService.addError(error.error.message);
            throw Error('Error');
          });

        return data;
      }, (error) => error)
      .then((response) => {
        this.log(`Producto agregado ${data.product.name}`);
        return data.product;
      })
      .catch((error) => {
        this.messageService.addError(
          `Error ${data.product.name}`
        );
        this.handleError(error);
        return error;
      });
    return fromPromise(dbOperation);
  }

  async getCatalogues(): Promise<any> {
    return await this.http.get<any>(`${config.backUrl}catalogue/`).toPromise();
  }

  public deleteProduct(product: Product) {

  }
}
