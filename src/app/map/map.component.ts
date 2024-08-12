import { Component, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { latLng, tileLayer, marker, icon } from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [
    LeafletModule // Importer LeafletModule directement ici
  ]
})
export class MapComponent implements OnInit {
  lat = 51.673858;
  lng = 7.815982;
  zoom = 13;

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data © OpenStreetMap contributors'
      })
    ],
    zoom: this.zoom,
    center: latLng(this.lat, this.lng)
  };

  layers = [
    marker([this.lat, this.lng], {
      title: 'Localisation de Test',
      icon: icon({
        iconSize: [38, 38],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        iconUrl: 'assets/marker-icon.png', // Assurez-vous que ces fichiers sont accessibles
        shadowUrl: 'assets/marker-shadow.png'
      })
    })
  ];

  constructor() {}

  ngOnInit(): void {}
}
