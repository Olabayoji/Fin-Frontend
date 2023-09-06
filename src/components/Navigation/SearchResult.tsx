import axios from "axios";
import { useContext } from "react";
import { DataContext } from "../../util/DataContext";
import { BASE_URL } from "../../util/util";

type Props = {
  data: any;
  close: () => void;
};

const SearchResult = (props: Props) => {
  const {
    updateStockData,
    loadingStockHandler,
    stockErrorHandler,
    updatePredictionData,
    duration,
  } = useContext(DataContext);
  const getStockData = async (ticker: string) => {
    try {
      loadingStockHandler(true);
      stockErrorHandler(false);
      updatePredictionData(null);
      props.close();
      const response = await axios.post(
        BASE_URL + "/api/stock_data/",
        {
          ticker: ticker,
          start_date: duration.startDate,
          end_date: duration.endDate,
        },
        {
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );
      updateStockData(response.data);
      loadingStockHandler(false);
    } catch (error: any) {
      stockErrorHandler(error.message);
      loadingStockHandler(false);
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
    <>
      <li
        onClick={() => getStockData(props.data.symbol)}
        key={props.data.symbol}
        className="bg-white rounded py-4 px-2 z-[100000] text-black grid grid-rows-1  md:grid-cols-2 md:gap-x-2 place-items-center hover:cursor-pointer hover:bg-white/80"
      >
        <p className="font-semibold md:place-self-start ml-2">
          {props.data.symbol}
        </p>
        <p className="truncate overflow-ellipsis overflow-hidden max-w-[150px] md:max-w-[170px] md:place-self-end mr-2">
          {props.data.name}
        </p>
      </li>
    </>
  );
};

export default SearchResult;
