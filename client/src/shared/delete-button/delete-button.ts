import { Component, ElementRef, input, output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  imports: [],
  templateUrl: './delete-button.html',
  styleUrl: './delete-button.css'
})
export class DeleteButton {
  @ViewChild('deleteModalToggle') deleteModalToggle!: ElementRef<HTMLInputElement>;
  disabled = input<boolean>();
  clickEvent = output<Event>();

  openModal(){
    this.deleteModalToggle.nativeElement.checked = true;
  }

  closeModal(){
  this.deleteModalToggle.nativeElement.checked = false;
  }

  confirmDelete(event : Event){
    this.clickEvent.emit(event);
  }
}
