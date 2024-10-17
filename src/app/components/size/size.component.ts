import { Component, OnInit } from '@angular/core';
import { SizeService } from '../../services/size.service';
import { Size } from '../../class/dto/size';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrl: './size.component.css'
})
export class SizeComponent implements OnInit {
  constructor(private readonly sizeService : SizeService){}

  sizes:any;
  size:Size = new Size();

  checkSizeCode: boolean = true;
  checkSizeName: boolean = true;
  checkDespription: boolean = true;

  loadSizes():void{
    this.sizeService.getAllSize().subscribe(data => {
      this.sizes=data.result;
    });
  }
  clear(){
    this.size = new Size();
  }
  ngOnInit(): void {
    this.sizeService.getAllSize().subscribe((data) => {
      this.loadSizes();
    });
  }
  onSubmit(): void{
    if(this.validation()){
      const id = uuidv4();
      this.size.id = id;
      this.sizeService.createSize(this.size).subscribe(()=>{
        this.loadSizes();
        this.clear();
      });
    }
  }
  validation(): boolean{
    let sizeCode = document.getElementById('sizeCode') as HTMLInputElement;
    let sizeName = document.getElementById('sizeName') as HTMLInputElement;


    if(sizeCode.value.trim().length == 0){
      this.checkSizeCode = false;
    } else {
      this.checkSizeCode = true;
    }

    if(sizeName.value.trim().length == 0){
      this.checkSizeName = false;
    } else {
      this.checkSizeName = true;
    }

  
    if (this.checkSizeCode && this.checkSizeName) {
      return true;
    }

    return false;
  }
  edit(sizeEdit: Size):void{
    this.sizeService.getSizeById(sizeEdit.id).subscribe((data)=>{
      this.size = data.result;
    });
  }
  onUpdate():void {
    if(this.validation()){
      this.sizeService.updateSize(this.size).subscribe(data=>{
        this.loadSizes();
        this.clear();
      });
    }
  }
  delete(size : Size): void {
    if(confirm('Ban co muon xoa khong ?')){
      this.sizeService.deleteSize(size.id).subscribe(data => {
        this.loadSizes();
      });
    }
  }
}
