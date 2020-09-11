import { Component, OnInit } from '@angular/core';
import { SlService } from '../../services/sl.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private SL: SlService) { }

  ngOnInit(): void {
    this.SL.setSLObject();
    // const token = this.SL.lexer(code);
  }

}
