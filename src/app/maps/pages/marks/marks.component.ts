import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';



interface Mark {
  mark  ?: mapboxgl.Marker;
  color ?: string;
  center?: [number, number];
}

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styles: [`
    .map-container{
      width : 100%;
      height: 100%;
    }

    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index:99;
    }

    li{
      cursor: pointer;
    }
  
  `
  ]
})
export class MarksComponent implements AfterViewInit{

  @ViewChild('map') divMap!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-83.34018227659433, 10.085698607701968];

  // Array of marks
  marks: Mark[] = [];
 
  constructor() { }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });

      this.readlocalStorage();
    
    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola mundo';
    // const maker = new mapboxgl.Marker({
    //   element: markerHtml
    // })
    //   .setLngLat(this.center)
    //   .addTo(this.map);


    
  }
  addMark(){
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const newMark = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat(this.center)
      .addTo(this.map);
    // tslint:disable-next-line: new-parens
    this.marks.push({
      mark: newMark,
      color
    });
    this.addLocalStorage();
    newMark.on('dragend', () => {
      this.addLocalStorage();
    });
    
  }

  goMark( marker: Mark ): void{
    this.map.flyTo({
      center: marker.mark!.getLngLat()
    });
  }


  addLocalStorage(){
    const lngLatArr: Mark[] = [];


    this.marks.forEach( m => {
      const {lng, lat} = m.mark!.getLngLat();
      const color = m.color;

      lngLatArr.push({
        color,
        center: [lng, lat]
      });

      localStorage.setItem('marks', JSON.stringify(lngLatArr));
      
    });
  }

  readlocalStorage(){
    if ( !localStorage.getItem('marks') ){return;}

    const lngLatArr: Mark[] = JSON.parse(localStorage.getItem('marks')!);

    lngLatArr.forEach( m => {
      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color : m.color
      })
        // tslint:disable-next-line: no-non-null-assertion
        .setLngLat(m.center!)
        .addTo(this.map);

      this.marks.push({
        mark : newMarker,
        color: m.color
      });
      newMarker.on('dragend', () => {
        this.addLocalStorage();
      });
    });

    

  }

  deleteMark( i: number ){
    this.marks[i].mark?.remove();
    this.marks.splice(i, 1);
    this.addLocalStorage();
  }

}
