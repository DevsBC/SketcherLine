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
      const result: any = {};
      result.lexer = this.SL.lexer(this.getCopy(code));
      result.parser = this.SL.parser(this.getCopy(result.lexer));
      result.transformer = this.SL.transformer(this.getCopy(result.parser));
      result.generator = this.SL.generator(this.getCopy(result.transformer));
      console.log(result);
      return result;
    };
  }

  public compile(code: string) {
    return this.SL.compile(code);
  }

  private getCopy(object) {
    return JSON.parse(JSON.stringify(object));
  }
}
