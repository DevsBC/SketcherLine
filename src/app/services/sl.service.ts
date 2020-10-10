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
      result.error = '';
      try {
        result.lexer = this.SL.lexer(this.getCopy(code));
      } catch (e) {
        result.lexer = e;
        result.error = 'lexer';
        result.parser = 'Error';
        result.transformer = 'Error';
        result.generator = 'Error';
        return result;
      }

      try {
        result.parser = this.SL.parser(this.getCopy(result.lexer));
      } catch (e) {
        result.parser = e;
        result.error = 'parser';
        result.transformer = 'Error';
        result.generator = 'Error';
        return result;
      }

      try {
        result.transformer = this.SL.transformer(this.getCopy(result.parser));
      } catch (e) {
        result.transformer = e;
        result.error = 'transformer';
        result.generator = 'Error';
        return result;
      }

      try {
        result.generator = this.SL.generator(this.getCopy(result.transformer));
      } catch (e) {
        result.generator = e;
        result.error = 'generator';
        return result;
      }
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

  public getSL() {
    return this.SL;
  }
}
