import { createContext, useState } from "react";
import { IOHLCData } from "./util";
import { TreeItem } from "../components/Tree/TreeComponent";

export const DataContext = createContext<{
  stockData: null | {
    ticker: string;
    data: IOHLCData[];
  };
  loadingStock: boolean;
  stockError: null | string;
  predictionData: null | any;
  accuracyData: null | {
    overall_accuracy?: number;
    class_accuracies?: Record<string, number>;
  };
  duration: { startDate: string | null; endDate: string | null };
  selectedIndicators: { label: string; value: string }[];
  tree: undefined | TreeItem;
  updateStockData: (data: any) => void;
  loadingStockHandler: (status: boolean) => void;
  stockErrorHandler: (status: any) => void;
  updatePredictionData: (data: any) => void;
  updateAccuracyData: (data: any) => void;
  updateTree: (data: any) => void;
  updateDuration: (data: any) => void;
  setSelectedIndicators: (data: any) => void;
}>({
  stockData: null,
  loadingStock: false,
  stockError: null,
  predictionData: null,
  accuracyData: null,
  tree: undefined,
  duration: { startDate: null, endDate: null },
  selectedIndicators: [],
  updateStockData: () => {},
  loadingStockHandler: () => {},
  stockErrorHandler: () => {},
  updatePredictionData: () => {},
  updateAccuracyData: () => {},
  updateDuration: () => {},
  updateTree: () => {},
  setSelectedIndicators: () => {},
});

interface ProviderProps {
  children: any;
}

export const DataProvider = (props: ProviderProps) => {
  let today: Date = new Date();
  let oneYearAgo: Date = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  let endDate: string = today.toISOString().split("T")[0];
  let startDate: string = oneYearAgo.toISOString().split("T")[0];

  const [stockData, setStockData] = useState(null);
  const [predictionData, setpredictionData] = useState(null);
  const [accuracyData, setAccuracyData] = useState(null);
  const [loadingStock, setLoadingStock] = useState<boolean>(false);
  const [stockError, setStockError] = useState<null | string>(null);
  const [tree, setTree] = useState<TreeItem | undefined>();
  const [treeAnalysis, setTreeAnalysis] = useState<TreeItem | undefined>();
  const [duration, setDuration] = useState({
    startDate: startDate,
    endDate: endDate,
  });
  const [selectedIndicators, setSelectedIndicators] = useState<
    { label: string; value: string }[]
  >([{ label: "Line Series", value: "Line Series" }]);

  const updateStockData = (data: any) => {
    setStockData(data);
  };

  const loadingStockHandler = (status: boolean) => {
    setLoadingStock(status);
  };

  const stockErrorHandler = (status: string) => {
    setStockError(status);
  };
  const updateTree = (status: TreeItem) => {
    setTree(status);
  };
  const updatePredictionData = (data: any) => {
    setpredictionData(data);
  };
  const updateAccuracyData = (data: any) => {
    setAccuracyData(data);
  };
  const updateDuration = (data: any) => {
    setDuration(data);
  };
  const setSelectedIndicatorsHandler = (data: any) => {
    setSelectedIndicators(data);
  };

  return (
    <DataContext.Provider
      value={{
        stockData: stockData,
        loadingStock: loadingStock,
        stockError: stockError,
        predictionData: predictionData,
        accuracyData: accuracyData,
        duration: duration,
        selectedIndicators: selectedIndicators,
        tree: tree,
        updateStockData: updateStockData,
        loadingStockHandler: loadingStockHandler,
        stockErrorHandler: stockErrorHandler,
        updateTree: updateTree,
        updatePredictionData: updatePredictionData,
        updateAccuracyData: updateAccuracyData,
        updateDuration: updateDuration,
        setSelectedIndicators: setSelectedIndicatorsHandler,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
