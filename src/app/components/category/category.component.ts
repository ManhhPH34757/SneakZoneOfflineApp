import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../class/dto/category';
import { BrandService } from '../../services/brand.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  constructor(private readonly categoryService: CategoryService) { }

  categories: any;
  category: Category = new Category();
  editing: boolean = false;

  checkCategoryCode: boolean = true;
  checkCategoryName: boolean = true;

  loadCategory():void{
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data.result;
      console.log(data.request);
    })
  }

  ngOnInit(): void {
      this.categoryService.getAllCategories().subscribe((data)=>{
        this.loadCategory();
      })
  }

  clear(): void{
    this.category = new Category();
    this.editing = false;
  }

  onSubmit(){
    const id = uuidv4();
    this.category.id = id;
    this.categoryService.createCategory(this.category).subscribe(() => {
      this.loadCategory();
      this.clear();
    })
  }

  validation(): boolean{
    let categoryCode = document.getElementById('categoryCode') as HTMLInputElement;
    let categoryName = document.getElementById('categoryName') as HTMLInputElement;

    if(categoryCode.value.trim().length == 0){
      this.checkCategoryCode = false;
    }else{
      this.checkCategoryCode = true;
    }

    if(categoryName.value.trim().length == 0){
      this.checkCategoryName = false;
    }else{
      this.checkCategoryName = true;
    }
    
    if(this.checkCategoryCode && this.checkCategoryName){
      return true;
    }
    return false;
  }

}
