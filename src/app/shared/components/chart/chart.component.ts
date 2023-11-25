import { Component, OnInit } from '@angular/core';
import Chart, { TooltipItem } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  public chart: any;

  public dateNow = new Date().toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  ngOnInit(): void {
    this.createChart();
  }

  private createChart() {
    const legendMargin = {
      id: 'legendMargin',
      // TODO: calculate types for function parameters
      beforeInit(chart: any, legend: any, options: any) {
        const fitValue = chart.legend.fit;
        chart.legend.fit = function fit() {
          fitValue.bind(chart.legend)();
          return (this.height += 60);
        };
      },
    };

    const hoverLine = {
      id: 'hoverLine',
      // TODO: calculate types for function parameters
      afterDatasetsDraw(chart: any, args: any, plugins: any) {
        const {
          ctx,
          tooltip,
          chartArea: { top, bottom, left, right, width, height },
          scales: { x, y },
        } = chart;

        if (tooltip._active.length > 0) {
          const xCoordinate = x.getPixelForValue(
            tooltip.dataPoints[0].dataIndex
          );
          const yCoordinate = y.getPixelForValue(
            tooltip.dataPoints[0].parsed.y
          );
          ctx.save();
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#DFE0EB';
          ctx.moveTo(xCoordinate, yCoordinate + 12);
          ctx.lineTo(xCoordinate, bottom);
          ctx.stroke();
          ctx.closePath();
        }
      },
    };

    this.chart = new Chart('MyChart', {
      type: 'line',
      data: {
        labels: [
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
        ],
        datasets: [
          {
            label: 'Today',
            data: [
              '11',
              '20',
              '25',
              '30',
              '28',
              '32',
              '44',
              '51',
              '45',
              '25',
              '16',
              '17',
              '23',
              '35',
              '38',
              '44',
              '46',
              '44',
              '41',
              '38',
            ],
            backgroundColor: context => {
              const colors = [
                'rgba(55, 81, 255, 0.1)',
                'rgba(55, 81, 255, 0.05)',
                'rgba(55, 81, 255, 0)',
                'rgba(255,255,255, 0)',
              ];
              if (!context.chart.chartArea) {
                return;
              }
              const {
                ctx,
                data,
                chartArea: { left, right },
              } = context.chart;
              const gradientBg = ctx.createLinearGradient(left, 0, right, 0);
              gradientBg.addColorStop(0, colors[0]);
              gradientBg.addColorStop(0.5, colors[1]);
              gradientBg.addColorStop(0.75, colors[2]);
              gradientBg.addColorStop(1, colors[3]);
              return gradientBg;
            },
            pointRadius: 2,
            pointHitRadius: 5,
            pointHoverRadius: 10,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#3751FF',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#3751FF',
            pointHoverBorderWidth: 4,
            borderColor: '#3751FF',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Yesterday',
            data: [
              '32',
              '33',
              '30',
              '24',
              '24',
              '26',
              '28',
              '32',
              '33',
              '31',
              '26',
              '20',
              '17',
              '25',
              '39',
              '42',
              '35',
              '29',
              '30',
              '34',
            ],
            backgroundColor: '#DFE0EB',
            pointRadius: 2,
            pointHitRadius: 5,
            pointHoverRadius: 10,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#DFE0EB',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#DFE0EB',
            pointHoverBorderWidth: 4,
            borderColor: '#DFE0EB',
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        aspectRatio: 1.6,
        animations: {
          radius: {
            duration: 400,
            easing: 'linear',
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            type: 'linear',
            position: 'right',
            border: {
              display: false,
            },
            grid: {
              offset: false,
            },
            ticks: {
              align: 'end',
              padding: 10,
            },
          },
        },
        plugins: {
          legend: {
            align: 'end',
            labels: {
              font: {
                size: 12,
                weight: 'normal',
              },
              usePointStyle: true,
              pointStyle: 'line',
              pointStyleWidth: 16,
              padding: 32,
            },
          },
          title: {
            display: false,
            text: "Today's trends",
            color: '#252733',
            font: {
              size: 19,
              // family: 'tahoma',
              weight: 'bold',
            },
            align: 'start',
          },
          subtitle: {
            display: false,
            text: `as of ${new Date().toLocaleString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}`,
            color: '#9FA2B4',
            font: {
              size: 12,
              // family: 'tahoma',
              weight: 'normal',
            },
            padding: {
              bottom: 0,
            },
            align: 'start',
          },
          tooltip: {
            yAlign: 'bottom',
            displayColors: false,
            backgroundColor: '#fff',
            borderColor: '#DFE0EB',
            borderWidth: 1,
            titleColor: '#252733',
            titleAlign: 'center',
            titleMarginBottom: 0,
            titleFont: {
              size: 14,
              weight: '500',
            },
            padding: {
              top: 7,
              bottom: 5,
              left: 15,
              right: 15,
            },
            caretPadding: 15,
            callbacks: {
              title: (tooltipItems: TooltipItem<'line'>[]) => {
                return tooltipItems[0].formattedValue;
              },
              label: (tooltipItem: TooltipItem<'line'>) => {
                return '';
              },
            },
          },
        },
      },
      plugins: [hoverLine, legendMargin],
    });
  }
}
