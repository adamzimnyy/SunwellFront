import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Online} from "./online";
import "rxjs/add/operator/map";
import {Chart} from "chart.js";

import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  readonly ROOT_URL = 'https://sunwell-back.herokuapp.com/online';

  onlineObs: any;
  chart: [];

  constructor(private http: HttpClient, private router: Router) {
  }

  onSearch(nameIn: string, realmIn: string) {
    let nameCase = nameIn.charAt(0).toUpperCase() + nameIn.slice(1).toLowerCase();
    let realmCase = realmIn.charAt(0).toUpperCase() + realmIn.slice(1).toLowerCase();
    this.router.navigate(['/character', realmCase, nameCase])
  }

  ngOnInit() {
    this.getOnline().subscribe(res => {
      let feronis = res.map(response => response.feronis)
      let angrathar = res.map(response => response.angrathar)
      let total = res.map(response => response.angrathar + response.feronis)
      let dates = res.map(response => response.date)

      this.chart = new Chart('canvas', {
        type: 'line',

        data: {
          labels: dates,
          datasets: [{
            label: 'Feronis',
            data: feronis,
            borderColor: '#5ba2df',
            borderWidth: 3,
            backgroundColor: 'rgba(0, 0, 0,0)',
          }, {
            label: 'Angrathar',
            data: angrathar,
            borderColor: '#e2ac00',
            borderWidth: 3,
            backgroundColor: 'rgba(0, 0, 0,0)',
          }, {
            label: 'Total',
            data: total,
            borderColor: '#59b110',
            borderWidth: 3,
            backgroundColor: 'rgba(0, 0, 0,0)',
          },]
        },
        options: {
          elements: {point: {radius: 0}},
          maintainAspectRatio: false,
          responsive: true,
          tooltips: {
            enabled: false,
            mode: 'index',
            intersect: false,
          },
          legend: {
            display: true,
            labels: {
              usePointStyle: true,
            },
            position: 'top',
          },
          scales: {
            xAxes: [{
              display: true,
              ticks: {
                callback: function (value, index, values) {
                  return '';
                }
              },
              gridLines: {
                drawOnChartArea: false,
              }
            }],
            yAxes: [{
              display: true,
              color: "#00c03c",
              gridLines: {
                color: "#444444",
                ticks: {
                  min: 0,
                  stepSize: 100,
                  beginAtZero: true
                },
                drawOnChartArea: true,
              }
            }]
          }
        }
      })
    })
  }

  getOnline() {
    this.onlineObs = this.http.get(this.ROOT_URL).map(result => result);
    return this.onlineObs;
  }

}
