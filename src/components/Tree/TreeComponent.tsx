import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Tree, { ReactD3TreeItem } from "react-d3-tree";
import AddRuleModal, { RuleDatum } from "./AddRuleModal";
import { boolean } from "yup";
import { v4 } from "uuid";
import { DataContext } from "../../util/DataContext";
import LoadingSpinner from "../LoadingSpinner";
import { BASE_URL } from "../../util/util";

export type TreeItem = {
  name: string;
  attributes?: {
    id: string;
    category?: string;
    value?: string;
    label?: string;
  };
  children?: TreeItem[];
};

type Props = {};

const TreeComponent = (props: Props) => {
  const {
    tree,
    updateTree,
    predictionData,
    stockData,
    accuracyData,
    updateAccuracyData,
  } = useContext(DataContext);

  const [node, setNode] = useState<TreeItem | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allLeafDecided, setAllLeafDecided] = useState(false);
  const [loading, setLoading] = useState(false);

  const modifyNode = (
    id: string,
    tree: TreeItem,
    newNode: TreeItem
  ): TreeItem => {
    if (tree.attributes?.id === id) {
      return newNode;
    }

    if (tree.children) {
      return {
        ...tree,
        children: tree.children.map((child) => modifyNode(id, child, newNode)),
      };
    }

    return tree;
  };

  const handleSubmit = (datum: RuleDatum) => {
    if (tree === undefined) {
      updateTree({
        name: datum.rule,
        attributes: { id: v4(), category: "rule", value: datum.value },
        children: [
          {
            name: "",
            attributes: {
              id: v4(),
              category: "value",
              value: "false",
              label: "false",
            },
            children: [],
          },
          {
            name: "",
            attributes: {
              id: v4(),
              category: "value",
              value: "true",
              label: "true",
            },
            children: [],
          },
        ],
      });
      setIsModalOpen(false);
      return;
    }

    if (node) {
      let newNode: TreeItem;

      if (datum.category === "decision") {
        newNode = {
          name: datum.value,
          attributes: {
            id: node.attributes?.id || v4(),
            category: datum.category,
            value: datum.value,
          },
        };
      } else {
        newNode = {
          name: datum.category === "rule" ? datum.rule : datum.value,
          attributes: {
            id: node.attributes?.id || v4(),
            category: datum.category,
            value: datum.value,
          },
          children: node.children, // Keep existing children
        };

        if (datum.category === "rule") {
          // Add the two new child nodes for a rule
          newNode.children = [
            {
              name: "",
              attributes: { id: v4(), category: "", value: "false" },
              children: [],
            },
            {
              name: "",
              attributes: { id: v4(), category: "", value: "true" },
              children: [],
            },
          ];
        }
      }

      const newTree = modifyNode(node.attributes!.id, tree, newNode);
      updateTree(newTree);
      setNode(undefined);
    }

    setIsModalOpen(false);
  };

  //This method checks if tree is valid
  const checkAllLeafNodesDecision = (tree?: TreeItem): boolean => {
    // Check if the tree is defined
    if (!tree) return false;

    // Check if there are children
    if (tree.children && tree.children.length > 0) {
      return tree.children.every(checkAllLeafNodesDecision);
    }

    return tree.attributes?.category === "decision";
  };

  // centre tree
  const treeContainerRef = useRef<HTMLDivElement | null>(null);
  const translate = useMemo(() => {
    const treeContainer = treeContainerRef.current;
    if (treeContainer) {
      return {
        x: treeContainer.offsetWidth / 2,
        y: treeContainer.offsetHeight / 4,
      };
    }
    return { x: 0, y: 0 };
  }, [treeContainerRef.current]);

  const analyseTree = async (treeData: any) => {
    const url = BASE_URL + "/api/analyseTree/";
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker: predictionData?.ticker
            ? predictionData.ticker
            : stockData?.ticker
            ? stockData.ticker
            : "TSLA",
          tree: treeData,
          trend_threshold: predictionData?.trend_threshold
            ? predictionData.trend_threshold
            : 0.1,
          prediction_days_out: predictionData?.prediction_days_out
            ? predictionData.prediction_days_out
            : 1,
        }),
      });

      const result = await response.json();
      // console.log(result);
      if (response.status === 200) {
        // Handle success
        updateAccuracyData(result);
      } else {
        setLoading(false);
        // Handle errors
        alert("Error analysing tree: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      setLoading(false);
      console.error("Error sending tree data:", error);
      alert("Error sending tree data to server.");
      setLoading(false);
    }
    setLoading(false);
  };
  useEffect(() => {
    setAllLeafDecided(checkAllLeafNodesDecision(tree!));
  }, [tree]);

  return tree === undefined && !isModalOpen ? (
    <div className="grid justify-center">
      <button
        className="h-10 px-5 m-2 mt-9 text-center text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800"
        type="button"
        onClick={() => setIsModalOpen(true)}
      >
        Create Decision Tree
      </button>
    </div>
  ) : (
    <>
      {" "}
      {tree !== undefined && (
        <>
          <p className="text-center">
            <span className={"text-center"}>Decision Tree Valid:</span>{" "}
            {allLeafDecided ? (
              <span className="text-green-500 font-semibold">True</span>
            ) : (
              <span className="text-red-500 font-semibold">False</span>
            )}
          </p>
          {tree && !loading && (
            <div className="grid grid-cols-2 w-fit mx-auto gap-x-3 items-center">
              <button
                type="button"
                className="h-10 px-5 m-2 mt-9 mx-auto text-center text-gray-100 transition-colors duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800"
                onClick={() => {
                  updateTree(undefined);
                  updateAccuracyData(undefined);
                }}
              >
                Clear Tree
              </button>
              <button
                type="button"
                className={`${
                  !allLeafDecided
                    ? "cursor-not-allowed bg-[#DBDBD7] text-[#A8A8A4]"
                    : `text-gray-100 bg-gray-700 hover:bg-gray-800`
                } h-10 px-5 m-2 mt-9 mx-auto text-center grid items-center  transition-colors duration-150  rounded-lg focus:shadow-outline `}
                disabled={!allLeafDecided}
                onClick={() => analyseTree(tree)}
              >
                Analyse Tree
              </button>
            </div>
          )}
          {accuracyData && !loading && (
            <div className="flex justify-center items-center my-8 max-w-xl mx-auto gap-x-8">
              {/* Card for Class Accuracy */}
              <div className="flex flex-col p-4 bg-white shadow-md rounded-md border text-center flex-grow">
                <h2 className="font-semibold text-gray-700 mb-2 border-b">
                  Class Accuracy
                </h2>
                <ul>
                  {Object.entries(accuracyData!.class_accuracies!).map(
                    ([className, classAcc]) => (
                      <li key={className} className="mb-1">
                        <span className="font-semibold text-gray-700">
                          {className === "0"
                            ? "No Trend"
                            : className === "1"
                            ? "Up Trend"
                            : "Down Trend"}
                          :&nbsp;
                        </span>
                        <span className="font-semibold text-blue-500">
                          {(classAcc * 100).toFixed(2)}%
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
              {/* Card for Overall Accuracy */}
              <div className="flex flex-col p-4 bg-white shadow-md rounded-md border mr-4 text-center h-full flex-grow">
                <h2 className="font-semibold text-gray-700 mb-2 border-b">
                  Overall Accuracy
                </h2>
                <p className="text-xl font-extrabold text-blue-500 text-center">
                  {(accuracyData!.overall_accuracy! * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          )}
          {loading && (
            <div className="text-center">
              <LoadingSpinner />
              <p>Analysing your decision tree...</p>
            </div>
          )}
          <div
            className="relative"
            ref={treeContainerRef}
            id="treeWrapper"
            style={{ width: "100%", height: "50%" }}
          >
            <Tree
              data={tree!}
              orientation="vertical"
              onClick={(nodeDatum, evt) => {
                const clickedNode: TreeItem = {
                  name: nodeDatum.name || "",
                  attributes: {
                    id: nodeDatum.attributes?.id || v4(),
                    category: nodeDatum.attributes?.category,
                  },
                  children: nodeDatum.children as TreeItem[],
                };

                // if (clickedNode.attributes?.category === "decision") return;
                setNode(clickedNode);
              }}
              translate={translate}
              collapsible={false}
              allowForeignObjects
              nodeLabelComponent={{
                render: <NodeLabel />,
              }}
            />
          </div>
        </>
      )}
      <div className="grid justify-center">
        <a
          href="https://forms.gle/s8JtapoC2An1TqZE8"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white px-4 py-2 bg-green-600 rounded z-[100000]"
        >
          Take Survey
        </a>
      </div>
      <AddRuleModal
        isOpen={isModalOpen || Boolean(node)}
        onClose={() => {
          setNode(undefined);
          setIsModalOpen(false); // Close the modal when onClose is called
        }}
        onSubmit={(value) => handleSubmit(value)}
        node={node!}
        tree={tree}
      />
    </>
  );
};

export default TreeComponent;

const NodeLabel = ({ nodeData }: any) => {
  const labelX = (nodeData.parent?.x + nodeData.x) / 4;
  const labelY = (nodeData.parent?.y + nodeData.y) / 4;

  return (
    <p className=" text-sm flex flex-col gap-x-2 relative -right-3 font-semibold">
      {" "}
      <span className="">{nodeData.name}</span>
      {nodeData.name !== "" && nodeData.attributes.category === "rule" && (
        <span className="flex w-full justify-center gap-x-2">
          <span>{">"}</span>
          {nodeData.attributes?.value && (
            <span>{nodeData.attributes.value}</span>
          )}
        </span>
      )}
      {nodeData.name === "" && (
        <span className="flex gap-x-2">
          {nodeData.attributes?.value && (
            <span
              className={`${
                nodeData.attributes.value === "false"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {nodeData.attributes.value}
            </span>
          )}
        </span>
      )}
    </p>
  );
};
