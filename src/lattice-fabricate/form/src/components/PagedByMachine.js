// @flow
import {
  useEffect,
  useReducer,
  useRef
} from 'react';
import type { Node } from 'react';

import isFunction from 'lodash/isFunction';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';

import { getCurrentFormData } from './PageUtils';

type Props = {
  initialFormData ?:Object;
  machine :Machine;
  machineOptions ?:Object;
  page ?:string;
  render :(...props :any) => Node;
  onPageChange ?:(pageName :string, formData :Object) => void;
};

const reducer = (state :Object, action :Object) => {
  switch (action.type) {
    case 'page': {
      const { formData } = action;
      return { ...state, pagedData: formData };
    }

    default:
      return state;
  }
};

const PagedByMachine = (props :Props) => {
  const {
    initialFormData,
    machine,
    machineOptions,
    page,
    onPageChange,
    render,
  } = props;

  const [state, dispatch] = useReducer(reducer, { pagedData: initialFormData });
  const [machineState, send] = useMachine(machine, machineOptions);
  const formRef = useRef();

  useEffect(() => {
    if (isFunction(onPageChange)) onPageChange(machineState.value, state.pagedData);
  }, [machineState.value, state.pagedData, onPageChange]);

  const { pagedData } = state;

  const onBack = () => {
    const formData = getCurrentFormData(formRef, pagedData);
    dispatch({ type: 'page', formData });
    send('PREV');
  };

  const onNext = () => {
    const formData = getCurrentFormData(formRef, pagedData);
    dispatch({ type: 'page', formData });
    send('NEXT');
  };

  const validateAndSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return render({
    formRef,
    machineState,
    onBack,
    onNext,
    page: page || machineState.value,
    pagedData,
    validateAndSubmit
  });
};

PagedByMachine.defaultProps = {
  page: undefined,
};

export default PagedByMachine;
