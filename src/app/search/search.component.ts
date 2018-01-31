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
  realm: string;
  onlineObs: any;
  chart: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  onSearch(nameIn: string, realmIn: string) {
    let nameCase = nameIn.charAt(0).toUpperCase() + nameIn.slice(1).toLowerCase();
    let realmCase = realmIn.charAt(0).toUpperCase() + realmIn.slice(1).toLowerCase();
    this.router.navigate(['/character', realmCase, nameCase])
  }

  ngOnInit() {
    this.getOnline().subscribe(res => {
      let feronisData = res.map(response => response.feronis)
      let angratharData = res.map(response => response.angrathar)
      let totalData = res.map(response => response.angrathar + response.feronis)
      let datesData = res.map(response => new Date(response.date))
      console.log(totalData);
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

      let data = {
        labels: formattedDates,
        datasets: [{
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
        let offset = 0;
        //adjust the offset left or right depending on the event position
        if (elements[0]._chart.width / 2 > position.x) {
          offset = 20;
        } else {
          offset = -20;
        }
        return {
          x: position.x + offset,
          y: elements[0]._chart.height - 50,//position.y
        }
      };

      let options = {
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
          backgroundColor: 'rgba(1,1,1,1)',
          intersect: false,
          yAlign: 'right',
          position: 'custom',
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
              margin: 80,
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
