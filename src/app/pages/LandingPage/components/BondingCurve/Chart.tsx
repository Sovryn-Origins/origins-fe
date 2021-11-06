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
        showInLegend: false,
      },
    ],
  };

  return (
    <div className="tw-max-w-2xl tw-mx-auto">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
