import React from 'react';
import * as Highcharts from 'highcharts';
import highchartsBoost from 'highcharts/modules/boost';
import HighchartsReact from 'highcharts-react-official';

highchartsBoost(Highcharts);

export interface YAxisProps {
  suffix?: string;
  color?: string;
  x?: number;
  formatter?: Highcharts.AxisLabelsFormatterCallbackFunction;
}

export interface XAxisProps {
  y?: number;
  title?: string;
}

export const Chart: React.FC = () => {
  const tooltipFormatter = function (this: any) {
    const d = new Date(this.x);
    return `
      <div>
        <span style="color: #00D786; font-size: 1.5rem;">\u25CF</span><span style="color: #8CB8D8;">Price:</span><br/>
        <span class="tw-font-inter tw-font-bold" style="font-size: 2rem; color: #fff;">2.7 SOV</span><br/>
        <span style="color: #8CB8D8;">Supply :</span><span style="color: white;">6k</span>
      <div>
    `;
  };
  const options: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
    chart: {
      type: 'spline',
      plotBorderColor: '#ccc',
      plotBorderWidth: 2,
      events: {
        load: function () {
          this.renderer
            .text('0.300 SOV', 100, 75)
            .attr({
              fill: '#000',
            })
            .css({
              fontSize: '2.875rem',
              fontWeight: '300',
              fontFamily: 'Rowdies',
            })
            .add();

          this.renderer
            .text('per OG Token', 100, 100)
            .css({
              fontSize: '1rem',
              fontWeight: '500',
              fontFamily: 'Iner',
              color: '#17C3B2',
            })
            .add();
        },
      },
    },
    xAxis: {
      title: {
        text: 'OG TOKEN SUPPLY',
        style: {
          color: '#000000',
          fontFamily: 'Rowdies',
          fontSize: '1.125rem',
          marginTop: '2rem',
        },
      },
      tickInterval: 1,
      gridLineColor: 'transparent',
    },
    yAxis: {
      title: {
        text: 'TOKEN PRICE IN SOV',
        style: {
          color: '#000000',
          fontFamily: 'Rowdies',
          fontSize: '1.125rem',
          marginTop: '2rem',
        },
      },
      tickInterval: 1,
      gridLineColor: 'transparent',
    },
    series: [
      {
        name: '',
        data: [1, 2, 3].map(i => [i, i * i]),
        type: 'spline',
        color: '#17C3B2',
        className: 'tw-px-1 tw-py-3',
        showInLegend: false,
      },
    ],
    tooltip: {
      shared: true,
      backgroundColor: '#13222D',
      borderWidth: 0,
      borderRadius: 15,
      padding: 16,
      formatter: tooltipFormatter,
    },
  };

  return (
    <div className="tw-max-w-2xl tw-mx-auto">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
