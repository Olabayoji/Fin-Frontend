import React, { useContext, useState } from "react";
import { DataContext } from "../util/DataContext";
import LoadingSpinner from "../components/LoadingSpinner";
import StockChart from "../components/Chart/StockChart";
import axios from "axios";
import Predictions from "../components/Analysis/Predictions";
import AnalysisForm from "../components/Analysis/AnalysisForm";
import { BiArrowBack } from "react-icons/bi";
import { BASE_URL } from "../util/util";
type Props = {};

const HomePage = (props: Props) => {
  //Get data
  const {
    updatePredictionData,
    stockData,
    stockError,
    loadingStock,
    predictionData,
  } = useContext(DataContext);
  const [loading, setLoading] = useState<boolean>(false);

  const [showPredictionInfo, setShowPredictionInfo] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const analyseStockHandler = async (threshold: number, days_out: number) => {
    try {
      setLoading(true);
      setError(false);
      updatePredictionData(null);

      const response = await axios.post(
        BASE_URL + "/api/analyseStock/",
        {
          ticker: stockData?.ticker,
          trend_threshold: threshold,
          prediction_days_out: days_out,
        },
        {
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );
      updatePredictionData(response.data);
      setShowPredictionInfo(false);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      console.error("Error getting stock data:", error);
    }
  };

  const getCookie = (name: string) => {
    const cookieValue = document.cookie.match(
      "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return cookieValue ? cookieValue.pop() : "";
  };
  return (
    <main className="max-w-[1720px] w-full mx-auto px-4 pt-20">
      {loadingStock && (
        <div className="grid items-center justify-center h-full">
          <LoadingSpinner dimension={"w-24 h-24"} />{" "}
        </div>
      )}

      {stockData && !stockError && !loadingStock && (
        <>
          <StockChart />

          <div className="grid items-center justify-center w-full">
            {showPredictionInfo && (
              <div className="grid grid-cols-[auto_1fr] gap-x-8 items-center justify-center my-8  max-w-md w-full mx-auto">
                <button onClick={() => setShowPredictionInfo(false)}>
                  <BiArrowBack className="font-bold w-4 h-4" />
                </button>
                <h2 className="font-bold text-2xl text-center">
                  Stock Analysis
                </h2>
              </div>
            )}
            {showPredictionInfo && !loading && (
              <>
                <AnalysisForm
                  analyseStockHandler={(threshold, time) =>
                    analyseStockHandler(threshold, time)
                  }
                />
              </>
            )}
            {!showPredictionInfo && (
              <>
                {!showPredictionInfo && (
                  <div className=" grid grid-col gap-x-6 max-w-sm mx-auto h-full">
                    {" "}
                    <button
                      onClick={() => setShowPredictionInfo(true)}
                      type="button"
                      className="h-10 px-5 m-2 text-center max-w-md mx-auto text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-[#DBDBD7] disabled:text-[#A8A8A4]"
                      disabled={stockData.data.length < 1}
                    >
                      Analyse Stock
                    </button>{" "}
                    {/* <button
                      onClick={() => setShowPredictionInfo(true)}
                      type="button"
                      className="h-10 px-5 m-2 text-center max-w-md mx-auto text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800"
                    >
                      Predict Stock
                    </button> */}
                  </div>
                )}
              </>
            )}

            {loading && (
              <>
                <LoadingSpinner dimension="w-10 h-10" />{" "}
                <p className="text-center mt-3">
                  Analysing Stock... <br />
                  This would take some minutes
                </p>
              </>
            )}
            {predictionData && <Predictions />}
          </div>
        </>
      )}

      {error && (
        <p className="text-center my-7 text-red-600 ">Error: {error}</p>
      )}
    </main>
  );
};

export default HomePage;
