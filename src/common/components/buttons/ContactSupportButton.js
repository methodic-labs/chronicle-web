import { CircleQuestionMarkIcon } from 'lucide-react';
import styled from 'styled-components';

import { Button } from '../../../lattice-ui-kit';

const ButtonWrapper = styled(Button)`
  bottom: 16px;
  position: fixed;
  right: 16px;
  width: 200px;
  background-color: white;
  z-index: 500;
`;

const ContactSupportButton = () => (
  <ButtonWrapper
      href="mailto:support@getmethodic.com"
      startIcon={<CircleQuestionMarkIcon size={20} />}
      target="_blank"
      variant="outlined">
    Contact Support
  </ButtonWrapper>
);

export default ContactSupportButton;
