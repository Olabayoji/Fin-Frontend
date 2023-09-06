import React from "react";

type Props = {
  tableData: {
    antecedents: string[];
    consequents: string[];
    "antecedent support": number;
    "consequent support": number;
    support: number;
    confidence: number;
    lift: number;
    leverage: number;
    conviction: number;
    zhangs_metric: number;
  };
};

const TableRow = (props: Props) => {
  return (
    <tr>
      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
        {props.tableData.antecedents}
      </td>
      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap text-left">
        {props.tableData.consequents[0] === "1"
          ? "Up Trend"
          : props.tableData.consequents[0] === "-1"
          ? "Down Trend"
          : "No Trend"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap text-left">
        {(props.tableData.confidence * 100).toFixed(2)}
      </td>
      <td className="px-6 py-4 text-sm text-left whitespace-nowrap">
        {(props.tableData.support * 100).toFixed(2)}
      </td>

      <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
        {props.tableData.conviction}
      </td>
    </tr>
  );
};

export default TableRow;
