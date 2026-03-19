import styled from 'styled-components';

const ActionGroup = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ noPadding }) => (noPadding ? '0' : '0 30px 30px 30px')};
`;

export default ActionGroup;
