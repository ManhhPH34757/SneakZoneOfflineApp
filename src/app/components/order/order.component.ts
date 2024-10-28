import { Component, Inject, OnInit } from '@angular/core';
import { Order } from '../../class/dto/order';
import { OrderDetails } from '../../class/dto/order-details';
import { OrderService } from '../../services/order.service';
import { OrderDetailsService } from '../../services/order-details.service';
import { jwtDecode } from 'jwt-decode';
import { ProductDetailsService } from '../../services/product-details.service';
import { CustomerService } from '../../services/customer.service';
import { CustomerResponse } from '../../class/response/customer-response';
import { ApiAddressService } from '../../services/api-address.service';
import { v4 as uuidv4 } from 'uuid';
import { CouponsService } from '../../services/coupons.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

declare const bootstrap: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  constructor(@Inject(OrderService) private readonly orderService: OrderService,
    private readonly orderDetailsService: OrderDetailsService,
    private readonly productDetailsService: ProductDetailsService,
    private readonly customerService: CustomerService,
    @Inject(ApiAddressService) private readonly apiAddressService: ApiAddressService,
    private readonly couponsService: CouponsService,
    private readonly modalService: NgbModal
  ) { }

  idStaff: string = '';
  orders: Order[] = [];
  activeTab: number = 0;
  order: Order = new Order();
  orderSelect: Order = new Order();
  orderDetails: any[] = [];
  orderDetail: OrderDetails = new OrderDetails();
  productDetails: any[] = [];
  productName: string = '';
  customers: any[] = [];
  customer: CustomerResponse = new CustomerResponse();
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedProvince: string | null = null;
  selectedDistrict: string | null = null;
  selectedWard: string | null = null;
  address: string | null = null;
  checkCustomerName: boolean = true;
  checkCustomerPhone: boolean = true;
  checkCustomerProvince: boolean = true;
  checkCustomerDistrict: boolean = true;
  checkCustomerWard: boolean = true;
  checkCustomerAddress: boolean = true;
  totalWeight: number = 0;
  showAlertSuccess: boolean = false;
  showAlertError: boolean = false;
  alertMessage: string = '';
  coupons: any[] = [];

  public isScannerVisible: boolean = false;
  public torchEnabled: boolean = false;
  public availableDevice?: MediaDeviceInfo;

  ngOnInit(): void {
    const access_token: any = localStorage.getItem('access_token');
    const decoded: any = jwtDecode(access_token);
    this.idStaff = decoded.user.id;
    this.loadCustomers();
    this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
    this.loadProduct(this.productName);
    this.loadProvinces();
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.couponsService.getCouponsForOrders().subscribe((data) => {
      this.coupons = data.result;
    });
  }

  loadOrdersInStoreUnpaid(idStaff: string, index: number): void {
    this.orderService.getOrdersInStoreUnpaid(idStaff).subscribe((data) => {
      this.orders = data.result;
      if (this.orders.length > 0) {
        this.selectTab(index);
      }
      this.order = new Order();
      this.orderDetail = new OrderDetails();
    });
  }

  loadCustomers(): void {
    this.customerService.getForOrders().subscribe((data) => {
      this.customers = data.result;
    });
  }

  createOrder(): void {
    const access_token: any = localStorage.getItem('access_token');
    const decoded: any = jwtDecode(access_token);
    this.order.id = uuidv4();
    this.order.orderCode = this.generateInvoiceCode();
    this.order.idStaff = decoded.user.id;
    this.order.orderType = 'InStore';
    this.order.status = 'Unpaid';
    this.order.createdAt = this.getDate();
    this.order.updatedAt = this.getDate();
    this.orderService.createOrder(this.order).subscribe(() => {
      this.loadOrdersInStoreUnpaid(this.idStaff, 0);
    })
  }

  selectTab(index: number): void {
    this.activeTab = index;
    this.orderSelect = this.orders[this.activeTab];

    this.orderDetailsService
      .getOrderDetailsByIdOrders(this.orderSelect.id)
      .subscribe((data) => {
        this.orderDetails = data.result;
        this.totalWeight = 0;
        this.orderDetails.forEach((od) => {
          this.totalWeight += od.totalWeight;
        });
      });
    if (this.orderSelect.idCustomer != null && this.orderSelect.idCustomer != '') {
      this.getCustomerById(this.orderSelect.idCustomer);
    } else {
      this.customer = new CustomerResponse();
    }
    this.resetForm();
  }

  addProduct(product: any): void {
    this.orderDetailsService.checkExistsProductInOrder(product.id, this.orderSelect.id).subscribe((data) => {
      if (!data.result) {
        this.orderDetail = new OrderDetails();
        this.orderDetail.id = uuidv4();
        this.orderDetail.idProductDetails = product.id;
        this.orderDetail.idOrders = this.orderSelect.id;
        this.orderDetail.quantity = 1;
        this.orderDetail.totalPrice = product.price_new;
        this.orderDetail.status = 'Bought';
        this.orderDetailsService.createOrderDetails(this.orderDetail).subscribe(() => {
          this.orderSelect.totalPrice += product.price_new;
          this.orderSelect.totalPayouts += product.price_new;
          this.orderService.updateOrder(this.orderSelect).subscribe(() => {
            this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
            this.productDetailsService.getById(product.id).subscribe((data) => {
              let productDetails = data.result;
              productDetails.quantity = productDetails.quantity - 1;
              this.productDetailsService.updateProductDetails(productDetails).subscribe(() => {
                this.productName = '';
                this.loadProduct(this.productName);
              });
            });
          });
        });
      } else {
        this.orderDetailsService.getOrderDetailByIdProductDetailsAndIdOrders(product.id, this.orderSelect.id).subscribe((data) => {
          this.orderDetail = data.result;
          this.orderDetail.quantity++;
          this.orderDetail.totalPrice = this.orderDetail.quantity * product.price_new;
          this.orderSelect.totalPayouts += product.price_new;
          this.orderDetailsService.updateOrderDetails(this.orderDetail).subscribe(() => {
            this.orderSelect.totalPrice += product.price_new;
            this.orderService.updateOrder(this.orderSelect).subscribe(() => {
              this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
              this.productDetailsService.getById(product.id).subscribe((data) => {
                let productDetails = data.result;
                productDetails.quantity = productDetails.quantity - 1;
                this.productDetailsService.updateProductDetails(productDetails).subscribe(() => {
                  this.productName = '';
                  this.loadProduct(this.productName);
                });
              });
            });
          });
        });
      }
    });
  }

  closeModal1() {
    const modalElement = document.getElementById('exampleModal2');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  selectProduct(product: any) {
    this.addProduct(product);
    this.closeModal1();
  }

  changeQuantity(ord: any): void {
    setTimeout(() => {
      this.orderDetailsService.getById(ord.id).subscribe((data) => {
        const orderDetailsOld = data.result;
        this.orderDetail.id = ord.id;
        this.orderDetail.idOrders = this.orderSelect.id;
        this.orderDetail.idProductDetails = ord.idProductDetails;
        this.orderDetail.quantity = ord.quantity > 0 ? ord.quantity : 1;
        this.orderDetail.status = 'Bought';
        this.productDetailsService.getById(ord.idProductDetails).subscribe((data) => {
          let productDetailsOld = data.result;
          if (this.orderDetail.quantity - orderDetailsOld.quantity > productDetailsOld.quantity) {
            this.displayAlert('error', 'Quantity is not enough');
            this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
          } else {
            this.orderDetail.totalPrice = this.orderDetail.quantity * ord.price_new;
            this.orderDetailsService.updateOrderDetails(this.orderDetail).subscribe(() => {
              productDetailsOld.quantity = productDetailsOld.quantity + orderDetailsOld.quantity - this.orderDetail.quantity;
              this.productDetailsService.updateProductDetails(productDetailsOld).subscribe(() => {
                this.orderSelect.totalPrice = this.orderSelect.totalPrice - orderDetailsOld.totalPrice + this.orderDetail.totalPrice;
                if (this.orderSelect.idCoupons != '' && this.orderSelect.idCoupons != null) {
                  this.couponsService.getCouponById(this.orderSelect.idCoupons).subscribe((data) => {
                    let coupon = data.result;
                    if (this.orderSelect.totalPrice >= coupon.conditions) {
                      this.orderSelect.reducedPrice = this.orderSelect.totalPrice * coupon.couponsPrice / 100;
                      this.orderSelect.totalPayouts = this.orderSelect.totalPrice - this.orderSelect.reducedPrice + this.orderSelect.transportPrice;
                      this.orderService.updateOrder(this.orderSelect).subscribe(() => {
                        coupon.quantity = coupon.quantity - 1;
                        this.couponsService.updateCoupon(coupon).subscribe(() => {
                          this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
                        });
                      });
                    } else {
                      this.orderSelect.idCoupons = '';
                      this.orderSelect.totalPayouts = this.orderSelect.totalPayouts - orderDetailsOld.totalPrice + this.orderDetail.totalPrice;
                      this.orderService.updateOrder(this.orderSelect).subscribe(() => {
                        this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
                        this.productName = '';
                        this.loadProduct(this.productName);
                        this.displayAlert('error', 'Total price must be greater than or equal to the coupon conditions.');
                      });
                    }
                  });
                } else {
                  this.orderSelect.idCoupons = '';
                  this.orderSelect.reducedPrice = 0;
                  this.orderSelect.totalPayouts = this.orderSelect.totalPayouts - orderDetailsOld.totalPrice + this.orderDetail.totalPrice;
                  this.orderService.updateOrder(this.orderSelect).subscribe(() => {
                    this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
                    this.productName = '';
                    this.loadProduct(this.productName);
                  });
                }
              });
            });
          }
        })
      });
    }, 500);
  }

  deleteProductInOrder(ord: any): void {
    this.productDetailsService.getById(ord.idProductDetails).subscribe((data) => {
      let productDetailsOld = data.result;
      productDetailsOld.quantity = productDetailsOld.quantity + ord.quantity;
      this.productDetailsService.updateProductDetails(productDetailsOld).subscribe(() => {
        this.orderSelect.totalPrice = this.orderSelect.totalPrice - ord.totalPrice;
        this.orderSelect.totalPayouts = this.orderSelect.totalPayouts - ord.totalPrice;
        this.orderService.updateOrder(this.orderSelect).subscribe(() => {
          this.orderDetailsService.deleteById(ord.id).subscribe(() => {
            this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
            this.productName = '';
            this.loadProduct(this.productName);
          })
        });
      });
    });
  }

  deleteTab(id: string): void {
    let check = confirm('Do you want delete this order?');
    if (check) {
      this.orderService.deleteById(id).subscribe(() => {
        this.loadOrdersInStoreUnpaid(this.idStaff, 0);
      });
    } else {
      this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
    }
  }

  loadProduct(productName: string): void {
    this.productDetailsService.getProductDetailsResponse(productName).subscribe((data) => {
      this.productDetails = data.result;
    });
  }

  filterProduct(): void {
    this.loadProduct(this.productName);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.phoneNumber.toLowerCase().indexOf(term) > -1;
  }

  customSearchFn2(term: string, item: any) {
    term = term.toLowerCase();
    return item.couponsCode.toLowerCase().indexOf(term) > -1 || item.couponsName.toLowerCase().indexOf(term) > -1;
  }

  setOrderCustomer() {
    if (this.orderSelect.idCustomer != null) {
      this.orderService.updateOrder(this.orderSelect).subscribe((data) => {
        this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
      });
    } else {
      this.orderSelect.idCustomer = '';
      this.orderService.updateOrder(this.orderSelect).subscribe((data) => {
        this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
      });
    }
  }

  setCoupons() {
    if (this.orderSelect.idCoupons != '' && this.orderSelect.idCoupons != null) {
      this.couponsService.getCouponById(this.orderSelect.idCoupons).subscribe((data) => {
        let coupon = data.result;
        if (this.orderSelect.totalPrice >= coupon.conditions) {
          this.orderSelect.reducedPrice = this.orderSelect.totalPrice * coupon.couponsPrice / 100;
          this.orderSelect.totalPayouts = this.orderSelect.totalPrice - this.orderSelect.reducedPrice + this.orderSelect.transportPrice;
          this.orderService.updateOrder(this.orderSelect).subscribe(() => {
            coupon.quantity = coupon.quantity - 1;
            this.couponsService.updateCoupon(coupon).subscribe(() => {
              this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
            });
          });
        } else {
          this.orderSelect.idCoupons = '';
          this.displayAlert('error', 'Total price must be greater than or equal to the coupon conditions.');
        }
      });
    }
  }

  clearCoupons() {
    this.orderService.getById(this.orderSelect.id).subscribe((data) => {
      this.couponsService.getCouponById(data.result.idCoupons).subscribe((data) => {
        let coupon = data.result;
        coupon.quantity = coupon.quantity + 1;
        this.couponsService.updateCoupon(coupon).subscribe(() => {
          this.orderSelect.reducedPrice = 0;
          this.orderSelect.totalPayouts = this.orderSelect.totalPrice - this.orderSelect.reducedPrice + this.orderSelect.transportPrice;
          this.orderService.updateOrder(this.orderSelect).subscribe(() => {
            this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
          });
        });
      });
    });
  }

  getCustomerById(id: string): void {
    this.customerService.getCustomerById(id).subscribe((data) => {
      this.customer = data.result;
    });
  }

  setDeliveryInfo(): void {
    const province = this.provinces.find(province => province.province_id === this.selectedProvince);
    const district = this.districts.find(district => district.district_id === this.selectedDistrict);
    const ward = this.wards.find(ward => ward.ward_id === this.selectedWard);
    if (this.validation()) {
      const shippingData = {
        pick_province: 'Hà Nội',
        pick_district: 'Quận Nam Từ Liêm',
        province: province.province_name,
        district: district.district_name,
        address: this.address + ' ' + ward.ward_name,
        weight: this.totalWeight,
        value: this.orderSelect.totalPrice,
        transport: 'road',
        deliver_option: 'none'
      };
      this.apiAddressService.calculateShippingFee(shippingData).subscribe({
        next: (response) => {
          this.orderSelect.transportPrice = response.fee.fee;
          this.orderSelect.totalPayouts = this.orderSelect.totalPrice + this.orderSelect.transportPrice - this.orderSelect.reducedPrice;
          this.orderSelect.address = this.address + ' - ' + ward.ward_name + ' - ' + district.district_name + ' - ' + province.province_name;
          this.orderService.updateOrder(this.orderSelect).subscribe((data) => {
            this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
          });
        },
        error: (error) => {
          console.error('Lỗi:', error);
        }
      });
    }
  }

  validation(): boolean {
    this.checkCustomerName = this.validateField(this.orderSelect.customerName);
    this.checkCustomerPhone = this.validateField(this.orderSelect.phoneNumber);
    this.checkCustomerAddress = this.validateField(this.address);

    this.checkCustomerProvince = this.validateSelection(this.provinces, this.selectedProvince, 'province_id');
    this.checkCustomerDistrict = this.validateSelection(this.districts, this.selectedDistrict, 'district_id');
    this.checkCustomerWard = this.validateSelection(this.wards, this.selectedWard, 'ward_id');

    return this.isFormValid();
  }

  validateField(field: string | null): boolean {
    return field !== null && field.trim() !== '';
  }

  validateSelection(list: any[], selectedId: any, key: string): boolean {
    return list.some(item => item[key] === selectedId);
  }

  isFormValid(): boolean {
    return this.checkCustomerName &&
      this.checkCustomerPhone &&
      this.checkCustomerProvince &&
      this.checkCustomerDistrict &&
      this.checkCustomerWard &&
      this.checkCustomerAddress;
  }

  setDelivery(): void {
    let orderType = document.getElementById('OrderType') as HTMLInputElement;
    if (orderType.checked) {
      this.orderSelect.transportPrice = 30000;
      this.orderSelect.totalPayouts = this.orderSelect.totalPrice + this.orderSelect.transportPrice - this.orderSelect.reducedPrice;
      this.orderService.updateOrder(this.orderSelect).subscribe((data) => {
        this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
      });
    } else {
      this.orderSelect.transportPrice = 0;
      this.orderSelect.totalPayouts = this.orderSelect.totalPrice + this.orderSelect.transportPrice - this.orderSelect.reducedPrice;
      this.orderService.updateOrder(this.orderSelect).subscribe((data) => {
        this.loadOrdersInStoreUnpaid(this.idStaff, this.activeTab);
      });
    }
  }

  generateInvoiceCode(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `INV${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  }

  loadProvinces(): void {
    this.apiAddressService.getProvinces().subscribe((data) => {
      this.provinces = data.results;
    });
  }

  onProvinceChange(event: any): void {
    const provinceId = this.selectedProvince;
    if (provinceId) {
      this.apiAddressService.getDistricts(provinceId).subscribe((data) => {
        this.districts = data.results;
        this.wards = [];
      });
    } else {
      this.selectedDistrict = null;
      this.selectedWard = null;
      this.districts = [];
      this.wards = [];
    }
  }

  onDistrictChange(event: any): void {
    const districtId = this.selectedDistrict;
    if (districtId) {
      this.apiAddressService.getWards(districtId).subscribe((data) => {
        this.wards = data.results;
      });
    } else {
      this.selectedWard = null;
      this.wards = [];
    }
  }

  resetForm(): void {
    this.selectedProvince = null;
    this.selectedDistrict = null;
    this.selectedWard = null;
    this.address = null;
  }

  completeOrder(): void {
    this.orderSelect.status = 'Paid';
    this.orderService.updateOrder(this.orderSelect).subscribe(() => {
      this.loadOrdersInStoreUnpaid(this.idStaff, 0);
    });
  }

  getDate(): string {
    const timezoneOffsetInMillis = 7 * 60 * 60 * 1000;
    return new Date(
      new Date().getTime() + timezoneOffsetInMillis
    ).toISOString();
  }

  displayAlert(alertType: string, message: string): void {
    if (alertType === 'error') {
      this.showAlertError = true;
      this.alertMessage = message;
      setTimeout(() => {
        this.alertMessage = '';
        this.showAlertError = false;
      }, 3000);
    } else if (alertType === 'success') {
      this.showAlertSuccess = true;
      this.alertMessage = message;
      setTimeout(() => {
        this.showAlertSuccess = false;
        this.alertMessage = '';
      }, 3000);
    }
  }

  onCodeResult(resultString: string) {
    const idProduct = this.parseProductFromQr(resultString);
    if (idProduct) {
      this.productDetailsService.getProductDetailsResponseById(idProduct.id).subscribe((data) => {
        this.addProduct(data.result);
      });
      this.closeModal();
    }
  }

  parseProductFromQr(qrData: string): any {
    try {
      const data = JSON.parse(qrData);
      return {
        id: data
      };
    } catch (error) {
      console.error('Invalid QR data', error);
      return null;
    }
  }

  toggleScanner() {
    this.isScannerVisible = !this.isScannerVisible;
  }

  openModal(content: any) {
    this.toggleScanner();
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    this.modalService.open(content, modalOptions);
  }

  closeModal() {
    this.toggleScanner();
    this.modalService.dismissAll();
  }

}
