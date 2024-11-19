import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-acerca',
  standalone: true,
  imports: [MatCardModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './acerca.component.html',
  styleUrl: './acerca.component.scss'
})
export class AcercaComponent {

}
