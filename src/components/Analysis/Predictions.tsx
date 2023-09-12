import React, { useContext } from "react";
import { DataContext } from "../../util/DataContext";
import FeatureImportance from "./FeatureImportance";
import PredictionEvaluation from "./PredictionEvaluation";
import ModelAnalysis from "./ModelAnalysis";

type Props = {};

const Predictions = (props: Props) => {
  const { predictionData } = useContext(DataContext);
  const features: string[] = [];
  const values: number[] = [];
  predictionData.importance.map((item: any) => {
    features.push(Object.keys(item)[0]);
    values.push(item[Object.keys(item)[0]]);
    return;
  });
  const prediction = predictionData.prediction![0];
  return (
    <div className=" w-full pb-6">
      <h2 className="text-center font-bold text-2xl my-4">Model Evaluation</h2>
      <div className="grid grid-cols-2 gap-x-4 mb-8 max-w-lg mx-auto">
        <div className="flex flex-col p-4 bg-white shadow-md rounded-md border text-center">
          <h2 className="font-semibold text-gray-700 mb-2 border-b">
            Model Prediction
          </h2>
          <span className="text-base font-extrabold  text-blue-500">
            {prediction === 0
              ? "No Trend"
              : prediction === 1
              ? "Up Trend"
              : "Down Trend"}
          </span>
        </div>

        <div className="flex flex-col p-4 bg-white shadow-md rounded-md border text-center">
          <h2 className="font-semibold text-gray-700 mb-2 border-b">
            Model Accuracy
          </h2>
          <span className="text-base font-extrabold  text-blue-500">
            {(predictionData.evaluation.f1 * 100).toFixed(2)}%
          </span>
        </div>

        {/* <div className="flex flex-col p-4 bg-white shadow-md rounded-md border text-center">
          <h2 className="font-semibold text-gray-700 mb-2 border-b">
            Model Precision
          </h2>
          <span className="font-extrabold text-base  text-blue-500">
            {(predictionData.evaluation.precision * 100).toFixed(2)}%
          </span>
        </div> */}
      </div>

      <FeatureImportance data={{ features: features, values: values }} />
      <ModelAnalysis />
      {/* <PredictionEvaluation /> */}
    </div>
  );
};

export default Predictions;
