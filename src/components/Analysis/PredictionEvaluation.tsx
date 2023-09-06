import { useContext } from "react";
import { DataContext } from "../../util/DataContext";
import { Bar } from "react-chartjs-2";

type Props = {};

const PredictionEvaluation = (props: Props) => {
  const { predictionData } = useContext(DataContext);
  const posValues: number[] = [];
  const negValues: number[] = [];
  const features: string[] = [];

  predictionData.explanation.explanation.map((item: any) => {
    features.push(item[0]);
    if (item[1] > 0) {
      posValues.push(item[1]);
      negValues.push(NaN); // use NaN instead of null
    } else {
      negValues.push(item[1]);
      posValues.push(NaN); // use NaN instead of null
    }
    return;
  });

  const options = {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Confidence",
      },
    },
  };

  const data = {
    labels: features,
    datasets: [
      {
        label: "Support",
        data: posValues,
        borderColor: "#4F7942",
        backgroundColor: "#4F7942",
      },
      {
        label: "Resistance",
        data: negValues,
        borderColor: "#E60026",
        backgroundColor: "#E60026",
      },
    ],
  };

  return (
    <div>
      <h2 className="text-center font-bold text-2xl mt-16 mb-4">
        Prediction Explanation
      </h2>
      <div className="relative mx-auto w-[70vw] max-w-6xl">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default PredictionEvaluation;
