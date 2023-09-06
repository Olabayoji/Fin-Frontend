import Select, { MultiValue } from "react-select";

type Props = {
  indicators: string[];
  handleIndicatorSelect: (
    indicators: MultiValue<{ label: string; value: string }>
  ) => void;
  selectedIndicators: any;
};

const SelectComponent = (props: Props) => {
  const options = props.indicators.map((indicator) => ({
    label: indicator,
    value: indicator,
  }));

  return (
    <Select
      defaultValue={props.selectedIndicators}
      isMulti
      name="indicators"
      onChange={props.handleIndicatorSelect}
      options={options}
      className="basic-multi-select max-w-lg"
      classNamePrefix="select"
    />
  );
};

export default SelectComponent;
