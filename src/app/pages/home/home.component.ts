import { Component, OnInit } from '@angular/core';
import { SlService } from '../../services/sl.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  code: string;
  result: any;
  constructor(private SL: SlService) { }

  ngOnInit(): void {
    this.SL.setSLObject();
    // const token = this.SL.lexer(code);
  }

  public compile() {
    this.code = '// Comment \n Paper 95 \n Pen 1 \n Line 50 15 85 80 \n';
    this.result = this.SL.compile(this.code);
    console.log(this.result);
  }

}
