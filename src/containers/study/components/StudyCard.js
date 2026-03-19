import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import * as Routes from '../../../core/router/Routes';
import { goToRoute } from '../../../core/router/RoutingActions';
import {
  Card,
  CardSegment,
  Typography
} from '../../../lattice-ui-kit';

const StyledCard = styled(Card)`
  height: 100%;
`;

class StudyCard extends Component {
  handleCardClick = (event) => {
    const { actions } = this.props;
    const { currentTarget } = event;
    const { dataset } = currentTarget;
    const { studyId } = dataset;

    actions.goToRoute(Routes.STUDY.replace(Routes.STUDY_ID_PARAM, studyId));
  }

  render() {
    const { study } = this.props;
    return (
      <StyledCard onClick={this.handleCardClick} data-study-id={study.id}>
        <CardSegment vertical>
          <Typography variant="h4" gutterBottom>
            {study.title}
          </Typography>
          <Typography>
            {study.description}
          </Typography>
        </CardSegment>
      </StyledCard>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    goToRoute
  }, dispatch)
});

export default connect(null, mapDispatchToProps)(StudyCard);
