const transformErrors = (errors) => {
  const skip = [
    'should match exactly one schema in oneOf',
    'should be equal to one of the allowed values'
  ];
  return errors.filter((error) => !skip.includes(error.message));
};

export {
  transformErrors
};
