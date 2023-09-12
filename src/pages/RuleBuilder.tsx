import React from "react";
import TreeComponent from "../components/Tree/TreeComponent";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { Link } from "react-router-dom";

type Props = {};

const RuleBuilder = (props: Props) => {
  return (
    <main className="max-w-[1720px] w-full mx-auto px-4 pt-20">
      <h2 className="mt-7 grid grid-cols-[1fr_auto] gap-x-2 w-fit">
        <span className="font-bold  capitalize text-lg">
          Build your decision tree
        </span>
        <span className="group  w-max">
          <button>
            <AiOutlineQuestionCircle className="w-3 h-3" />
          </button>
          <span className="pointer-events-none absolute text-justify w-max max-w-[300px] rounded font-normal bg-slate-700 px-2 py-1 text-sm z-[100000]  text-gray-50 opacity-0 shadow transition-opacity group-hover:opacity-100">
            Construct a visual representation of various decision paths and
            their possible outcomes.
          </span>
        </span>
      </h2>
      <TreeComponent />
    </main>
  );
};

export default RuleBuilder;
