import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
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

  realm = "Feronis";
  onlineObs: any;
  chart: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  onSearch(name) {
    let nameCase = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    this.router.navigate(['/character', this.realm, nameCase])
  }

  changeRealm() {
    if (this.realm == 'Feronis')
      this.realm = 'Angrathar';
    else this.realm = 'Feronis';
  }

  ngOnInit() {
    this.getOnline().subscribe(res => {
      let feronisData = res.map(response => response.feronis);
      let angratharData = res.map(response => response.angrathar);
      let totalData = res.map(response => response.angrathar + response.feronis);
      let datesData = res.map(response => new Date(response.date));
      let formattedDates = [];
      datesData.forEach((res) => {
        let date = res.toLocaleTimeString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        formattedDates.push(date)
      });


      console.log(formattedDates);
      console.log(feronisData);

      let colors = ['#5ba2df', '#e2ac00', '#59b110'
      ];

      let data = {
        labels: formattedDates,

        datasets: [{
          spanGaps: false,
          pointStyle: 'circle',
          label: 'Feronis',
          data: feronisData,
          borderColor: '#5ba2df',
          borderWidth: 3,
          backgroundColor: 'rgba(0, 0, 0,0)',
        }, {
          label: 'Angrathar',
          data: angratharData,
          borderColor: '#e2ac00',
          borderWidth: 3,
          backgroundColor: 'rgba(0, 0, 0,0)',
        }, {
          label: 'Total',
          data: totalData,
          borderColor: '#59b110',
          borderWidth: 3,
          backgroundColor: 'rgba(0, 0, 0,0)',
        },]
      };

      Chart.Tooltip.positioners.custom = function (elements, position) {
        if (!elements.length) {
          return false;
        }
        return {
          x: position.x,
          y: elements[0]._chart.height - 40,
        }
      };

      let options = {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 80
          }
        },
        elements: {
          point: {
            radius: 0,
            hoverRadius: 5,
          }
        },
        hover: {
          mode: 'index',
          intersect: false
        },
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
          enabled: true,
          mode: 'index',
          backgroundColor: 'rgba(1,1,1,0)',
          intersect: false,
          yAlign: 'right',
          position: 'custom',
          callbacks: {
            labelColor: function (tooltipItem, chart) {
              return {
                borderColor: colors[tooltipItem.datasetIndex],
                backgroundColor: colors[tooltipItem.datasetIndex],
              }
            },
          },
        },
        legend: {
          display: true,
          labels: {
            usePointStyle: true,
          },
          position: 'top',
          padding: 20,
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                'minute': 'HH:mm',
                'hour': 'HH:mm',
                'day': 'dddd',
                'week': 'MMM DD',
                'month': 'MMM DD',
              }
            },
            display: true,
            ticks: {
              /*  callback: function (value, index, values) {
               return '';
               }*/
            },
            gridLines: {
              drawOnChartArea: false,
            }
          }],
          yAxes: [{
            display: true,
            ticks: {
              min: 0,
              beginAtZero: true,
              padding: 5,
            },
            gridLines: {
              color: "#444444",

              drawOnChartArea: true,
            }
          }]
        }
      };


      this.chart = new Chart('canvas', {
        type: 'line',
        responsive: true,
        data: data,
        options: options
      })
    })
  }

  getOnline() {
    this.onlineObs = this.http.get(this.ROOT_URL).map(result => result);
    return this.onlineObs;
  }

}
