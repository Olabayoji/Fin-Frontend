import MultiToggle from "react-multi-toggle";

type Props = {
  changeView: (view: string) => void;
  view: string;
};

const Toggle = (props: Props) => {
  const groupOptions = [
    {
      displayName: "Table",
      value: "table",
    },
    {
      displayName: "Scatter",
      value: "scatter",
    },
  ];

  return (
    <MultiToggle
      options={groupOptions}
      selectedOption={props.view}
      onSelectOption={(value: string) => props.changeView(value)}
      label="Select View"
    />
  );
};

export default Toggle;
