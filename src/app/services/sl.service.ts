import { Injectable } from '@angular/core';
import { SLModel } from '../models/sl.model';
import { lexer } from '../functions/lexer';
import { parser } from '../functions/parser';
import { transformer } from '../functions/transformer';
import { generator } from '../functions/generator';

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
    this.SL.transformer = transformer;
    this.SL.generator = generator;
    this.SL.compile = (code) => {
      return this.SL.generator(this.SL.transformer(this.SL.parser(this.SL.lexer(code))));
    };
  }

  public compile(code: string) {
    return this.SL.compile(code);
  }
}
