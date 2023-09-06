import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { DataContext } from "../util/DataContext";
import { BASE_URL } from "../util/util";

type Props = {};

const DatePicker = (props: Props) => {
  const {
    updateStockData,
    loadingStockHandler,
    stockErrorHandler,
    stockData,
    duration,
    updateDuration,
  } = useContext(DataContext);

  const handleValueChange = (newValue: any) => {
    updateDuration({
      startDate: newValue.startDate,
      endDate: newValue.endDate,
    });
    getStockData(newValue.startDate, newValue.endDate);
  };

  const getStockData = async (start: string, end: string) => {
    try {
      loadingStockHandler(true);
      stockErrorHandler(false);

      const response = await axios.post(
        BASE_URL + "/api/stock_data/",
        {
          ticker: stockData!.ticker,
          start_date: start,
          end_date: end,
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
  let today: Date = new Date();
  let endDate: string = today.toISOString().split("T")[0];
  return (
    <Datepicker
      value={duration}
      onChange={handleValueChange}
      showShortcuts={true}
      configs={{
        shortcuts: {
          past: (period) => `Last ${period} days`,
          currentMonth: "This Month",
          pastMonth: "Last Month",
          customToday: {
            text: "YTD",
            period: {
              start: "1900-07-24",
              end: endDate,
            },
          },
        },
      }}
    />
  );
};

export default DatePicker;
