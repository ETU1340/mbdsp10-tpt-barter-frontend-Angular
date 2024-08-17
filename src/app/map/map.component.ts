import { Component, AfterViewInit, Input ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { defaults as defaultControls } from 'ol/control';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
})
export class MapComponent implements AfterViewInit {
  @Input() postLocation!: [number, number]; // Format : [longitude, latitude]

  private map!: Map;

  ngAfterViewInit(): void {
    this.initMap();
  }
  initMap(): void {
    const postFeature = new Feature({
      geometry: new Point(fromLonLat(this.postLocation)),
    });

    const postLayer = new VectorLayer({
      source: new VectorSource({
        features: [postFeature],
      }),
      style: new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: 'blue' }),
          stroke: new Stroke({
            color: 'white',
            width: 5,
          }),
        }),
      }),
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        postLayer,
      ],
      view: new View({
        center: fromLonLat(this.postLocation),
        zoom: 12, // Ajustez le niveau de zoom ici
      }),
    });
  }
}
