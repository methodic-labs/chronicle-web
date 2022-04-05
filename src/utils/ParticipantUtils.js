// @flow

const getParticipantsEntitySetName = (studyId :UUID) => {
  const participantsPrefix = 'chronicle_participants_';
  return `${participantsPrefix}${studyId}`;
};

export {
  getParticipantsEntitySetName
};
