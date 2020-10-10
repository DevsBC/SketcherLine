import { Component } from '@angular/core';
import { DatabaseService } from './services/database.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sketcher-line';

  constructor(private database: DatabaseService) {}
  public sendComments(value: any) {
    if (value !== ' ') {
        this.database.sendComments(value);
        Swal.fire({
          icon: 'success',
          title: 'Mensaje enviado',
          text: 'Gracias por tus comentarios!',
          footer: '<a href>He sido un mal estudiante?</a>'
        }).then( () => {
          window.location.reload();
        });
    }
  }
}
