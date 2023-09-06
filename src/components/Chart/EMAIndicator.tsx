import {
  CurrentCoordinate,
  LineSeries,
  MovingAverageTooltip,
} from "react-financial-charts";

type Props = {
  ema26: any;
  ema12: any;
  indicatorExists: boolean;
};

const EMAIndicator = (props: Props) => {
  return (
    <>
      <LineSeries
        yAccessor={props.ema26.accessor()}
        strokeStyle={props.ema26.stroke()}
      />
      <CurrentCoordinate
        yAccessor={props.ema26.accessor()}
        fillStyle={props.ema26.stroke()}
      />
      <LineSeries
        yAccessor={props.ema12.accessor()}
        strokeStyle={props.ema12.stroke()}
      />
      <CurrentCoordinate
        yAccessor={props.ema12.accessor()}
        fillStyle={props.ema12.stroke()}
      />
      <MovingAverageTooltip
        origin={props.indicatorExists ? [0, -35] : [0, -45]}
        className="z-40"
        options={[
          {
            yAccessor: props.ema26.accessor(),
            type: "EMA",
            stroke: props.ema26.stroke(),
            windowSize: props.ema26.options().windowSize,
          },
          {
            yAccessor: props.ema12.accessor(),
            type: "EMA",
            stroke: props.ema12.stroke(),
            windowSize: props.ema12.options().windowSize,
          },
        ]}
      />
    </>
  );
};

export default EMAIndicator;
