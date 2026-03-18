// @flow

declare type WidgetProps = {|
  autofocus :boolean;
  disabled :boolean;
  formContext :Object;
  id :string;
  label ? :string;
  name :string;
  onBlur :(id :string, value :any) => void;
  onChange :(value :any) => void;
  onFocus :(id :string, value :any) => void;
  options :Object;
  placeholder ? :string;
  rawErrors :string[];
  readonly :boolean;
  registry :Object;
  required :boolean;
  schema :Object;
  type :string;
  value :any;
|};

export type {
  // eslint-disable-next-line import/prefer-default-export
  WidgetProps
};
