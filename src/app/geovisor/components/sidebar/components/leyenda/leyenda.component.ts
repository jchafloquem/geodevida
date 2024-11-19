import {Component, inject, OnInit} from '@angular/core';
import {GeovisorSharedService} from '../../../../services/geovisor.service';

@Component({
	selector: 'app-leyenda',
	standalone: true,
	imports: [],
	templateUrl: './leyenda.component.html',
	styleUrl: './leyenda.component.scss',
})
export class LeyendaComponent implements OnInit {
	public _geovisorSharedService = inject(GeovisorSharedService);
	public legend!: any;

	ngOnInit(): void {
		this.createLegend();
	}
	createLegend(): void {
		setTimeout(() => {
			this.legend = this._geovisorSharedService.legend;
			if (this.legend) {
				const legendContainer = document.getElementById('legend-container');
				legendContainer?.appendChild(this.legend.container);
			}
		}, 100);
	}
}
