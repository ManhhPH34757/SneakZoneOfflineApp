import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { ProductResponse } from '../../class/response/product-response';
import { ColorService } from '../../services/color.service';
import { SizeService } from '../../services/size.service';
import { Color } from '../../class/dto/color';
import { Size } from '../../class/dto/size';
import { ProductDetailsService } from '../../services/product-details.service';
import { forkJoin } from 'rxjs';
import { ProductDetails } from '../../class/dto/product-details';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import { QRCodeComponent } from 'angularx-qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild('selectAllCheckbox', { static: false }) selectAllCheckbox!: ElementRef;
  @ViewChildren('qrcodeElement') qrCodeElements!: QueryList<QRCodeComponent>;

  idProduct!: string;
  product: ProductResponse = new ProductResponse();
  productDetails: any[] = [];
  colors: Color[] = [];
  sizes: Size[] = [];
  role: boolean = false;

  sizeMap: Map<string, string> = new Map();
  colorMap: Map<string, string> = new Map();

  showTable: boolean = false;
  isAnyRowSelected: boolean = false;

  selectedColors: any[] = [];
  selectedSizes: any[] = [];

  productDetailsGenerate: any[] = [];
  selectedRows: string[] = [];

  constructor(
    private readonly productService: ProductService,
    @Inject(ProductDetailsService) private readonly productDetailsService: ProductDetailsService,
    private readonly colorService: ColorService,
    @Inject(SizeService) private readonly sizeService: SizeService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token: any = localStorage.getItem('access_token');
    const decoded: any = jwtDecode(token);
    if (decoded.scope == 'ADMIN') {
      this.role = true;
    }
    this.route.paramMap.subscribe((params) => {
      this.idProduct = params.get('idProduct') ?? '';

      forkJoin({
        product: this.productService.getProductById(this.idProduct),
        colors: this.colorService.getAllColor(),
        sizes: this.sizeService.getAllSize(),
      }).subscribe((results) => {
        this.product = results.product.result;

        this.colors = results.colors.result;
        this.colors.forEach((color) => {
          this.colorMap.set(color.id, color.colorName);
        });

        this.sizes = results.sizes.result;
        this.sizes.forEach((size) => {
          this.sizeMap.set(size.id, size.sizeName);
        });

        this.loadProductDetails();
      });
    });
  }

  loadProductDetails(): void {
    this.productDetailsService
      .getAllProductDetailsByIdProduct(this.idProduct)
      .subscribe((data) => {
        this.productDetails = [];
        data.result.forEach((element: any) => {
          const productDetail = {
            id: element.id,
            productName: this.product.productName,
            colorName: this.getColorById(element.idColor),
            sizeName: this.getSizeById(element.idSize),
            idColor: element.idColor,
            idSize: element.idSize,
            weight: element.weight,
            price: element.price,
            quantity: element.quantity,
            createdAt: element.createdAt,
            updatedAt: element.updatedAt,
            selected: false,
          };
          this.productDetails.push(productDetail);
          this.productDetails.forEach(product => {
            product.quantity = this.formatNumber(product.quantity);
            product.price = this.formatNumber(product.price);
          });
        });
      });
  }

  loadProduct(): void {
    this.route.paramMap.subscribe((params) => {
      this.idProduct = params.get('idProduct') ?? '';
      this.productService.getProductById(this.idProduct).subscribe((data) => {
        this.product = data.result;
      });
    });
  }

  loadColors(): void {
    this.colorService.getAllColor().subscribe((data) => {
      this.colors = data.result;
      this.colors.forEach((color) => {
        this.colorMap.set(color.id, color.colorName);
      });
    });
  }

  loadSizes(): void {
    this.sizeService.getAllSize().subscribe((data) => {
      this.sizes = data.result;
      this.sizes.forEach((size) => {
        this.sizeMap.set(size.id, size.sizeName);
      });
    });
  }

  generateProduct(): void {
    if (this.selectedColors.length > 0 && this.selectedSizes.length > 0) {
      this.showTable = true;
      this.productDetailsGenerate = [];
      this.selectedColors.forEach((color) => {
        this.selectedSizes.forEach((size) => {
          this.productDetailsService
            .checkExists(this.idProduct, color, size)
            .subscribe((data) => {
              if (data.result === false) {
                const product = {
                  idProduct: this.idProduct,
                  productName: this.product.productName,
                  idColor: color,
                  idSize: size,
                  sizeName: this.getSizeById(size),
                  colorName: this.getColorById(color),
                  quantity: 20,
                  weight: 2,
                  price: 750000,
                };
                this.productDetailsGenerate.push(product);
              }
            });
        });
      });
    } else {
      this.showTable = false;
      this.productDetailsGenerate = [];
    }
  }

  remove(index: number) {
    this.productDetailsGenerate.splice(index, 1);
    if (this.productDetailsGenerate.length == 0) {
      this.selectedColors = [];
      this.selectedSizes = [];
      this.showTable = false;
    }
  }

  getSizeById(id: string): string {
    return this.sizeMap.get(id) ?? 'Unknown';
  }

  getColorById(id: string): string {
    return this.colorMap.get(id) ?? 'Unknown';
  }

  selectAll(event: any) {
    const isChecked = event.target.checked;
    this.productDetails.forEach((product) => {
      product.selected = isChecked;

      if (isChecked) {
        product.price = this.parseFormattedNumber(product.price);
        product.quantity = this.parseFormattedNumber(product.quantity);
      } else {
        product.price = this.formatNumber(product.price);
        product.quantity = this.formatNumber(product.quantity);
      }
    });

    this.updateButtonState();
  }


  onSelectRow(event: any, productId: number) {
    const isChecked = event.target.checked;
    const product = this.productDetails.find((p) => p.id === productId);

    if (product) {
      product.selected = isChecked;

      if (isChecked) {
        product.price = this.parseFormattedNumber(product.price);
        product.quantity = this.parseFormattedNumber(product.quantity);
      } else {
        product.price = this.formatNumber(product.price);
        product.quantity = this.formatNumber(product.quantity);
      }
    }

    this.updateButtonState();
  }

  updateButtonState() {
    this.isAnyRowSelected = this.productDetails.some(
      (product) => product.selected
    );
  }

  delete(id: string) {
    let check = confirm('Are you sure you want to delete this product?');
    if (check) {
      console.log(id);
    }
  }

  createProductDetails() {
    this.productDetailsGenerate.forEach((data) => {
      const productDetail: ProductDetails = {
        id: uuidv4(),
        idProduct: this.idProduct,
        idColor: data.idColor,
        idSize: data.idSize,
        quantity: data.quantity,
        price: data.price,
        weight: data.weight,
        status: 'Active',
        createdAt: this.getDate(),
        updatedAt: this.getDate(),
      };
      this.productDetailsService
        .createProductDetails(productDetail)
        .subscribe(() => {
          this.loadProductDetails();
          this.loadProduct();
        });
    });
    this.productDetailsGenerate = [];
    this.selectedColors = [];
    this.selectedSizes = [];
    this.showTable = false;
  }

  updateProductDetails() {
    const selectedProducts = this.productDetails.filter(
      (product) => product.selected
    );
    selectedProducts.forEach((data) => {
      const productDetail: ProductDetails = {
        id: data.id,
        idProduct: this.idProduct,
        idColor: data.idColor,
        idSize: data.idSize,
        quantity: data.quantity,
        price: data.price,
        weight: data.weight,
        status: 'Active',
        createdAt: data.createdAt,
        updatedAt: this.getDate(),
      };

      this.productDetailsService.updateProductDetails(productDetail).subscribe(() => {
        this.loadProductDetails();
        this.loadProduct();
        this.isAnyRowSelected = false;
      })
    });
    if (this.selectAllCheckbox) {
      this.selectAllCheckbox.nativeElement.checked = false;
    }
  }

  getDate(): string {
    const timezoneOffsetInMillis = 7 * 60 * 60 * 1000;
    return new Date(
      new Date().getTime() + timezoneOffsetInMillis
    ).toISOString();
  }

  async downloadSelectedQR() {
    const zip = new JSZip();

    for (let i = 0; i < this.productDetails.length; i++) {
      const product = this.productDetails[i];
      if (product.selected) {
        const qrElement = this.qrCodeElements.toArray()[i].qrcElement.nativeElement.querySelector('canvas');
        const dataUrl = qrElement.toDataURL('image/png');

        const base64 = dataUrl.split(',')[1];
        zip.file(`QR_${product.productName}-${product.colorName}-${product.sizeName}.png`, base64, { base64: true });
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `QR_Codes-${this.product.productName}.zip`);
    this.loadProduct();
    this.loadProductDetails();
    this.isAnyRowSelected = false;
    if (this.selectAllCheckbox) {
      this.selectAllCheckbox.nativeElement.checked = false;
    }
  }

  private formatNumber(value: number): string {
    return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  private parseFormattedNumber(value: string): number {
    return parseFloat(value.replace(/,/g, '').replace(/\./g, ''));
  }

}
