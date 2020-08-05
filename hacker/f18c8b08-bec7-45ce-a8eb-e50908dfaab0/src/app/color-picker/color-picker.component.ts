import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  @Input() colorOptions: string[];
  @Input() initialColor: string;
  selectedColor : string;

  ngOnInit(): void {
  }
  changeColor(color: string){
    this.selectedColor = color;

  }


}
