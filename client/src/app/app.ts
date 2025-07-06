import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  protected title = 'Recipe App';
  protected users = signal<any>([]);

  async ngOnInit() {
    this.users.set(await this.getUsers())
  }

  async getUsers(){
    try{
      return lastValueFrom(this.http.get('https://localhost:5034/api/account'));
    } catch(error){
      console.log(error);
      throw error;
    }
  }
}
