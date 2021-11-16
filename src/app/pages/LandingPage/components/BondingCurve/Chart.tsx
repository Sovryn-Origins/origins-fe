import React, { useMemo } from 'react';
import * as Highcharts from 'highcharts';
import highchartsBoost from 'highcharts/modules/boost';
import HighchartsReact from 'highcharts-react-official';
import cornerRightUpImg from 'assets/images/home/corner-right-up.svg';

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
  // const [x, setX] = useState(0);
  // const [mouseIn, setMouseIn] = useState(false);

  const tokenPrice = x => 0.3 * x ** 1.5;

  const tooltipFormatter = function (this: any) {
    // setX(this.x);
    return `
      <div>
        <span style="color: #00D786; font-size: 1.5rem;">\u25CF</span><span style="color: #8CB8D8;">Price:</span><br/>
        <span class="tw-font-inter tw-font-bold" style="font-size: 2rem; color: #fff;">
          ${tokenPrice(this.x).toFixed(1)} SOV
        </span><br/>
        <div style="display: flex;">
          <img src="${cornerRightUpImg}"  />
          <span style="color: #8CB8D8;">Supply :</span><span style="color: white;">
            ${this.x.toFixed(1)}k
          </span>
        </div>
      <div>
    `;
  };

  const options: Highcharts.Options = useMemo(() => {
    return {
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
          text: 'OG TOKEN SUPPLY(1=1 x 100)',
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
      plotOptions: {
        spline: {
          marker: {
            enabled: false,
          },
          // events: {
          //   mouseOver: () => {
          //     setMouseIn(true);
          //   },
          //   mouseOut: () => {
          //     console.log('[MouseOut]');
          //     setMouseIn(false);
          //   },
          // },
        },
        // line: {
        //   marker: {
        //     enabled: false,
        //   },
        // },
      },
      series: [
        {
          name: '',
          data: (function (n) {
            const yValues: Array<[number, number]> = [];
            for (let i = 0; i < n; i += 0.1) {
              yValues.push([i, tokenPrice(i)]);
            }
            return yValues;
          })(10),
          type: 'spline',
          color: '#17C3B2',
          className: 'tw-px-1 tw-py-3',
          showInLegend: false,
        },
        // {
        //   name: '',
        //   data: [
        //     [0, tokenPrice(x)],
        //     [x, tokenPrice(x)],
        //     [x, 0],
        //   ],
        //   type: 'line',
        //   color: mouseIn ? '#ff0000' : '#00ff00',
        //   lineWidth: 1,
        //   showInLegend: false,
        //   opacity: mouseIn ? 1 : 0,
        // },
      ],
      tooltip: {
        shared: true,
        backgroundColor: '#13222D',
        borderWidth: 0,
        borderRadius: 15,
        padding: 16,
        useHTML: true,
        formatter: tooltipFormatter,
      },
    };
  }, [tooltipFormatter]); // x, mouseIn,

  return (
    <div className="tw-max-w-2xl tw-mx-auto">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
