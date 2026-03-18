// @flow
import { forwardRef } from 'react';
import type { ElementRef } from 'react';

import isFunction from 'lodash/isFunction';
import styled from 'styled-components';

import { transformErrors } from './FormUtils';
import { ActionGroup, StyledForm } from './styled';

import { Button } from '../../../../lattice-ui-kit';
import * as fields from '../../../fields';
import * as widgets from '../../../widgets';
import { ArrayFieldTemplate, FieldTemplate, ObjectFieldTemplate } from '../../../templates';

const HiddenButton = styled.button`
  display: none;
`;

type Props = {
  disabled ?:boolean;
  hideSubmit ?:boolean;
  isSubmitting ?:boolean;
  onChange ?:() => void;
  onDiscard ?:() => void;
  onSubmit ?:() => void;
  readOnly ?:boolean;
};

type FormProps = {
  ...Props,
  forwardedRef :ElementRef<typeof StyledForm>
};

const Form = (props :FormProps) => {

  const {
    disabled,
    forwardedRef,
    hideSubmit,
    isSubmitting,
    onChange,
    onDiscard,
    onSubmit,
    readOnly,
    ...restProps
  } = props;

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    // $FlowFixMe
    <StyledForm
        ArrayFieldTemplate={ArrayFieldTemplate}
        FieldTemplate={FieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        disabled={disabled || readOnly}
        fields={fields}
        onChange={onChange}
        onSubmit={onSubmit}
        ref={forwardedRef}
        showErrorList={false}
        transformErrors={transformErrors}
        widgets={widgets}
        {...restProps}>
      {
        (disabled || readOnly || hideSubmit)
          ? <HiddenButton type="submit" />
          : (
            <ActionGroup>
              <Button color="primary" variant="contained" type="submit" isLoading={isSubmitting}>Submit</Button>
              { isFunction(onDiscard) && <Button onClick={onDiscard}>Discard</Button> }
            </ActionGroup>
          )
      }
    </StyledForm>
  );
  /* eslint-enable */
};

/* eslint-disable react/default-props-match-prop-types */
Form.defaultProps = {
  disabled: false,
  hideSubmit: false,
  isSubmitting: false,
  onChange: undefined,
  onDiscard: undefined,
  onSubmit: undefined,
  readOnly: false,
};

/* eslint-enable */

/* eslint-disable react/jsx-props-no-spreading */
export default forwardRef<Props, typeof StyledForm>((props, ref) => (
  <Form {...props} forwardedRef={ref} />
));
/* eslint-enable */
