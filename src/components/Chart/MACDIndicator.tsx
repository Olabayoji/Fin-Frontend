import { format } from "d3-format";
import {
  Chart,
  MACDSeries,
  MACDTooltip,
  XAxis,
  YAxis,
} from "react-financial-charts";

type Props = {
  macdYAccessor: any;
  MACDHeight: number;
  macdOptions: any;
  macdOrigin: any;
};

const MACDIndicator = (props: Props) => {
  const macdAppearance = {
    fillStyle: {
      divergence: "#4682B4",
    },
    strokeStyle: {
      macd: "#0093FF",
      signal: "#D84315",
      zero: "rgba(0, 0, 0, 0.3)",
    },
  };
  const pricesDisplayFormat = format(".2f");
  return (
    <Chart
      id={5}
      yExtents={props.macdYAccessor}
      origin={props.macdOrigin}
      height={props.MACDHeight}
      padding={{ top: 25, bottom: 10 }}
    >
      <XAxis gridLinesStrokeStyle="#e0e3eb" />
      <YAxis ticks={4} tickFormat={pricesDisplayFormat} />

      <MACDSeries yAccessor={props.macdYAccessor} {...macdAppearance} />

      <MACDTooltip
        origin={[8, 16]}
        appearance={macdAppearance}
        options={props.macdOptions}
        yAccessor={props.macdYAccessor}
      />
    </Chart>
  );
};

export default MACDIndicator;
