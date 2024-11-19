import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeovisorComponent } from './geovisor.component';

describe('GeovisorComponent', () => {
  let component: GeovisorComponent;
  let fixture: ComponentFixture<GeovisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeovisorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeovisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
