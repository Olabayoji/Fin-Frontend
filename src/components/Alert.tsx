import React from "react";

type Props = {
  message: string;
  close: () => void;
};

const Alert = (props: Props) => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded absolute grid grid-cols-[1fr_auto] gap-x-3 w-full align-items-center"
      role="alert"
    >
      <div className="text-left place-self-center">
        <strong className="font-bold">Error. </strong>
        <p className="block sm:inline text-left">{props.message}</p>
      </div>

      <span className=" px-2 py-3" onClick={props.close}>
        <svg
          className="fill-current h-6 w-6 text-red-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </span>
    </div>
  );
};

export default Alert;
