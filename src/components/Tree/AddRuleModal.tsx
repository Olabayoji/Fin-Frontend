import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import * as Yup from "yup";
import { TreeItem } from "./TreeComponent";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rule: any) => void;
  node: TreeItem;
  tree?: TreeItem;
};
export interface RuleDatum {
  category: string;
  value: string;
  rule: string;
}
const AddRuleModal = (props: Props) => {
  const [analysisInfo, setAnalysisInfo] = useState({
    category: "",
    value: "",
    rule: "",
  });

  const decisionValues = ["up trend", "no trend", "down trend"];
  const ruleValues = [
    "MACD",
    "stochasticStatus",
    "MACD_Signal",
    "MACD_Difference",
    "MACD_Crossover",
    "SMA_50",
    "SMA_200",
    "SMA_Crossover",
    "EMA",
    "Bollinger_Band",
    "Upper_Band",
    "Lower_Band",
    "RSI",
    "rsiStatus",
    "Mass_Index",
    "ROC",
    "OBV",
    "Volume",
    "WilliamsR",
  ];

  return props.isOpen ? (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto   fixed inset-0 z-50 outline-none focus:outline-none ">
        <div className="relative w-auto my-6 mx-auto max-w-3xl min-w-[500px]">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-between p-3 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl font-semibold">Decision Path</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={props.onClose}
              >
                <span className="bg-transparent text-black font-bold  h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <Formik
              initialValues={analysisInfo}
              onSubmit={(values: any, { setSubmitting }: any) => {
                props.onSubmit(values);
                props.onClose();
              }}
              validationSchema={Yup.object({
                category: Yup.string().required("Required"),
                value: Yup.string().required("Required"),
              })}
            >
              {({ isSubmitting, values }) => (
                <Form className="grid items-center relative mt-8 mx-auto  w-full px-8">
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12 items-center">
                    <div className="grid relative">
                      <div className="grid grid-cols-[1fr_auto] ">
                        <label className="text-sm" htmlFor="category">
                          Category
                          <span className="text-red-500">*</span>
                        </label>

                        <div className="group  w-max">
                          <button>
                            {" "}
                            <AiOutlineQuestionCircle />
                          </button>
                          <span className="pointer-events-none absolute -top-[72%] text-justify left-0 w-max max-w-sm rounded bg-slate-700 px-2 py-1 text-sm  text-gray-50 opacity-0 shadow transition-opacity group-hover:opacity-100"></span>
                        </div>
                      </div>

                      <Field
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                        as="select"
                        name="category"
                      >
                        <option value={""}>Select</option>
                        <option value="rule">Rule</option>
                        {!!props.tree && (
                          <option value="decision">Decision</option>
                        )}
                      </Field>
                      <p className="text-xs text-red-600 ">
                        <ErrorMessage name="category" />
                      </p>
                    </div>
                    {values.category.toLowerCase() === "rule" && (
                      <div className="grid">
                        <label className="text-sm" htmlFor="rule">
                          Rule
                          <span className="text-red-500">*</span>
                        </label>

                        <Field
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                          as="select"
                          name="rule"
                        >
                          <option value={""}>Select</option>
                          {ruleValues.map((rule) => (
                            <option
                              key={rule}
                              className="capitalize"
                              value={rule}
                            >
                              {rule}
                            </option>
                          ))}
                        </Field>
                        <p className="text-xs text-red-600 absolute bottom-[65px]">
                          <ErrorMessage name="rule" />
                        </p>
                      </div>
                    )}
                    {values.category.toLowerCase() === "decision" && (
                      <div className="grid">
                        <label className="text-sm" htmlFor="value">
                          Trend
                          <span className="text-red-500">*</span>
                        </label>

                        <Field
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                          as="select"
                          name="value"
                        >
                          <option value={""}>Select</option>
                          {decisionValues.map((decision) => (
                            <option
                              key={decision}
                              className="capitalize"
                              value={decision}
                            >
                              {decision}
                            </option>
                          ))}
                        </Field>
                        <p className="text-xs text-red-600 absolute bottom-[65px]">
                          <ErrorMessage name="value" />
                        </p>
                      </div>
                    )}
                    {values.category.toLowerCase() === "rule" && (
                      <div className="grid">
                        <label className="text-sm" htmlFor="value">
                          Value
                          <span className="text-red-500">*</span>
                        </label>

                        <Field
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                          type="number"
                          name="value"
                          id="value"
                          step="any"
                        />
                        <p className="text-xs text-red-600 absolute bottom-[65px]">
                          <ErrorMessage name="value" />
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end p-3 mt-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={props.onClose}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Add
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            {/*footer*/}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  ) : null;
};

export default AddRuleModal;
