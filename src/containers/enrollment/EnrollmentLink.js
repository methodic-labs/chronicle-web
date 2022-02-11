// @flow
import { faCopy } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Card,
  CardHeader,
  CardSegment,
} from 'lattice-ui-kit';

import copyToClipboard from '../../utils/copyToClipboard';

type Props = {
  queryString :string;
};

const EnrollmentLink = ({ queryString } :Props) => {
  const enrollmentLink = `http://openlattice.com/chronicle/login?${queryString}`;
  return (
    <>
      <Card>
        <CardHeader mode="danger">
          Page Not Found
        </CardHeader>
        <CardSegment>
          You have tried to open the Chronicle enrollment link in a web browser. Please install the
          Chronicle mobile application and try opening the link again.
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
