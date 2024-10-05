import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../class/dto/brand';
import { v4 as uuidv4 } from 'uuid'
import { Category } from '../../class/dto/category';
@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css'
})
export class BrandComponent implements OnInit{

  constructor(
    private readonly brandService: BrandService
  ){}
  brands: any;
  brand: Brand = new Brand();
  editing: boolean = false;

  checkBrandCode: boolean = true;
  checkBrandName: boolean = true;

  loadBrand(): void{
    this.brandService.getAllBrands().subscribe(data =>{
      this.brands = data.result;
    })
  }

  
  ngOnInit(): void {
    this.brandService.getAllBrands().subscribe((data) =>{
      this.loadBrand();
    })
     
  }
   
  onSubmit(){
    if(this.validation()){
      const id = uuidv4();
      this.brand.id = id;
      this.brandService.createBrand(this.brand).subscribe(()=>{
        this.loadBrand();
        this.clear();
      });
    }
  }

  edit(brandEdit: Brand){
    this.brandService.getBrandById(brandEdit.id).subscribe((data)=>{
      this.brand = data.result;
      this.editing = true;
    });
  }

  clear(): void {
    this.brand = new Brand();
    this.editing = false;
  }
  validation(): boolean{
    let brandCode = document.getElementById('brandCode') as HTMLInputElement;
    let brandName = document.getElementById('brandName') as HTMLInputElement;

    if(brandCode.value.trim().length == 0){
      this.checkBrandCode = false;
    }else{
      this.checkBrandCode = true;
    }

    if(brandName.value.trim().length == 0){
      this.checkBrandName = false;
    }else{
      this.checkBrandName = true;
    }

    if(this.checkBrandCode && this.checkBrandName){
      return true;
    }
    return false;

  }

}
