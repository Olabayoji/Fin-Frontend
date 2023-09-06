import React, { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist";

type Props = { data: number[]; indicator: string };

const BoxPlot = (props: Props) => {
  const { data, indicator } = props;
  const boxPlotRef = useRef<HTMLDivElement | null>(null); // Explicit type here

  useEffect(() => {
    const plotDiv = document.getElementById("box-plot");
    if (plotDiv && indicator && boxPlotRef.current) {
      const height = boxPlotRef.current?.clientHeight || 0; // Safe access here
      const width = boxPlotRef.current?.clientWidth || 0;

      var plot = {
        y: data,
        type: "box",
      };

      const layout = {
        width: width,
        height: height,
        title: `Box Plot for ${props.indicator}`,
        xaxis: {
          title: indicator,
        },
      };

      Plotly.newPlot(plotDiv, [plot], layout);
    }
  }, [indicator, data]);

  return (
    <div ref={boxPlotRef} className="h-full relative">
      {indicator === "" ? (
        <p className="text-center font-semibold max-w-xs mx-auto absolute -translate-y-[50%] top-[50%]">
          Click on points to see range of values used by model
        </p>
      ) : (
        <div id="box-plot" className="h-full" />
      )}
    </div>
  );
};

export default BoxPlot;
