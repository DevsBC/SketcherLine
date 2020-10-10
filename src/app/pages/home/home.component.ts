import { Component, OnInit } from '@angular/core';
import { SlService } from '../../services/sl.service';
import * as mirror from 'codemirror';
import { transformer } from '../../functions/transformer';
import { generator } from '../../functions/generator';
import { SLModel } from '../../models/sl.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  code = '';
  result: any;
  options: any = {
    lineNumbers: true,
    readOnly: true,
    autoRefresh: true
  };
  lexer: any;
  parser: any;
  transformer: any;
  generator: any;
  sl: SLModel;
  optionsCode: any = {
    lineNumbers: true,
    value: '',
    autoRefresh: true  };

  constructor(private SL: SlService) { }

  ngOnInit(): void {
    this.SL.setSLObject();
    this.sl = this.SL.getSL();
    this.code = '// Comentario \n Paper 50 \n Pen 50 \n Line 0 50 100 50';
    this.compile();
  }

  public compile() {
    this.result = this.SL.compile(this.code);
    this.lexer = (!this.errors(this.result.lexer)) ? JSON.stringify(this.result.lexer, null, 2) : this.result.lexer.message;
    this.parser =  (!this.errors(this.result.parser)) ? JSON.stringify(this.result.parser, null, 2) : this.result.parser.message;
    this.transformer = (!this.errors(this.result.transformer)) ? JSON.stringify(this.result.transformer, null, 2) :
                      this.result.transformer.message;
    this.generator = this.result.generator;
    console.log(this.result);
  }

  private errors(t: any) {
    if (t) {
      if ( t instanceof Error) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  public getClass(t: any) {
    return (this.result.error !== t) ? 'message success' : 'message error';
  }

}
