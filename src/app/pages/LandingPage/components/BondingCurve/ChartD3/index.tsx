import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import * as d3 from 'd3';
import styles from './index.module.scss';
import cornerRightUpImg from 'assets/images/home/corner-right-up.svg';

interface IProps {
  className?: string;
}

interface IDimension {
  width: number;
  height: number;
}

class Graphic {
  container: SVGSVGElement;
  dimension: IDimension;
  svg: d3.Selection<any, unknown, null, undefined>;

  constructor(container) {
    this.container = container;
    this.dimension = {
      width: parseInt(d3.select(container).style('width'), 10),
      height: parseInt(d3.select(container).style('height'), 10),
    };
    this.svg = d3.select(this.container);
  }

  draw() {
    console.log('[Draw] implement it!');

    const { width, height } = this.dimension;
    const padding = 10;
    const paddingLeft = 80;
    const paddingBottom = 60;
    const svg = this.svg;
    const m = 0.000014999999999999999;
    // const RR = 0.4;
    const n = 1.5;
    const bootstrapPrice = 0.015;
    const finalPrice = 0.0173053459948075;
    const bootstrapOG = 60;

    // const initialSupply = 100;
    const totalMinted = 110;
    const maxMinted = Math.max(totalMinted, bootstrapOG);
    const maxMintedMargin = maxMinted * (1.01 + (0.2 - maxMinted / 1000));

    const xDomain = maxMintedMargin;
    const yDomain = Math.max(m * maxMintedMargin ** n, finalPrice);
    const pointNum = 500;

    // clear
    svg.selectAll('*').remove();

    let xTemp: number, yTemp: number;

    // Generate points of
    let dataset: Array<[number, number]> = [];
    for (let i = 0; i <= pointNum; i++) {
      xTemp = (xDomain / pointNum) * i;
      yTemp = m * xTemp ** n;
      dataset.push([xTemp, yTemp]);
    }

    let xScale = d3.scaleLinear([0, xDomain], [paddingLeft, width - padding]);
    let yScale = d3.scaleLinear(
      [yDomain, 0],
      [padding, height - paddingBottom],
    );

    // draw outline
    svg
      .append('rect')
      .attr('x', paddingLeft)
      .attr('y', padding)
      .attr('width', width - padding - paddingLeft)
      .attr('height', height - padding - paddingBottom)
      .attr('fill', 'none')
      .attr('stroke-width', 1.792)
      .attr('stroke', '#DBDBDB');

    svg
      .append('text')
      .attr('id', 'sov-per-og-token')
      .attr('x', 100)
      .attr('y', 100)
      .attr('text-anchor', 'start')
      .style('fill', '#000')
      .style('font-size', 46)
      .style('font-weight', 300)
      .style('font-family', 'Rowdies')
      .text('0.300 SOV');

    svg
      .append('text')
      .attr('id', 'sov-per-og-token')
      .attr('x', 100)
      .attr('y', 125)
      .attr('text-anchor', 'start')
      .style('fill', '#17C3B2')
      .style('font-size', 16)
      .style('font-weight', 500)
      .style('font-family', 'Inter')
      .text('per OG Token');

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

    let xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10);
    let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(10);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height - paddingBottom})`)
      .attr('color', '#000')
      .style('font-size', 14)
      .style('font-family', 'Roboto')
      .call(xAxis)
      .select('.domain')
      .remove()
      .selectAll('.tick');

    svg
      .append('g')
      .attr('transform', `translate(${paddingLeft},0)`)
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
      .text('OG TOKENS SUPPLY(1=1x100)');

    svg
      .append('text')
      .attr('transform', `rotate(270)`)
      .attr('transform-origin', '0 0')
      .attr('font-family', 'Rowdies')
      .attr('font-size', 18)
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .text('TOKEN PRICE IN SOV');

    // bootstrap price line
    svg
      .append('svg:line')
      .attr('x1', paddingLeft)
      .attr('x2', xScale(xDomain))
      .attr('y1', yScale(bootstrapPrice))
      .attr('y2', yScale(bootstrapPrice))
      .style('stroke', 'rgb(50, 50, 189)')
      .style('stroke-dasharray', '6,3');

    // bootstrap supply line
    svg
      .append('svg:line')
      .attr('x1', xScale(bootstrapOG))
      .attr('x2', xScale(bootstrapOG))
      .attr('y1', height - paddingBottom)
      .attr('y2', yScale(bootstrapPrice))
      .style('stroke', 'rgb(50, 50, 189)')
      .style('stroke-dasharray', '6,3');

    svg
      .append('text')
      .attr('x', width - padding - 100)
      .attr('y', yScale(bootstrapPrice) - 10)
      .attr('text-anchor', 'end')
      .text('Bootstrap price: ' + bootstrapPrice);

    // bootstrap point
    svg
      .append('circle')
      .attr('cx', xScale(bootstrapOG))
      .attr('cy', yScale(bootstrapPrice))
      .attr('r', 4)
      .style('stroke', '#663399')
      .style('fill', '#50FF70');

    // bootstrap price line
    svg
      .append('svg:line')
      .attr('x1', paddingLeft)
      .attr('x2', xScale(totalMinted))
      .attr('y1', yScale(finalPrice))
      .attr('y2', yScale(finalPrice))
      .style('stroke', 'rgb(50, 50, 189)')
      .style('stroke-dasharray', '6,3');

    // bootstrap supply line
    svg
      .append('svg:line')
      .attr('x1', xScale(totalMinted))
      .attr('x2', xScale(totalMinted))
      .attr('y1', height - paddingBottom)
      .attr('y2', yScale(finalPrice))
      .style('stroke', 'rgb(50, 50, 189)')
      .style('stroke-dasharray', '6,3');

    // bonding curve last point
    svg
      .append('circle')
      .attr('cx', xScale(totalMinted))
      .attr('cy', yScale(finalPrice))
      .attr('r', 4)
      // .style('stroke', '#663399')
      .style('fill', '#17c3b2')
      .style('fill-opacity', 0.4);

    svg
      .append('text')
      .attr('x', xScale(totalMinted) + 10)
      .attr('y', yScale(finalPrice) - 10)
      .attr('text-anchor', 'end')
      .text(
        'Rate at OG ' +
          totalMinted +
          'M total supply: ' +
          finalPrice.toFixed(5),
      );

    const tooltip = this.addTooltip();

    const callout = (g, value: { x: number; y: number }) => {
      const { x, y } = value;

      tooltip.attr('transform', `translate(${xScale(x)},${yScale(y)})`);
      if (!value) return g.style('display', 'none');

      g.style('display', null)
        .style('pointer-events', 'none')
        .style('font', '10px sans-serif');
    };

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
        const [x, y] = bisect(d3.pointer(event, this.container)[0]);

        tooltip
          .attr('transform', `translate(${xScale(x)},${yScale(y)})`)
          .style('display', 'unset')
          .call(callout, { x, y });
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });
  }

  addTooltip(): d3.Selection<any, unknown, null, undefined> {
    // this.svg.selectAll('#tooltip').remove();
    const tooltip = this.svg.append('g').attr('id', 'tooltip');

    tooltip
      .append('circle')
      .attr('id', 'top-circle')
      .attr('fill', '#17C3B2')
      .attr('fill-opacity', 0.48)
      .attr('stroke-width', 2)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5);

    tooltip
      .append('polygon')
      .attr('points', '0,0 -5,-15, 5,-15')
      .attr('id', 'polygon')
      .style('fill', '#13222D');

    tooltip
      .append('rect')
      .attr('fill', '#13222D')
      .attr('stroke', '#13222D')
      .attr('x', -79)
      .attr('y', -115)
      .attr('width', 158)
      .attr('height', 100)
      .attr('rx', 8)
      .attr('ry', 8);

    tooltip
      .append('circle')
      .attr('cx', -60)
      .attr('cy', -90)
      .attr('r', 5)
      .attr('stroke', '#00D786')
      .attr('fill', '#00D786')
      .attr('stroke-width', 2);

    tooltip
      .append('text')
      .attr('id', 'tooltip-sov-amount')
      .attr('x', -50)
      .attr('y', -85)
      .attr('text-anchor', 'start')
      .style('fill', '#8CB8D8')
      .style('font-size', 12)
      .style('font-weight', 500)
      .style('font-family', 'Inter, sans-serif')
      .text('Price:');

    tooltip
      .append('image')
      .attr('xlink:href', cornerRightUpImg)
      .attr('x', -60)
      .attr('y', -40);

    tooltip
      .append('text')
      .attr('id', 'tooltip-supply')
      .attr('x', -47)
      .attr('y', -30)
      .attr('text-anchor', 'start')
      .style('fill', '#8CB8D8')
      .style('font-size', 12)
      .text('Supply:');

    tooltip
      .append('text')
      .attr('id', 'tooltip-supply-amt')
      .attr('x', -5)
      .attr('y', -30)
      .attr('text-anchor', 'start')
      .style('fill', '#fff')
      .style('font-size', 12)
      .style('font-weight', 'bold')
      .text('6k');
    tooltip
      .append('text')
      .attr('id', 'tooltip-sov-amount')
      .attr('x', -65)
      .attr('y', -50)
      .attr('text-anchor', 'start')
      .style('fill', '#fff')
      .style('font-size', 32)
      .style('font-weight', 600)
      .style('font-family', 'Inter, sans-serif')
      .text('2.7 SOV');

    return tooltip;
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
