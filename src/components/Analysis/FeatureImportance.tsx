import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
type Props = {
  data: any;
};
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default function FeatureImportance(props: Props) {
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
        text: "Feature Importance",
      },
    },
  };

  const labels = props.data.features;

  const data = {
    labels,
    datasets: [
      {
        label: "Importance",
        data: props.data.values,
        borderColor: "#536878",
        backgroundColor: "#536878",
      },
    ],
  };

  return (
    <>
      <div className="relative mx-auto w-full">
        <Bar options={options} data={data} />
      </div>
    </>
  );
}
