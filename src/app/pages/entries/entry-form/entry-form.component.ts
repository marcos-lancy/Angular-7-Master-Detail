import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";

import { switchMap } from "rxjs/operators"; //Manipular a rota

import toastr from "toastr";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submitteingForm: boolean = false;
  entry: Entry = new Entry();

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  //Método root a ser chamado para criar Entry
  submitFrom(){
    this.submitteingForm = true;

    if(this.currentAction == 'new'){
      this.createEntry();
    }else{
      this.updateEntry();
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

  private buildEntryForm(){
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      cateogryId: [null, [Validators.required]],

    });
  }

  private loadEntry(){
    //Caso seja edit, vou requisitar o servidor para trazer a entry informada
    if(this.currentAction == 'edit'){

      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry) //baind dos valores vindos da requisição para o formulário
        },
        (error) => alert('Ocorreu um eror ao servidor, tente novamente mais tarde!')
      )
    }
  }

  
  private setPageTitle(){
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de novo Lançanto'
    }else{
      const entryName = this.entry.name || '' // tratando quando o [this.entry.name] retornar null
      this.pageTitle = 'Editando lançamento: '+ entryName
    }
  }


  private createEntry(){
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionFormError(error)
      )

  }

  private updateEntry(){
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionFormError(error)
      )
  }

  private actionsForSuccess(entry: Entry){
    //Alerta da tela com o tastr
    toastr.success('Solicitação processada com sucesso!');

    //Ao termino do submit, eu redireciono para a url anterior;
    //Edepois redireciono para a o edit do objeto atual cadastrado
    // Com skipLocationChange eu elimino a possibilidade de retornar para a url anterior limpado a do hostirico de navegação
    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
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
