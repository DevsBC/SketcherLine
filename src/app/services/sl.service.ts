import { Injectable } from '@angular/core';
import { SLModel } from '../models/sl.model';
import { lexer } from '../functions/lexer';
import { parser } from '../functions/parser';

@Injectable({
  providedIn: 'root'
})
export class SlService {

  SL = {} as SLModel;
  constructor() {}


  setSLObject() {
    this.SL = {} as SLModel;
    this.SL.lexer = lexer;
    this.SL.parser = parser;
    console.log(this.SL);
  }
}
