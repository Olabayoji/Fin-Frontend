import {
  ElderRaySeries,
  MouseCoordinateX,
  MouseCoordinateY,
  SingleValueTooltip,
  XAxis,
  YAxis,
} from "react-financial-charts";

type Props = {
  isLast: boolean;
  pricesDisplayFormat: any;
  timeDisplayFormat: any;
  elder: any;
};

const ElderRay = (props: Props) => {
  return (
    <>
      {" "}
      <XAxis
        showTickLabel={props.isLast ? true : false}
        gridLinesStrokeStyle="#e0e3eb"
      />
      <YAxis ticks={4} tickFormat={props.pricesDisplayFormat} />
      <MouseCoordinateX displayFormat={props.timeDisplayFormat} />
      <ElderRaySeries yAccessor={props.elder.accessor()} />
      <MouseCoordinateY
        arrowWidth={8}
        displayFormat={props.pricesDisplayFormat}
      />
      <SingleValueTooltip
        yAccessor={props.elder.accessor()}
        yLabel="Elder Ray"
        yDisplayFormat={(d: any) =>
          `${props.pricesDisplayFormat(
            d.bullPower
          )}, ${props.pricesDisplayFormat(d.bearPower)}`
        }
        origin={[8, 16]}
      />
    </>
  );
};

export default ElderRay;
