import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, Subscription, of} from 'rxjs';

import {MessageService} from '../../messages/message.service';
import {FileUploadService} from '../../products/shared/file-upload.service';
import {ProductService} from '../../products/shared/product.service';
import {ProductsCacheService} from '../../products/shared/products-cache.service';

import {Product} from '../../models/product.model';

export class DomainProduct extends Product {
}

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy {
  private formSubscription: Subscription;
  @ViewChild('photos', {static: true}) photos;
  public productForm: FormGroup;
  public product: DomainProduct;
  public mode: 'edit' | 'add';
  public catalogues = [];
  public nrSelect = 1;
  public id;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private productService: ProductService,
    public fileUploadService: FileUploadService,
    private productsCacheService: ProductsCacheService,
    private log: MessageService
  ) {
  }

  ngOnInit(): void {
    this.getCatalogues();
    this.setProduct();
  }

  private async getCatalogues() {
    this.catalogues = await this.productService.getCatalogues();
  }

  private initForm() {
    this.productForm = new FormGroup({

      name: new FormControl(
        this.product && this.product.name,
        Validators.required
      ),

      description: new FormControl(
        this.product && this.product.description,
        Validators.required
      ),

      idCatalogue: new FormControl(
        this.product && this.product.idCatalogue,
        Validators.required
      ),

      price: new FormControl(this.product && this.product.price, [
        Validators.required,
        Validators.min(0)
      ]),

    });
    this.onFormChanges();
  }

  private setProduct() {
    this.route.params.subscribe((params: Params) => {
      this.id = +this.route.snapshot.paramMap.get('id');
      // if we have an id, we're in edit mode
      if (this.id) {
        this.mode = 'edit';
        this.getProduct(this.id);
        this.initForm();
      } else {
        // else we are in add mode
        this.mode = 'add';
        this.constructProduct();
        this.initForm();
      }
    });
  }

  private constructProduct() {
    const product = this.constructMockProduct();
    this.syncProduct(product);
    this.initForm();
  }

  private async getProduct(id) {
    const product = await this.productService.getProduct(id);
    if (product) {
      this.syncProduct(product);
      this.initForm();
    }

  }

  private onFormChanges() {
    this.formSubscription = this.productForm.valueChanges.subscribe(
      (formFieldValues) => {
        const product = {...this.product, ...formFieldValues};
        this.syncProduct(product);
      }
    );
  }

  private syncProduct(product): void {
    const imageURLs = this.handleImageURLs(product);
    this.product = {
      ...product,
      imageURLs
    };
  }

  public onSubmit() {
    this.syncProduct({...this.product, ...this.productForm.value});
    const productToSubmit = this.constructProductToSubmit(this.product);
    const files: FileList = this.photos.nativeElement.files;
    if (this.mode === 'add' && files.length > 0) {
      this.addProduct(productToSubmit, files);
    } else if (this.mode === 'edit') {
      this.updateProduct(productToSubmit, files);
    } else {
      this.log.addError('Please provide a file for your product');
      return;
    }
  }

  private addProduct(product: Product, files: FileList) {
    this.productService.addProduct({product, files}).subscribe(
      (savedProduct: Product) => {
        if (savedProduct.id) {
          this.product = null;
          this.router.navigate(['/products']);
        }
      },
      (error) => {
        this.log.addError('Hubo un error en la creación del producto!');
        return of(error);
      }
    );
  }

  private updateProduct(product: Product, files?: FileList) {
    this.productService.updateProduct({product, files}).subscribe(
      (response: Product) => {
        this.router.navigate(['/products/' + response.id]);
      },
      (error) => this.log.addError('No se pudo actualizar el producto')
    );
  }

  public onDelete() {/*
    if (this.mode === 'edit') {
      this.productSubscription.unsubscribe();
      this.productService.deleteProduct(this.product).then((res) => {
        this.router.navigate(['/products']);
      });
    } else {
      this.log.addError(`Cannot delete new product`);
    }*/
  }

  // pure helper functions start here:
  private constructMockProduct() {
    return new Product();
  }

  private constructProductToSubmit(product: DomainProduct): Product {
    return {
      ...product,
    };
  }

  private handleImageURLs(product: Product): string[] {
    if (product.imageURLs && product.imageURLs.length > 0) {
      return product.imageURLs;
    }
    return [];
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }
}
