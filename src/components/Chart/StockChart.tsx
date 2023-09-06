import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import {
  elderRay,
  ema,
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  BarSeries,
  CandlestickSeries,
  LineSeries,
  OHLCTooltip,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  SingleValueTooltip,
  MACDSeries,
  MACDTooltip,
  BollingerSeries,
  bollingerBand,
  BollingerBandTooltip,
  macd,
  mouseBasedZoomAnchor,
  sma,
  rsi,
  stochasticOscillator,
  StochasticSeries,
  StochasticTooltip,
  StraightLine,
  forceIndex,
} from "react-financial-charts";
import { DataContext } from "../../util/DataContext";
import SelectComponent from "../SelectComponent";
import { IOHLCData } from "../../util/util";
import {
  FastStochasticOscillator,
  FullStochasticOscillator,
  SloStochasticOscillator,
} from "./StochasticOscillator";
import DatePicker from "../DatePicker";
import ElderRay from "./ElderRay";
import RSIIndicator from "./RSIIndicator";
import EMAIndicator from "./EMAIndicator";

type Props = {};

interface ChartHeights {
  elderRay: number;
  macd: number;
  rsi: number;
  forceIndex: number;
}

const StockChart = (props: Props) => {
  const { stockData, selectedIndicators, setSelectedIndicators } =
    useContext(DataContext);

  //Chart indicators
  const indicators = [
    "Line Series",
    "Candlestick",
    "EMA",
    "Elder Ray",
    "MACD",
    "RSI",
    "Bollinger Band",
    "Volume",
    "Stochastic Oscillator",
    "Force Index",
  ];

  const [indicatorDefault, setIndicatorDefault] = useState({
    rsi: { period: 14, overbought: 70, oversold: 30 },
    macd: { fast: 12, signal: 9, slow: 26 },
  });

  const handleIndicatorSelect = (selectedOption: any) => {
    setSelectedIndicators(selectedOption);
  };
  const checkIfIndicatorExists = (value: string): boolean => {
    const indicatorValues = selectedIndicators.map((indicator) =>
      indicator.value.toLowerCase()
    );
    return indicatorValues.includes(value.toLocaleLowerCase());
  };

  //Chart Responsiveness
  const [chartWidth, setChartWidth] = useState(window.innerWidth);
  let height = 500;
  selectedIndicators.forEach((indicator) => {
    if (
      indicator.value.toLowerCase() === "elder ray" ||
      indicator.value.toLowerCase() === "macd" ||
      indicator.value.toLowerCase() === "rsi" ||
      indicator.value.toLowerCase() === "force index"
    ) {
      height += 100;
    } else if (indicator.value.toLowerCase() === "stochastic oscillator") {
      height += 300;
    }
  });

  const margin = { left: 0, right: 48, top: 65, bottom: 24 };

  const handleResize = () => {
    const newWidth = Math.min(window.innerWidth - 80, 1720 - 80);
    if (newWidth !== chartWidth) {
      setChartWidth(newWidth);
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chartWidth]);

  ///DATA PROCESSING

  // Scaling
  const ScaleProvider =
    discontinuousTimeScaleProviderBuilder().inputDateAccessor(
      (d) => new Date(d.date)
    );
  const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(
    stockData?.data!
  );

  const pricesDisplayFormat = format(".2f");
  const max = xAccessor(data[data.length - 1]);
  const min = xAccessor(data[Math.max(0, data.length - 100)]);
  const xExtents = [min, max + 5];
  const dateTimeFormat = "%d %b %y";
  const timeDisplayFormat = timeFormat(dateTimeFormat);

  //EMA processing
  const ema12 = ema()
    .id(1)
    .options({ windowSize: 12 })
    .merge((d: any, c: any) => {
      d.ema12 = c;
    })
    .accessor((d: any) => d.ema12);

  const ema26 = ema()
    .id(2)
    .options({ windowSize: 26 })
    .merge((d: any, c: any) => {
      d.ema26 = c;
    })
    .accessor((d: any) => d.ema26);

  // ElderRay processing
  const elder = elderRay();
  const elderRayHeight = 100;

  const calculatedData = elder(ema26(ema12(stockData?.data!)));

  const gridHeight = height - margin.top - margin.bottom;

  // Bar chart
  const barChartHeight = 500 / 4;
  const yExtents = (data: any) => [data.high, data.low];
  const barChartExtents = (data: any) => data.volume;

  // Candlestick
  const candleChartExtents = (data: any) => [data.high, data.low];
  const yEdgeIndicator = (data: any) => data.close;
  // Line series
  const lineYAccessor = (data: IOHLCData) => {
    return data.close;
  };
  // Volume processing
  const volumeColor = (data: any) =>
    data.close > data.open
      ? "rgba(38, 166, 154, 0.3)"
      : "rgba(239, 83, 80, 0.3)";

  const volumeSeries = (data: any) => data.volume;

  const openCloseColor = (data: any) =>
    data.close > data.open ? "#26a69a" : "#ef5350";

  // Bollinger Band Processing
  const calculator = bollingerBand()
    .merge((d: any, c: any) => {
      d.bb = c;
    })
    .accessor((d: any) => d.bb);

  const bbSma = sma()
    .id(3) // Use a unique ID for the moving average to prevent conflicts
    .options({ windowSize: 20 }) // Use a window size of 20 for the SMA
    .merge((d: any, c: any) => {
      d.bbSma = c;
    })
    .accessor((d: any) => d.bbSma);

  // Define the bollingerYAccessor function
  const calculatedBollinger = calculator(stockData?.data!);
  const bollingerYAccessor = (d: any) => d && d.bb && d.bb.middle;
  const bbSmaYAccessor = (d: any) => d && d.bbSma;

  // MACD processing
  const macdCalculator = macd()
    .options({
      fast: indicatorDefault.macd.fast,
      signal: indicatorDefault.macd.signal,
      slow: indicatorDefault.macd.slow,
    })
    .merge((d: any, c: any) => {
      d.macd = c;
    })
    .accessor((d: any) => d.macd);

  const macdYAccessor = macdCalculator.accessor();
  const macdOptions = macdCalculator.options();

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
  const MACDHeight = 100;

  const calculateMACDData = () => {
    const calculatedMACD = macdCalculator(stockData?.data!);
    const macdData = calculatedMACD.map((d: any, i: number) => {
      const { divergence, signal, MACD } = d;
      return { date: d.date, divergence, signal, MACD };
    });
    return macdData;
  };
  const macdData = calculateMACDData();

  // RSI processing
  const rsiCalculator = rsi()
    .options({ windowSize: indicatorDefault.rsi.period })
    .merge((d: any, c: any) => {
      d.rsi = c;
    })
    .accessor((d: any) => d.rsi);
  const rsiHeight = 100;
  const rsiAccessor = rsiCalculator.accessor();
  const calculatedDataWithRSI = rsiCalculator(data);

  // Stochastic Oscillator processing

  const slowSTO = stochasticOscillator()
    .options({ windowSize: 14, kWindowSize: 3, dWindowSize: 3 })
    .merge((d: any, c: any) => {
      d.slowSTO = c;
    })
    .accessor((d: any) => d.slowSTO);
  const fastSTO = stochasticOscillator()
    .options({ windowSize: 14, kWindowSize: 1, dWindowSize: 3 })
    .merge((d: any, c: any) => {
      d.fastSTO = c;
    })
    .accessor((d: any) => d.fastSTO);
  const fullSTO = stochasticOscillator()
    .options({ windowSize: 14, kWindowSize: 3, dWindowSize: 4 })
    .merge((d: any, c: any) => {
      d.fullSTO = c;
    })
    .accessor((d: any) => d.fullSTO);
  const calculatedSTOData = slowSTO(fastSTO(fullSTO(data)));

  //Force Index processing
  const fi = forceIndex()
    .merge((d: any, c: any) => {
      d.fi = c;
    })
    .accessor((d: any) => d.fi);

  const fiEMA13 = ema()
    .id(1)
    .options({ windowSize: 13, sourcePath: "fi" })
    .merge((d: any, c: any) => {
      d.fiEMA13 = c;
    })
    .accessor((d: any) => d.fiEMA13);

  const forceIndexCalculatedData = fiEMA13(fi(stockData?.data!));
  const forceIndexYAccessor = fiEMA13.accessor();

  //Height processing
  const barChartOrigin = (_: any, h: any) => [0, 270];

  let cumulativeHeight = 400;
  let previousHeight = 400;

  //Chart config

  const lastIndex = () => {
    const excludedLabels = ["Candlestick", "EMA", "Volume", "Line Series"];

    let lastIndex = -1;
    for (let i = selectedIndicators.length - 1; i >= 0; i--) {
      if (!excludedLabels.includes(selectedIndicators[i].label)) {
        lastIndex = i;
        break;
      }
    }
    return lastIndex;
  };

  const chartConfig: {
    [key: string]: { height: number; chart: (height: number) => JSX.Element };
  } = {
    "elder ray": {
      height: elderRayHeight,
      chart: (height: number) => {
        const isLast = selectedIndicators[lastIndex()]?.label === "Elder Ray";
        cumulativeHeight += height;
        const origin = [0, previousHeight];
        previousHeight = cumulativeHeight;
        return (
          <Chart
            id={4}
            height={height}
            yExtents={[0, elder.accessor()]}
            origin={origin}
            padding={{ top: 20, bottom: 10 }}
          >
            <ElderRay
              isLast={isLast}
              pricesDisplayFormat={pricesDisplayFormat}
              timeDisplayFormat={timeDisplayFormat}
              elder={elder}
            />
          </Chart>
        );
      },
    },
    macd: {
      height: MACDHeight,
      chart: (height: number) => {
        const isLast = selectedIndicators[lastIndex()]?.label === "MACD";

        cumulativeHeight += height;

        const origin = [0, previousHeight];

        previousHeight = cumulativeHeight;
        return (
          <Chart
            id={5}
            yExtents={macdYAccessor}
            origin={origin}
            height={height}
            padding={{ top: 20, bottom: 10 }}
          >
            <XAxis showTickLabel={isLast} />
            <YAxis ticks={4} tickFormat={pricesDisplayFormat} />

            <MACDSeries yAccessor={macdYAccessor} {...macdAppearance} />
            <MouseCoordinateY
              arrowWidth={8}
              displayFormat={pricesDisplayFormat}
            />
            <MACDTooltip
              origin={[8, 16]}
              appearance={macdAppearance}
              options={macdOptions}
              yAccessor={macdYAccessor}
            />
          </Chart>
        );
      },
    },
    rsi: {
      height: rsiHeight,
      chart: (height: number) => {
        const isLast = selectedIndicators[lastIndex()]?.label === "RSI";

        cumulativeHeight += height;
        const origin = [0, previousHeight];
        previousHeight = cumulativeHeight;
        return (
          <Chart
            height={height}
            padding={{ top: 20, bottom: 10 }}
            origin={origin}
            id={6}
            yExtents={[0, 100]}
          >
            <RSIIndicator
              isLast={isLast}
              indicatorDefault={indicatorDefault}
              pricesDisplayFormat={pricesDisplayFormat}
              rsiAccessor={rsiAccessor}
              rsiCalculator={rsiCalculator}
            />
          </Chart>
        );
      },
    },
    "force index": {
      height: rsiHeight,
      chart: (height: number) => {
        const isLast = selectedIndicators[lastIndex()]?.label === "Force Index";
        cumulativeHeight += height;
        const origin = [0, previousHeight];
        previousHeight = cumulativeHeight;
        return (
          <Chart
            id={8}
            yExtents={forceIndexYAccessor}
            height={height}
            origin={origin}
          >
            <XAxis showTickLabel={isLast} />
            <YAxis tickFormat={format(".2s")} />

            <LineSeries yAccessor={forceIndexYAccessor} />
            <StraightLine yValue={0} lineDash="ShortDash2" />
            <SingleValueTooltip
              yAccessor={forceIndexYAccessor}
              yLabel="ForceIndex (13)"
              yDisplayFormat={format(".4s")}
              origin={[8, 16]}
            />
          </Chart>
        );
      },
    },
    // "stochastic oscillator": {
    //   height: rsiHeight,
    //   chart: (height: number) => {
    //     const isLast =
    //       selectedIndicators[lastIndex()]?.label === "Stochastic Oscillator";
    //     cumulativeHeight += height;
    //     const stoCharts = [
    //       <SloStochasticOscillator height={height} slowSTO={slowSTO} />,
    //       <FastStochasticOscillator height={height} slowSTO={slowSTO} />,
    //       <FullStochasticOscillator height={height} slowSTO={slowSTO} />,
    //     ];
    //     return stoCharts.map((chart, index) => {
    //       const currentOrigin = [0, previousHeight + index * 100];
    //       return (
    //         <Chart
    //           id={10 + index}
    //           yExtents={[0, 100]}
    //           height={height}
    //           origin={currentOrigin}
    //           padding={{ top: 20, bottom: 10 }}
    //         >
    //           {chart}
    //         </Chart>
    //       );
    //     });
    //   },
    // },
  };

  return (
    <div className="grid grid-cols-1 px-4 md:px-8 py-8 w-full mx-auto">
      <div className="grid grid-cols-2">
        <div>
          <label className="font-semibold text-sm" htmlFor="">
            Indicators
          </label>
          <SelectComponent
            indicators={indicators}
            handleIndicatorSelect={handleIndicatorSelect}
            selectedIndicators={selectedIndicators}
          />
        </div>
        <div className="max-w-md inline-block min-w-[300px] place-self-end">
          <label className="font-semibold text-sm" htmlFor="">
            Pick Date
          </label>
          <div className="border rounded w-full">
            <DatePicker />
          </div>
        </div>
      </div>
      <p className="font-bold uppercase text-lg w-fit md:text-2xl mt-4  ">
        {stockData?.ticker}
      </p>

      <ChartCanvas
        height={height}
        ratio={3}
        width={chartWidth}
        margin={margin}
        data={data}
        displayXAccessor={displayXAccessor}
        seriesName="Data"
        xScale={xScale}
        xAccessor={xAccessor}
        xExtents={xExtents}
        zoomAnchor={mouseBasedZoomAnchor}
      >
        {/* CHART 1 */}
        {/* Volume */}
        {checkIfIndicatorExists("volume") && (
          <Chart
            id={2}
            height={barChartHeight}
            origin={barChartOrigin}
            yExtents={barChartExtents}
          >
            <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
          </Chart>
        )}
        <Chart id={3} height={400} yExtents={candleChartExtents}>
          <ZoomButtons />
          <XAxis
            showGridLines={
              !checkIfIndicatorExists("elder ray") &&
              !checkIfIndicatorExists("macd")
                ? true
                : false
            }
            showTickLabel={
              !checkIfIndicatorExists("elder ray") &&
              !checkIfIndicatorExists("macd") &&
              !checkIfIndicatorExists("rsi") &&
              !checkIfIndicatorExists("force index")
                ? true
                : false
            }
          />

          <YAxis showGridLines tickFormat={pricesDisplayFormat} />
          <MouseCoordinateY
            arrowWidth={8}
            displayFormat={pricesDisplayFormat}
          />
          {!checkIfIndicatorExists("elder ray") &&
            !checkIfIndicatorExists("macd") &&
            !checkIfIndicatorExists("rsi") &&
            !checkIfIndicatorExists("force index") && (
              <MouseCoordinateX displayFormat={timeDisplayFormat} />
            )}
          {/* Line Series */}
          {checkIfIndicatorExists("line series") && (
            <>
              <LineSeries yAccessor={lineYAccessor} />
              <XAxis
                showTickLabel={
                  !checkIfIndicatorExists("elder ray") &&
                  !checkIfIndicatorExists("macd") &&
                  !checkIfIndicatorExists("rsi") &&
                  !checkIfIndicatorExists("force index")
                    ? true
                    : false
                }
              />
              <YAxis />
            </>
          )}
          {/* CandleStick */}
          {checkIfIndicatorExists("candlestick") && (
            <>
              <CandlestickSeries />
              <EdgeIndicator
                itemType="last"
                rectWidth={margin.right}
                fill={openCloseColor}
                lineStroke={openCloseColor}
                displayFormat={pricesDisplayFormat}
                yAccessor={yEdgeIndicator}
              />
              <OHLCTooltip origin={[0, -55]} />
            </>
          )}
          {/* Bollinger Band */}
          {checkIfIndicatorExists("bollinger band") && (
            <>
              <BollingerSeries />

              <BollingerBandTooltip
                options={calculator.options()}
                origin={[0, -40]}
              />
            </>
          )}

          {/* Exponential Moving Average */}
          {checkIfIndicatorExists("ema") && (
            <EMAIndicator
              ema12={ema12}
              ema26={ema26}
              indicatorExists={checkIfIndicatorExists("bollinger band")}
            />
          )}
        </Chart>

        {selectedIndicators.map((indicator) => {
          const config = chartConfig[indicator.value.toLowerCase()];
          console.log(config);
          const chart = config ? config.chart(config.height) : null;
          return chart;
        })}

        {selectedIndicators.length > 0 && <CrossHairCursor />}
      </ChartCanvas>
    </div>
  );
};

export default StockChart;
