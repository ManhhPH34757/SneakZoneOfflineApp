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

  loadMaterials():void{
    this.materialService.getAllMaterials().subscribe(data => {
      this.materials=data.result;
    });
  }
  
  clear(){
    this.material = new Material();
  }
  ngOnInit(): void {
    this.materialService.getAllMaterials().subscribe((data) => {
      this.loadMaterials();
    });
  }

  onSubmit(): void{
    if(this.validation()){
      const id = uuidv4();
      this.material.id = id;
      this.materialService.createMaterials(this.material).subscribe(data=>{
        this.loadMaterials();
        this.clear();
      });
    }
  }
  validation(): boolean{
    let materialCode = document.getElementById('materialCode') as HTMLInputElement;
    let materialName = document.getElementById('materialName') as HTMLInputElement;
    let description = document.getElementById('description') as HTMLInputElement;

    if(materialCode.value.trim().length == 0){
      this.checkMaterialCode = false;
    } else {
      this.checkMaterialCode = true;
    }

    if(materialName.value.trim().length == 0){
      this.checkMaterialName = false;
    } else {
      this.checkMaterialName = true;
    }

    if(description.value.trim().length == 0){
      this.checkDespription = false;
    } else {
      this.checkDespription = true;
    }

    if (this.checkMaterialCode && this.checkMaterialName && this.checkDespription) {
      return true;
    }

    return false;
  }
  edit(materialEdit: Material):void{
    this.materialService.getMaterialById(materialEdit.id).subscribe((data)=>{
      this.material = data.result;
      this.checkMaterialCode = true;
      this.checkMaterialName = true;
      this.checkDespription = true;
    });
  }

}
