import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import * as d3 from 'd3';
import styles from './index.module.scss';
import cornerRightUpImg from 'assets/images/home/corner-right-up.svg';
import {
  D3Selection,
  IDimension,
  ITooltip,
  IPadding,
  PositionArray,
  LinerScale,
} from './types';

interface IProps {
  className?: string;
}

class Graphic {
  m = 0.000014999999999999999;
  n = 1.5;
  xDomain = 200;
  container: SVGSVGElement;
  dimension: IDimension;
  svg: D3Selection;

  padding: IPadding = {
    top: 20,
    left: 85,
    bottom: 60,
    right: 20,
  };

  tooltip: ITooltip = {
    triangle: {
      width: 10,
      height: 15,
    },
    rect: {
      width: 170,
      height: 100,
    },
    padding: {
      left: 16,
      right: 16,
      top: 12,
      bottom: 14,
    },
    font: {
      small: 12,
      large: 28,
    },
    radius: 5,
  };

  constructor(container) {
    this.container = container;
    this.svg = d3.select(container);
    this.dimension = {
      width: parseInt(this.svg.style('width'), 10),
      height: parseInt(this.svg.style('height'), 10),
    };
  }

  getValue(x) {
    return this.m * x ** this.n;
  }

  draw() {
    const { width, height } = this.dimension;

    const svg = this.svg;
    const bootstrapPrice = 0.015;
    const finalPrice = 0.0173053459948075;

    const initialSupply = 100;

    const xDomain = this.xDomain;
    const yDomain = Math.max(this.getValue(xDomain), finalPrice);
    const pointNum = 500;

    // clear
    svg.selectAll('*').remove();

    let xTemp: number, yTemp: number;

    // Generate points of
    let dataset: Array<[number, number]> = [];
    for (let i = 0; i <= pointNum; i++) {
      xTemp = (xDomain / pointNum) * i;
      yTemp = this.getValue(xTemp);
      dataset.push([xTemp, yTemp]);
    }

    let xScale = d3.scaleLinear(
      [0, xDomain],
      [this.padding.left, width - this.padding.right],
    );
    let yScale = d3.scaleLinear(
      [yDomain, 0],
      [this.padding.top, height - this.padding.bottom],
    );

    // draw outline
    svg
      .append('rect')
      .attr('x', this.padding.left)
      .attr('y', this.padding.top)
      .attr('width', width - this.padding.right - this.padding.left)
      .attr('height', height - this.padding.top - this.padding.bottom)
      .attr('fill', 'none')
      .attr('stroke-width', 1.792)
      .attr('stroke', '#DBDBDB');

    const line = d3
      .line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    svg
      .append('path')
      .datum(dataset)
      .attr('clip-path', 'url(#chart-area)')
      .attr('fill', 'none')
      .attr('stroke', '#17C3B2')
      .attr('stroke-width', 2)
      .attr('d', line);

    let xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10).ticks(8);
    let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(10);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height - this.padding.bottom})`)
      .attr('color', '#000')
      .style('font-size', 14)
      .style('font-family', 'Roboto')
      .call(xAxis)
      .select('.domain')
      .remove()
      .selectAll('.tick');

    svg
      .append('g')
      .attr('transform', `translate(${this.padding.left},0)`)
      .attr('color', '#000')
      .style('font-size', 14)
      .style('font-family', 'Roboto')
      .style('font-weight', 'normal')
      .call(yAxis)
      .select('.domain')
      .remove();

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .style('text-transform', 'uppercase')
      .text('OG Token Supply (in Millions)');

    svg
      .append('text')
      .attr('transform', `rotate(270)`)
      .attr('transform-origin', '0 0')
      .attr('font-family', 'Rowdies')
      .attr('font-size', 18)
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('text-transform', 'uppercase')
      .text('TOKEN PRICE IN SOV');

    // bootstrap price line
    svg
      .append('svg:line')
      .attr('id', 'initial-supply-line-x')
      .attr('x1', this.padding.left)
      .attr('x2', xScale(xDomain))
      .attr('y1', yScale(this.getValue(initialSupply)))
      .attr('y2', yScale(this.getValue(initialSupply)))
      .style('stroke', 'rgb(50, 50, 189)')
      .style('stroke-dasharray', '6,3');

    // bootstrap supply line
    svg
      .append('svg:line')
      .attr('x1', xScale(initialSupply))
      .attr('x2', xScale(initialSupply))
      .attr('y1', height - this.padding.bottom)
      .attr('y2', yScale(this.getValue(initialSupply)))
      .style('stroke', 'rgb(50, 50, 189)')
      .style('stroke-dasharray', '6,3');

    // bootstrap point
    svg
      .append('circle')
      .attr('cx', xScale(initialSupply))
      .attr('cy', yScale(this.getValue(initialSupply)))
      .attr('r', 4)
      .style('stroke', '#663399')
      .style('fill', '#50FF70');

    svg
      .append('text')
      .attr('x', width - this.padding.right - 100)
      .attr('y', yScale(bootstrapPrice) - 10)
      .attr('text-anchor', 'end')
      .text('Bootstrap price: ' + bootstrapPrice);

    const tooltip = this.addTooltip();

    const bisect = mx => {
      const bisectA = d3.bisector((d: [number, number]) => d[0]).left;
      const x = xScale.invert(mx);
      const index = bisectA(dataset, x, 1);
      const a = dataset[index - 1];
      const b = dataset[index];
      return b && x - a[0] > b[0] - x ? b : a;
    };

    svg
      .on('touchmove mousemove', event => {
        const pos = d3.pointer(event, this.container);
        const coordinate = bisect(pos[0]);

        this.updateTooltip(
          tooltip,
          {
            mousePosition: pos,
            coordinate,
          },
          { xScale, yScale },
        );
      })
      .on('mouseout', event => {
        const [mx, my] = d3.pointer(event, this.container);

        if (
          mx >= this.padding.left &&
          mx <= width - this.padding.right &&
          my >= this.padding.top &&
          my <= height - this.padding.bottom
        ) {
          return;
        }

        tooltip.style('display', 'none');
        this.svg.select('#guide-line-x').style('display', 'none');
        this.svg.select('#guide-line-y').style('display', 'none');
      });
  }

  addTooltip(): D3Selection {
    const { rect, triangle, padding, radius, font } = this.tooltip;

    // guide lines
    this.svg
      .append('svg:line')
      .attr('id', 'guide-line-x')
      .style('stroke', 'rgb(50, 50, 189)')
      .style('stroke-dasharray', '6,3');

    this.svg
      .append('svg:line')
      .attr('id', 'guide-line-y')
      .style('stroke', 'rgb(50, 50, 189)')
      .style('stroke-dasharray', '6,3');

    const tooltip = this.svg
      .append('g')
      .attr('id', 'tooltip')
      .style('display', 'none');

    tooltip
      .append('circle')
      .attr('id', 'top-circle')
      .attr('fill', '#17C3B2')
      .attr('fill-opacity', 0.48)
      .attr('stroke-width', 2)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius);

    tooltip
      .append('polygon')
      .attr(
        'points',
        `0,0 -${triangle.width / 2},
        -${triangle.height},
        ${triangle.width / 2},
        -${triangle.height}`,
      )
      .attr('id', 'polygon')
      .style('fill', '#13222D');

    tooltip
      .append('rect')
      .attr('id', 'tooltip-rect')
      .attr('fill', '#13222D')
      .attr('stroke', '#13222D')
      .attr('x', -(rect.width / 2))
      .attr('width', rect.width)
      .attr('height', rect.height)
      .attr('rx', 8)
      .attr('ry', 8);

    tooltip
      .append('circle')
      .attr('id', 'tooltip-price-circle')
      .attr('cx', -(rect.width / 2 - padding.left - radius))
      .attr('r', radius)
      .attr('stroke', '#00D786')
      .attr('fill', '#00D786')
      .attr('stroke-width', 2);

    tooltip
      .append('text')
      .attr('id', 'tooltip-label-price')
      .attr('x', -(rect.width / 2 - padding.left - radius * 2 - font.small / 2))
      .attr('text-anchor', 'start')
      .style('fill', '#8CB8D8')
      .style('font-size', font.small)
      .style('font-weight', 500)
      .style('font-family', 'Inter, sans-serif')
      .text('Price:');

    tooltip
      .append('image')
      .attr('id', 'tooltip-arrow')
      .attr('xlink:href', cornerRightUpImg)
      .attr('x', -(rect.width / 2 - padding.left));

    tooltip
      .append('text')
      .attr('id', 'tooltip-supply')
      .attr('x', -(rect.width / 2 - padding.left - font.small))
      .attr('text-anchor', 'start')
      .style('fill', '#8CB8D8')
      .style('font-size', font.small)
      .text('Supply:');

    tooltip
      .append('text')
      .attr('id', 'tooltip-supply-amt')
      .attr('x', -10)
      .attr('text-anchor', 'start')
      .style('fill', '#fff')
      .style('font-size', font.small)
      .style('font-weight', 'bold')
      .text('6k');

    tooltip
      .append('text')
      .attr('id', 'tooltip-sov-amount')
      .attr('x', -(rect.width / 2 - padding.left))
      .attr('text-anchor', 'start')
      .style('fill', '#fff')
      .style('font-size', font.large)
      .style('font-weight', 600)
      .style('font-family', 'Inter, sans-serif')
      .text('2.7 SOV');

    return tooltip;
  }

  updateTooltip(
    tooltip: D3Selection,
    {
      mousePosition,
      coordinate,
    }: { mousePosition: PositionArray; coordinate: PositionArray },
    { xScale, yScale }: { xScale: LinerScale; yScale: LinerScale },
  ) {
    const { rect, triangle, padding, font } = this.tooltip;
    const [mx] = mousePosition;
    const [x, y] = coordinate;
    const { width, height } = this.dimension;

    // positioning
    const limitCoord = {
      x: width - rect.width / 2,
      y: this.padding.top + rect.height + triangle.height,
    };

    const myForMx = yScale(this.getValue(x));
    const isUpside = myForMx >= limitCoord.y;
    const delX = Math.abs(
      Math.min(0, limitCoord.x - Math.min(mx, width - this.padding.right)),
    );

    tooltip
      .attr('transform', `translate(${xScale(x) - delX},${yScale(y)})`)
      .style('display', 'unset');

    tooltip.select('#top-circle').attr('cx', delX);

    tooltip.select('#polygon').attr(
      'points',
      `${delX},0 ${delX - triangle.width / 2},
        ${-triangle.height * (isUpside ? 1 : -1)},
        ${delX + triangle.width / 2},
        ${-triangle.height * (isUpside ? 1 : -1)}`,
    );

    tooltip
      .select('#tooltip-rect')
      .attr('y', isUpside ? -(rect.height + triangle.height) : triangle.height);

    tooltip
      .select('#tooltip-price-circle')
      .attr(
        'cy',
        isUpside
          ? -(rect.height + triangle.height - padding.top - font.small / 2)
          : triangle.height + padding.top + font.small / 2,
      );
    tooltip
      .select('#tooltip-label-price')
      .attr(
        'y',
        isUpside
          ? -(rect.height + triangle.height - padding.top - font.small)
          : triangle.height + padding.top + font.small,
      );

    tooltip
      .select('#tooltip-arrow')
      .attr(
        'y',
        isUpside
          ? -(triangle.height + padding.bottom + 9)
          : triangle.height + rect.height - padding.bottom - 10,
      );

    tooltip
      .select('#tooltip-supply')
      .attr(
        'y',
        isUpside
          ? -(triangle.height + padding.bottom)
          : triangle.height + rect.height - padding.bottom,
      );

    tooltip
      .select('#tooltip-supply-amt')
      .attr('x', -10)
      .attr(
        'y',
        isUpside
          ? -(triangle.height + padding.bottom)
          : triangle.height + rect.height - padding.bottom,
      )
      .text(`${x.toFixed()}m`);

    tooltip
      .select('#tooltip-sov-amount')
      .text(`${y.toFixed(3)} SOV`)
      .attr(
        'y',
        isUpside
          ? -(
              triangle.height +
              rect.height -
              padding.top -
              font.small -
              font.large -
              8
            )
          : triangle.height + padding.top + font.small + 8 + font.large,
      );

    // guide lines
    const limitedMx = Math.min(mx, width - this.padding.right);
    this.svg
      .select('#guide-line-x')
      .attr('x1', this.padding.left)
      .attr('y1', myForMx)
      .attr('x2', Math.max(limitedMx, this.padding.left))
      .attr('y2', myForMx)
      .style('display', 'unset');

    this.svg
      .select('#guide-line-y')
      .attr('x1', limitedMx)
      .attr('y1', height - this.padding.bottom)
      .attr('x2', limitedMx)
      .attr('y2', myForMx)
      .style('display', 'unset');

    // initial supply price line
    this.svg
      .select('#initial-supply-line-x')
      .attr('x2', x < 100 ? xScale(100) : xScale(this.xDomain));
  }
}

export const ChartD3: React.FC<IProps> = ({ className }) => {
  const canvasRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const graphic = new Graphic(canvasRef.current);
    graphic.draw();
  }, [canvasRef.current?.clientHeight, canvasRef.current?.clientWidth]);

  return (
    <div className={classNames('tw-max-w-2xl tw-mx-auto', className)}>
      <svg ref={canvasRef} className={styles.canvas}></svg>
    </div>
  );
};
