import * as d3 from 'd3';

export type D3Selection = d3.Selection<any, unknown, null, undefined>;

export interface IDimension {
  width: number;
  height: number;
}

export type PositionArray = [number, number];

export type LinerScale = d3.ScaleLinear<number, number, never>;

export type TooltipFont = {
  small: number;
  large: number;
};

export interface ITooltip {
  triangle: IDimension;
  rect: IDimension;
  padding: IPadding;
  font: TooltipFont;
  radius: number;
}

export interface IPadding {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
