// @flow
const getCurrentFormData = (formRef :Object, defaultFormData :Object) => {
  let newPagedData = defaultFormData;
  if (formRef.current) {
    const {
      state: {
        formData
      } = {}
    } = formRef.current;
    newPagedData = formData;
  }

  return newPagedData;
};

export {
  getCurrentFormData,
};
