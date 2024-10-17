import { Component, OnInit } from '@angular/core';
import { SoleService } from '../../services/sole.service';
import { Sole } from '../../class/dto/sole';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-sole',
  templateUrl: './sole.component.html',
  styleUrl: './sole.component.css'
})
export class SoleComponent implements OnInit{

  constructor(private readonly soleService : SoleService){}

  soles:any
  sole:Sole = new Sole();

  checkSoleCode: boolean = true;
  checkSoleName: boolean = true;
  checkDespription: boolean = true;

  loadSoles():void{
    this.soleService.getAllSoles().subscribe(data => {
      this.soles=data.result;
    });
  }
  clear(){
    this.sole = new Sole();
  }
  ngOnInit(): void {
    this.soleService.getAllSoles().subscribe((data) => {
      this.loadSoles();
    });
  }
  onSubmit(): void{
    if(this.validation()){
      const id = uuidv4();
      this.sole.id = id;
      this.soleService.createSoles(this.sole).subscribe(data=>{
        this.loadSoles();
        this.clear();
      });
    }
  }
  validation(): boolean{
    let soleCode = document.getElementById('soleCode') as HTMLInputElement;
    let soleName = document.getElementById('soleName') as HTMLInputElement;


    if(soleCode.value.trim().length == 0){
      this.checkSoleCode = false;
    } else {
      this.checkSoleCode = true;
    }

    if(soleName.value.trim().length == 0){
      this.checkSoleName = false;
    } else {
      this.checkSoleName = true;
    }

  
    if (this.checkSoleCode && this.checkSoleName) {
      return true;
    }

    return false;
  }
  edit(soleEdit: Sole):void{
    this.soleService.getSoleById(soleEdit.id).subscribe((data)=>{
      this.sole = data.result;
    });
  }
  onUpdate():void {
    if(this.validation()){
      this.soleService.updateSole(this.sole).subscribe(data=>{
        this.loadSoles();
        this.clear();
      });
    }
  }
  delete(sole : Sole): void {
    if(confirm('Ban co muon xoa khong ?')){
      this.soleService.deleteSole(sole.id).subscribe(data => {
        this.loadSoles();
      });
    }
  }

}
