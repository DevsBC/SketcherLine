import { Component, OnInit } from '@angular/core';
import { SlService } from '../../services/sl.service';
import * as mirror from 'codemirror';

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
  t: any;

  optionsCode: any = {
    lineNumbers: true,
    value: '// Comentario\nPaper 50\nPen 100\nLine 0 50 100 50\n',
    autoRefresh: true  };

  constructor(private SL: SlService) { }

  ngOnInit(): void {
    this.SL.setSLObject();
    this.code = '// Comentario\nPaper 50\nPen 100\nLine 0 50 100 50\n';
    this.compile();
  }

  public compile() {
    this.result = this.SL.compile(this.code);
    this.t = JSON.stringify(this.result.lexer, null, 2);
  }

}
