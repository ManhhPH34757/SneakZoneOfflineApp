import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../class/dto/material';
import { data } from 'jquery';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrl: './material.component.css'
})
export class MaterialComponent implements OnInit{

  constructor(private readonly materialService : MaterialService){}
  materials:any;
  material:Material = new Material();

  checkMaterialCode: boolean = true;
  checkMaterialName: boolean = true;
  checkDespription: boolean = true;
  errorMsgMaterialCode: string = '';
  errorMsgMaterialName: string = '';
  errorMsgDescription: string = '';
  showAlertSuccess: boolean = false;
  showAlertError: boolean = false;
  alertMessage: string = '';
  loadMaterials():void{
    this.materialService.getAllMaterials().subscribe(data => {
      this.materials=data.result;
    });
  }
  
  clear(){
    this.material = new Material();
  }
  checkDuplicateMaterialCode(materialCode: string): boolean {
    return this.materials.some((material: Material) => material.materialCode === materialCode);
  }
  checkDuplicateMaterialName(materialName: string): boolean {
    return this.materials.some((material: Material) => material.materialName === materialName);
  }
  checkDuplicateMaterialNameUpdate(materialName: string): boolean {
    return this.materials.some((material: Material) => material.materialName === materialName && material.id !== this.material.id);
  }

  ngOnInit(): void {
    this.materialService.getAllMaterials().subscribe((data) => {
      this.loadMaterials();
    });
  }

  onSubmit(): void {
    const id = uuidv4();
    this.material.id = id;
    this.material.materialCode = this.material.materialCode.trim();
    this.material.materialName = this.material.materialName.trim();
    if (this.validationCreate()) {
      this.materialService.createMaterials(this.material).subscribe(() => {
        this.loadMaterials();
        this.clear();
      });
    }
  }
  validationCreate(): boolean {
    let materialCode = (document.getElementById('materialCode') as HTMLInputElement).value.trim();
    let materialName = (document.getElementById('materialName') as HTMLInputElement).value.trim();
    let description = (document.getElementById('description') as HTMLInputElement).value.trim();
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;

    if (materialCode.length == 0) {
      this.checkMaterialCode = false;
      this.errorMsgMaterialCode = 'Material code is required.';
    } else if (materialCode.length > 10 || !alphanumericRegex.test(materialCode)) {
      this.checkMaterialCode = false;
      this.errorMsgMaterialCode = 'Material code must be alphanumeric and less than or equal to 10 characters.';
    } else if (this.checkDuplicateMaterialCode(materialCode)) {
      this.checkMaterialCode = false;
      this.errorMsgMaterialCode = 'Duplicate Material Code';
    } else {
      this.checkMaterialCode = true;
      this.errorMsgMaterialCode = '';
    }

    if (materialName.length == 0) {
      this.checkMaterialName = false;
      this.errorMsgMaterialName = 'Material name is required.';
    } else if (materialName.length > 30) {
      this.checkMaterialName = false;
      this.errorMsgMaterialName = 'Material name must be less than or equal to 30 characters.';
    } else if (this.checkDuplicateMaterialName(materialName)) {
      this.checkMaterialName = false;
      this.errorMsgMaterialName = 'Duplicate Brand Name';
    } else {
      this.checkMaterialName = true;
      this.errorMsgMaterialName = '';
    }

    if (description.length > 255) {
      this.checkDespription = false;
      this.errorMsgDescription = 'Description must be less than or equal to 255 characters.';
    } else {
      this.checkDespription = true;
      this.errorMsgDescription = '';
    }

    if (this.checkMaterialCode && this.checkMaterialName && this.checkDespription) {
      return true;
    }
    return false;
  }
  edit(materialEdit: Material):void{
    this.materialService.getMaterialById(materialEdit.id).subscribe((data)=>{
      this.material = data.result;
    });
  }
  onUpdate():void {
    if(this.validationCreate()){
      this.materialService.updateMaterial(this.material).subscribe(data=>{
        this.loadMaterials();
        this.clear();
      });
    }
  }
  delete(material: Material): void {
    if(confirm('Ban co muon xoa khong ?')){
      this.materialService.deleteMaterial(material.id).subscribe(data => {
        this.loadMaterials();
      });
    }
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
}
