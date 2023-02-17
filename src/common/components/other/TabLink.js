import styled from 'styled-components';
import { Colors, StyleUtils } from 'lattice-ui-kit';
import { NavLink } from 'react-router-dom';

const { NEUTRAL, PURPLE } = Colors;
const { media } = StyleUtils;

const TabLink = styled(NavLink)`
  border-bottom: 2px solid transparent;
  color: ${NEUTRAL.N600};
  font-size: 18px;
  font-weight: 500;
  line-height: 70px;
  margin-right: 40px;
  outline: none;
  text-decoration: none;

  :focus {
    text-decoration: none;
  }

  :hover {
    color: ${NEUTRAL.N800};
    cursor: pointer;
  }

  &.last-child {
    margin-right: 0;
  }

  &.active {
    border-bottom: 2px solid ${PURPLE.P300};
    color: ${PURPLE.P300};
  }

  ${media.phone`
    line-height: 2;
    font-size:  16px;
  `}
`;

export default TabLink;
