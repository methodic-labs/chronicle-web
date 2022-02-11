import {
  Card,
  CardHeader,
  CardSegment,
} from 'lattice-ui-kit';

const EnrollmentLink = () => (
  <>
    <Card>
      <CardHeader mode="danger">
        Page Not Found
      </CardHeader>
      <CardSegment>
        You have tried to open the Chronicle enrollment link in a web browser. Please install the
        Chronicle mobile application and try opening the link again.
      </CardSegment>
    </Card>
  </>
);

export default EnrollmentLink;
