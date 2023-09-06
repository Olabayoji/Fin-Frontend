import React from "react";
import {
  MouseCoordinateY,
  RSISeries,
  RSITooltip,
  XAxis,
  YAxis,
} from "react-financial-charts";

type Props = {
  isLast: boolean;
  indicatorDefault: any;
  pricesDisplayFormat: any;
  rsiCalculator: any;
  rsiAccessor: any;
};

const RSIIndicator = (props: Props) => {
  return (
    <>
      {" "}
      <XAxis showTickLabel={props.isLast} />
      <YAxis
        tickValues={[
          props.indicatorDefault.rsi.oversold,
          50,
          props.indicatorDefault.rsi.overbought,
        ]}
      />
      <MouseCoordinateY
        arrowWidth={8}
        displayFormat={props.pricesDisplayFormat}
      />
      <RSISeries yAccessor={props.rsiAccessor} />
      <RSITooltip
        origin={[8, 16]}
        yAccessor={props.rsiAccessor}
        options={props.rsiCalculator.options()}
      />
    </>
  );
};

export default RSIIndicator;
