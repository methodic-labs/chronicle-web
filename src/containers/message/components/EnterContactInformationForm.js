// @flow
import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Colors,
  // $FlowFixMe
  Grid,
  Input,
  Typography
} from 'lattice-ui-kit';
// $FlowFixMe
import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';

const { NEUTRAL } = Colors;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding-bottom: 15px;
`;

const GridItem = styled(Grid)`
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
        <GridItem item xs={6}>
          <Typography>Participant ID</Typography>
        </GridItem>
        <GridItem item xs={6}>
          <Typography>Phone Number</Typography>
        </GridItem>
      </Grid>
      <List>
        {
          targetParticipants.entrySeq().map(([id, contact]) => (
            <ListItem key={id}>
              <Grid container justify="center">
                <Grid item xs={6}>
                  <Typography>{id}</Typography>
                </Grid>
                <Grid item xs={6}>
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
