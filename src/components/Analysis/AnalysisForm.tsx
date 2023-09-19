import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useState } from "react";

type Props = {
  analyseStockHandler: (threshold: number, time: number) => void;
};

const AnalysisForm = (props: Props) => {
  const [analysisInfo, setAnalysisInfo] = useState({
    threshold: 0,
    time_out: 0,
  });
  return (
    <Formik
      initialValues={analysisInfo}
      onSubmit={(values: any, { setSubmitting }: any) => {
        props.analyseStockHandler(values.threshold, values.time_out);
      }}
      validationSchema={Yup.object({
        threshold: Yup.number().required("Required"),
        time_out: Yup.number().required("Required"),
      })}
    >
      {({ isSubmitting }: any) => (
        <Form className="grid items-center relative mb-8 mx-auto max-w-md w-full">
          <div className="grid grid-cols-2 gap-x-12 items-center">
            <div className="grid">
              <div className="grid grid-cols-[1fr_auto] ">
                <label className="text-sm" htmlFor="threshold">
                  Threshold (%)
                  <span className="text-red-500">*</span>
                </label>

                <div className="group  w-max">
                  <button>
                    {" "}
                    <AiOutlineQuestionCircle />
                  </button>
                  <span className="pointer-events-none absolute -top-[72%] text-justify left-0 w-max max-w-sm rounded bg-slate-700 px-2 py-1 text-sm  text-gray-50 opacity-0 shadow transition-opacity group-hover:opacity-100">
                    The "threshold" is a criterion used to identify upward,
                    downward, or no significant trends in a stock. For example,
                    a 1% threshold means that any price movement greater than 1%
                    compared to the previous day is considered a significant
                    trend.
                  </span>
                </div>
              </div>
              <Field
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                type="number"
                name="threshold"
                min="0.5"
                max="10"
                step="0.5"
                id="threshold"
              />
              <p className="text-xs text-red-600 absolute bottom-[65px]">
                <ErrorMessage name="threshold" component="div" />
              </p>
            </div>
            <div className="grid">
              <div className="grid grid-cols-[1fr_auto] ">
                <label className="text-sm" htmlFor="time_out">
                  Time Out (days)
                  <span className="text-red-500">*</span>
                </label>

                <div className="group  w-max">
                  <button>
                    {" "}
                    <AiOutlineQuestionCircle />
                  </button>
                  <span className="pointer-events-none absolute -top-[65%] text-justify left-48 w-max max-w-sm rounded bg-slate-700 px-2 py-1 text-sm  text-gray-50 opacity-0 shadow transition-opacity group-hover:opacity-100">
                    The "time out" refers to the number of days into the future
                    for which you want to predict the trend of a stock. For
                    instance, if you set the time out to 5 days,the analysis
                    will predict the stock's trend in the next 5 days.
                  </span>
                </div>
              </div>
              <Field
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                type="number"
                name="time_out"
                min="1"
                id="time_out"
              />

              <p className=" text-red-600 absolute bottom-[65px]">
                <ErrorMessage
                  className="text-xs text-red-600"
                  name="time_out"
                  component="div"
                />
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="disabled:cursor-not-allowed h-10 px-5 m-2 mt-9 text-center text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800"
          >
            Analyse Stock
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AnalysisForm;
