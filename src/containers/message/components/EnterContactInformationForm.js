// @flow
import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Colors,
  Grid,
  Input,
  List,
  ListItem,
  ListItemText,
  Typography
} from 'lattice-ui-kit';
// $FlowFixMe
import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';

const { NEUTRAL } = Colors;

const GridItem = styled(Grid).attrs({ item: true })`
  background-color: ${NEUTRAL.N00};
  border-bottom: 1px solid ${NEUTRAL.N100};
  margin-top: 15px;
`;

const EnterContactInformationForm = ({
  targetParticipants,
  setTargetParticipants,
} :{
  targetParticipants :Map;
  setTargetParticipants :(participants :Map) => void;
}) => {

  const handleOnChange = (e :SyntheticInputEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace('[^\\d.]', '');
    const phoneNumber = numericValue.length <= 4 ? numericValue : new AsYouType('US').input(numericValue);
    const contact = Map().withMutations((mutableMap) => {
      mutableMap.set('phone', phoneNumber);
      mutableMap.set('error', !isValidPhoneNumber(phoneNumber, 'US'));
    });
    setTargetParticipants(targetParticipants.set(name, contact));
  };

  return (
    <>
      <Grid container justify="center">
        <GridItem xs={6}>
          <Typography>Participant ID</Typography>
        </GridItem>
        <GridItem xs={6}>
          <Typography>Phone Number</Typography>
        </GridItem>
      </Grid>
      <List>
        {
          targetParticipants.entrySeq().map(([id, contact]) => (
            <ListItem key={id}>
              <Grid container justify="center">
                <Grid xs={6}>
                  <ListItemText>{id}</ListItemText>
                </Grid>
                <Grid xs={6}>
                  <Input
                      error={contact.get('error', false)}
                      name={id}
                      value={contact.get('phone', '')}
                      onChange={handleOnChange} />
                </Grid>
              </Grid>
            </ListItem>
          ))
        }
      </List>
    </>
  );
};

export default EnterContactInformationForm;
