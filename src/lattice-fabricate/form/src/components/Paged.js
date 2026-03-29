// @flow
import {
  useReducer,
  useRef
} from 'react';
import type { Node } from 'react';

import isFunction from 'lodash/isFunction';

import { getCurrentFormData } from './PageUtils';

const reducer = (state :Object, action :Object) => {
  switch (action.type) {
    case 'page': {
      const { page, formData } = action;
      return { ...state, page, pagedData: formData };
    }

    default:
      return state;
  }
};

type Props = {
  initialFormData ?:Object;
  page ?:number;
  render :(...props :any) => Node;
  onPageChange ?:(currentPage :number, formData :Object) => void;
};

const Paged = (props :Props) => {
  const {
    initialFormData,
    onPageChange,
    page = 0,
    render,
  } = props;

  const [state, dispatch] = useReducer(reducer, { page, pagedData: initialFormData });
  const formRef = useRef();

  const { page: currentPage, pagedData } = state;

  const setPage = (newPageNumber :number) => {
    const pageNumber = Number.isInteger(newPageNumber) ? newPageNumber : 0;
    const formData = getCurrentFormData(formRef, pagedData);
    dispatch({ type: 'page', page: pageNumber, formData });
    if (isFunction(onPageChange)) onPageChange(pageNumber, formData);
  };

  const onBack = () => {
    setPage(currentPage - 1);
  };

  const onNext = () => {
    setPage(currentPage + 1);
  };

  const validateAndSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return render({
    formRef,
    onBack,
    onNext,
    page: currentPage,
    pagedData,
    setPage,
    validateAndSubmit
  });
};

export default Paged;
