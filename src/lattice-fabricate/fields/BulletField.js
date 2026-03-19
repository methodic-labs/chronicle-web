/*
 * @flow
 */

import styled from 'styled-components';

const Bullet = styled.li`
  font-size: 14px;
  list-style-type: disc;
  margin: 8px 0 0 20px;
`;

type Props = {
  formData :string;
};

const BulletField = ({ formData } :Props) => {

  if (typeof formData === 'string' && formData.length) {
    return (
      <Bullet>{formData}</Bullet>
    );
  }

  return null;
};

export default BulletField;
