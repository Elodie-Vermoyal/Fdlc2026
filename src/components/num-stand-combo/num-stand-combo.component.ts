import { Component, OnInit, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from "rxjs";
import { FormsModule } from '@angular/forms';

import { LieuService } from '../../servcies/lieu.service';
import { Lieu } from "../../modeles/Lieu";

import {
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
} from '@ionic/angular';

@Component({
  selector: 'app-num-stand-combo',
  templateUrl: './num-stand-combo.component.html',
  styleUrls: ['./num-stand-combo.component.scss'],
  imports: [
    IonInput,
    IonList,
    IonItem,
    IonCard,
    IonCardContent,
    AsyncPipe,
    FormsModule
  ],
})
export class NumStandComboComponent implements OnInit
{
  protected listeLieux: Observable<Array<Lieu>> | null = null;
  protected serviceLieu: LieuService;

  protected num: string = "";
  protected showList = signal(false);

  public label = input("N° de stand");
  public typeLieu = input("");
  public onNumSelected = output<string>();

  constructor( serviceLieu: LieuService )
  {
    this.serviceLieu = serviceLieu;
  }

  ngOnInit()
  {
    this.listeLieux = this.serviceLieu.getTousLesLieux( "", this.typeLieu(), "" );
  }

  // Rafraîchit la liste à chaque frappe (numéros qui commencent par la saisie)
  onNumChanged( event: any )
  {
    this.listeLieux = this.serviceLieu.getTousLesLieux( "", this.typeLieu(), this.num );
    this.showList.set( true );
    this.onNumSelected.emit( this.num );
  }

  onClickNumSelected( num: number )
  {
    this.showList.set( false );
    this.num = String( num );
    this.onNumSelected.emit( this.num );
  }

  onInputClick( event: MouseEvent )
  {
    this.showList.set( !this.showList() );
  }

  masqueListe()
  {
    this.showList.set( false );
  }
}
