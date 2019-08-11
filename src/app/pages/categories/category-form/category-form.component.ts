import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

import { switchMap } from "rxjs/operators"; //Manipular a rota

import toastr from "toastr";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submitteingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  //Método root a ser chamado para criar categoria
  submitFrom(){
    this.submitteingForm = true;

    if(this.currentAction == 'new'){
      this.createCategory();
    }else{
      this.updateCategory();
    }
  }


  //PRIVATE METHODS

  //Identificando a rota para saber se é EDIT ou NEW
  private setCurrentAction(){
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    }else{
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm(){
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory(){
    //Caso seja edit, vou requisitar o servidor para trazer a categoria informada
    if(this.currentAction == 'edit'){

      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category) //baind dos valores vindos da requisição para o formulário
        },
        (error) => alert('Ocorreu um eror ao servidor, tente novamente mais tarde!')
      )
    }
  }

  
  private setPageTitle(){
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria'
    }else{
      const categoryName = this.category.name || '' // tratando quando o [this.category.name] retornar null
      this.pageTitle = 'Editando Categoria: '+ categoryName
    }
  }


  private createCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionFormError(error)
      )

  }

  private updateCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionFormError(error)
      )
  }

  private actionsForSuccess(category: Category){
    //Alerta da tela com o tastr
    toastr.success('Solicitação processada com sucesso!');

    //Ao termino do submit, eu redireciono para a url anterior;
    //Edepois redireciono para a o edit do objeto atual cadastrado
    // Com skipLocationChange eu elimino a possibilidade de retornar para a url anterior limpado a do hostirico de navegação
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    )
  }

  private actionFormError(error){
    toastr.error('Ocorreu um erro ao processar sua solicitação!');

    this.submitteingForm = false;

    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ['Falha na comunicação com o servdiro. Por favor, tente mais tarde'];
  }

}
