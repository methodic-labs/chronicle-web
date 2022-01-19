// @flow
import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Checkbox,
  Colors
} from 'lattice-ui-kit';

const { NEUTRAL } = Colors;

const StyledCell = styled.td`
  padding: 10px;
  word-wrap: break-word;
`;

const RowWrapper = styled.tr.attrs(() => ({ tabIndex: '1' }))`
  border-bottom: 1px solid ${NEUTRAL.N100};

  :focus {
    outline: none;
  }
`;

const CellContent = styled.div`
  display: flex;
  font-size: 15px;
  overflow: hidden;
  color: ${NEUTRAL.N800};
  justify-content: ${(props) => (props.centerContent ? 'center' : 'flex-start')};
`;

const ParticipantRow = ({
  data,
  handleOnSelect,
  targetParticipants
} :{
  data :Object;
  handleOnSelect :(participants :Map) => void;
  targetParticipants :Map;
}) => {
  const checked = targetParticipants.has(data.id);

  const onChange = () => {
    if (checked) {
      handleOnSelect(targetParticipants.delete(data.id));
    }
    else {
      handleOnSelect(targetParticipants.set(data.id, Map()));
    }
  };

  return (
    <>
      <RowWrapper onClick={() => {}}>
        <StyledCell>
          <CellContent>
            { data.id }
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            <Checkbox
                aria-label="select-participant"
                checked={checked}
                data-id={data.id}
                name="select-participant"
                onChange={onChange} />
          </CellContent>
        </StyledCell>
      </RowWrapper>
    </>
  );
};

export default ParticipantRow;
