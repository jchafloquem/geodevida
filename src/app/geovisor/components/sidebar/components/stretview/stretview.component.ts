import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from "@angular/google-maps";

@Component({
  selector: 'app-stretview',
  imports: [CommonModule,GoogleMapsModule],
  templateUrl: './stretview.component.html',
  styleUrl: './stretview.component.scss'
})
export class StretviewComponent implements OnInit {
	public apiLoaded = false;
	public options: google.maps.MapOptions = {
    center: { lat: -10, lng: -74 },
    zoom: 6,
    mapTypeId: 'hybrid',
  };
	ngOnInit(): void {
		this.apiLoaded = true;
	}

}
