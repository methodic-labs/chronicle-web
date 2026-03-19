// @flow
import { MarkdownEditor } from '../../../lattice-ui-kit';
import type { WidgetProps } from '../types';

const MarkdownEditorWidget = (props :WidgetProps) => {
  const handleChange = (event :SyntheticInputEvent<HTMLTextAreaElement>) => {
    const { onChange, options } = props;
    const { value } :HTMLTextAreaElement = event.currentTarget;
    if (onChange) {
      onChange(value === '' ? options.emptyValue : value);
    }
  };

  const handleFocus = (e :SyntheticFocusEvent<HTMLTextAreaElement>) => {
    const { onFocus, id } = props;
    const { value } = e.currentTarget;
    if (onFocus) {
      onFocus(id, value);
    }
  };

  const handleBlur = (e :SyntheticFocusEvent<HTMLTextAreaElement>) => {
    const { onBlur, id } = props;
    const { value } = e.currentTarget;
    if (onBlur) {
      onBlur(id, value);
    }
  };

  const {
    autofocus,
    disabled,
    id,
    options,
    rawErrors,
    readonly,
    value,
  } = props;

  return (
    <MarkdownEditor
        autoFocus={autofocus}
        disabled={disabled}
        id={id}
        invalid={rawErrors && rawErrors.length}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        readOnly={readonly}
        rows={options.rows || 4}
        value={value} />
  );
};

export default MarkdownEditorWidget;
