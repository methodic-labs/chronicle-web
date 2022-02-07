import { faCopy } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Card,
  CardHeader,
  CardSegment,
} from 'lattice-ui-kit';

import copyToClipboard from '../../utils/copyToClipboard';

const EnrollmentLink = () => {
  const enrollmentLinkQueryParams = window.location.hash.split('?')[1];
  const enrollmentLink = `http://openlattice.com/chronicle/login?${enrollmentLinkQueryParams}`;
  return (
    <>
      <Card>
        <CardHeader mode="danger">
          Page Not Found
        </CardHeader>
        <CardSegment>
          You have tried to open a mobile link in a web browser. Please install the Chronicle mobile application
          and open the link on a mobile device.
        </CardSegment>
        <CardSegment>
          {enrollmentLink}
          <div>
            <Button
                aria-label="Copy enrollment link"
                onClick={() => copyToClipboard(enrollmentLink)}
                startIcon={<FontAwesomeIcon icon={faCopy} />}>
              Click to Copy
            </Button>
          </div>
        </CardSegment>
      </Card>
    </>
  );
};

export default EnrollmentLink;
