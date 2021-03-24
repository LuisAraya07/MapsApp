import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .map-container{
      width : 100%;
      height: 100%;
    }


    .row{
      background-color: white;
      left: 50px;
      border-radius: 5px;
      padding:10px;
      bottom: 50px;
      position: fixed;
      z-index: 999;
      width: 400px;
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-83.34018227659433, 10.085698607701968];
 
 
 
  constructor() { }

  // destruimos cada uno de los listener
  ngOnDestroy(): void {
    this.map.off('zoom', () => {});
    this.map.off('zoomend', () => {});
    this.map.off('move', () => {});
    }


  

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });


    this.map.on('zoom', (ev) => {
      this.zoomLevel = this.map.getZoom();
    });
    this.map.on('zoomend', (ev) => {
      if( this.map.getZoom() > 18){
        this.map.zoomTo( 18 );
      }
    });

    this.map.on('move', (ev) => {
      const target = ev.target;
      const {lng, lat} = target.getCenter();
      this.center = [lng, lat];
    });
  }


  zoomOut(): void{
    this.map.zoomOut();

  }


  zoomIn(): void{
    this.map.zoomIn();

  }

  zoomChange( value: string ){
    this.map.zoomTo( Number(value) );
  }

}
