import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { MouseEvent, useContext, useRef, useState } from "react";
import {
  Scatter,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from "react-chartjs-2";
import { DataContext } from "../../util/DataContext";
import TableRow from "../TableRow";
import Toggle from "../Toggle";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import BoxPlot from "./BoxPlot";

type Props = {};
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);
const ModelAnalysis = (props: Props) => {
  const [view, setView] = useState("table");
  const changeView = (view: string) => {
    setView(view);
  };
  const { predictionData } = useContext(DataContext);
  const boxValues = predictionData.all_indicator_values;
  const xCategories = predictionData.association.map((data: any) =>
    data.consequents[0] === "0"
      ? "No Trend"
      : data.consequents[0] === "1"
      ? "Up Trend"
      : "Down Trend"
  ) as string[];
  const uniqueCategories = Array.from(new Set(xCategories));

  const y = predictionData.association.map((data: any) =>
    (data.confidence * 100).toFixed(2)
  );
  const z = predictionData.association.map((data: any) => data.antecedents);
  const convictions = predictionData.association.map(
    (data: any) => data.conviction
  );

  const chartData = xCategories.map((value: any, index: number) => ({
    x: value,
    y: y[index],
  }));

  const labelStyle = {
    size: 16,
  } as any;
  const options = {
    scales: {
      x: {
        type: "category" as const,
        labels: uniqueCategories,
        title: {
          display: true,
          text: "Trend",
          font: labelStyle,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Confidence (%)",

          font: labelStyle,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const category = uniqueCategories[index];
            const categoryLabel = xCategories[index];
            const confidence = context.dataset.data[index].y;
            const rule = z[index];
            const conviction: number = convictions[index].toFixed(2);
            return [
              `Rule: ${rule}`,
              `Trend: ${categoryLabel}`,
              `Confidence: ${confidence}%`,
              `Conviction: ${conviction}`,
            ];
          },
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        label: "Data Point",
        data: chartData,
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };
  const chartRef = useRef<any>(null);

  const [selected, setSelected] = useState("");
  const [selectedIndicatorData, setSelectedIndicatorData] = useState<number[]>(
    []
  );

  const onClick = (event: any) => {
    const elements = getElementsAtEvent(chartRef.current, event);
    if (elements && elements.length > 0) {
      const clickedIndex = elements[0]?.index;
      if (clickedIndex !== undefined && clickedIndex !== null) {
        const clickedData = predictionData.association[clickedIndex];
        if (clickedData) {
          setSelected(clickedData.antecedents[0].split(" ")[0]);

          const indicator = clickedData.antecedents[0].split(" ")[0];
          const selectedData = boxValues[indicator] || [];
          setSelectedIndicatorData(selectedData);
        }
      }
    }
  };

  return (
    <>
      <h3 className="mt-12 mb-3 text-center font-semibold text-lg">
        Extracted Random Forest Rules
      </h3>
      <div className="grid">
        <div className="max-w-md inline-block min-w-[300px] place-self-end">
          <Toggle changeView={(view) => changeView(view)} view={view} />
        </div>
      </div>
      {view === "scatter" ? (
        <div className="relative mx-auto w-auto max-w-6xl grid grid-cols-[70%,30%]">
          <div>
            <Scatter
              ref={chartRef}
              onClick={onClick}
              options={options}
              data={data}
            />
          </div>
          <div className="items-center w-full">
            <BoxPlot data={selectedIndicatorData} indicator={selected} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col z-50">
          <div className="overflow-x-auto">
            <div className="p-1.5 w-full inline-block align-middle">
              <div className="overflow-hidden border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Rules
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Trend
                      </th>
                      <th scope="col" className="relative px-6 py-3 text-left">
                        <span className=" text-xs font-bold text-gray-500 uppercase">
                          Confidence (%)
                        </span>
                        <span className="group  w-max">
                          <button>
                            {" "}
                            <AiOutlineQuestionCircle className="w-3 h-3 absolute top-2  " />
                          </button>
                          <span className="pointer-events-none absolute text-justify z-20  w-max max-w-[300px] rounded font-normal bg-slate-700 px-2 py-1 text-sm  text-gray-50 opacity-0 shadow transition-opacity group-hover:opacity-100">
                            Confidence is a measure of the reliability of the
                            rule. It is the likelihood that the consequent
                            (trend) is true when the antecedent (rule) is true.
                            It measures the reliability of the association
                            between the rule and the trend. Confidence is how
                            often the trend is true when the rule is true
                          </span>
                        </span>
                      </th>
                      <th scope="col" className="relative px-6 py-3 text-left">
                        <span className=" text-xs font-bold text-gray-500 uppercase">
                          Support (%)
                        </span>
                        <span className="group  w-max">
                          <button>
                            {" "}
                            <AiOutlineQuestionCircle className="w-3 h-3 absolute top-2" />
                          </button>
                          <span className="pointer-events-none absolute text-justify z-20  w-max max-w-[300px] rounded font-normal bg-slate-700 px-2 py-1 text-sm  text-gray-50 opacity-0 shadow transition-opacity group-hover:opacity-100">
                            This is the proportion of model that contain both
                            the antecedent (rule) and the consequent (trend). It
                            measures how frequently the rule and trend appear
                            together.
                          </span>
                        </span>
                      </th>

                      <th scope="col" className="relative px-6 py-3 text-left">
                        <span className=" text-xs font-bold text-gray-500 uppercase">
                          Conviction
                        </span>
                        <span className="group  w-max">
                          <button>
                            {" "}
                            <AiOutlineQuestionCircle className="w-3 h-3 absolute top-2" />
                          </button>
                          <span className="pointer-events-none absolute text-justify w-max max-w-[300px] rounded font-normal bg-slate-700 px-2 py-1 text-sm z-[100000]  text-gray-50 opacity-0 shadow transition-opacity group-hover:opacity-100">
                            Conviction is a measure of the implication of a
                            rule. It indicates how much the consequent (trend)
                            depends on the antecedent (rule). A conviction value
                            greater than or equal to 1 means that there is a
                            strong association between the antecedent(rule) and
                            the consequent(support).
                          </span>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {predictionData.association.map((data: any, id: number) => (
                      <TableRow key={id} tableData={data} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModelAnalysis;
