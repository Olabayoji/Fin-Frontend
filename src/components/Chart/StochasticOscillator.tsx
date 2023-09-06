import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import * as React from "react";
import {
  Chart,
  ChartCanvas,
  CrossHairCursor,
  discontinuousTimeScaleProviderBuilder,
  MouseCoordinateX,
  MouseCoordinateY,
  stochasticOscillator,
  StochasticSeries,
  StochasticTooltip,
  withDeviceRatio,
  withSize,
  XAxis,
  YAxis,
} from "react-financial-charts";
type Props = {
  height: number;
  slowSTO: any;
};

export const SloStochasticOscillator = (props: Props) => {
  const displayFormat = format(".2f");
  const timeDisplayFormat = timeFormat("%d %b");
  const margin = { left: 0, right: 40, top: 0, bottom: 24 };

  return (
    <>
      <XAxis
        axisAt="bottom"
        orient="bottom"
        showGridLines
        showTickLabel={false}
        outerTickSize={0}
      />
      <YAxis axisAt="right" orient="right" tickValues={[20, 50, 80]} />
      <MouseCoordinateY arrowWidth={8} displayFormat={displayFormat} />
      <StochasticSeries yAccessor={(d) => d.slowSTO} />
      <StochasticTooltip
        origin={[8, 16]}
        yAccessor={(d) => d.slowSTO}
        options={props.slowSTO.options()}
        appearance={{
          stroke: StochasticSeries.defaultProps.strokeStyle,
        }}
        label="Slow STO"
      />
    </>
  );
};
export const FastStochasticOscillator = (props: Props) => {
  const displayFormat = format(".2f");
  const timeDisplayFormat = timeFormat("%d %b");
  const margin = { left: 0, right: 40, top: 0, bottom: 24 };

  return (
    <>
      <XAxis
        axisAt="bottom"
        orient="bottom"
        showGridLines
        showTickLabel={false}
        outerTickSize={0}
      />
      <YAxis axisAt="right" orient="right" tickValues={[20, 50, 80]} />
      <MouseCoordinateY arrowWidth={8} displayFormat={displayFormat} />
      <StochasticSeries yAccessor={(d) => d.fastSTO} />
      <StochasticTooltip
        origin={[8, 16]}
        yAccessor={(d) => d.slowSTO}
        options={props.slowSTO.options()}
        appearance={{ stroke: StochasticSeries.defaultProps.strokeStyle }}
        label="Fast STO"
      />
    </>
  );
};
export const FullStochasticOscillator = (props: Props) => {
  const displayFormat = format(".2f");
  const timeDisplayFormat = timeFormat("%d %b");
  const margin = { left: 0, right: 40, top: 0, bottom: 24 };

  return (
    <>
      <XAxis axisAt="bottom" orient="bottom" showGridLines />
      <YAxis axisAt="right" orient="right" tickValues={[20, 50, 80]} />
      <MouseCoordinateY arrowWidth={8} displayFormat={displayFormat} />
      <StochasticSeries yAccessor={(d) => d.fullSTO} />
      <StochasticTooltip
        origin={[8, 16]}
        yAccessor={(d) => d.slowSTO}
        options={props.slowSTO.options()}
        appearance={{ stroke: StochasticSeries.defaultProps.strokeStyle }}
        label="Full STO"
      />
    </>
  );
};
