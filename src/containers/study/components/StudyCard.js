/*
 * @flow
 */

import { Component } from 'react';

import styled from 'styled-components';
import {
  Card,
  CardSegment,
  Typography
} from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { RequestSequence } from 'redux-reqseq';

import * as Routes from '../../../core/router/Routes';
import { goToRoute } from '../../../core/router/RoutingActions';

const StyledCard = styled(Card)`
  height: 100%;
`;

type Props = {
  study :Object;
  actions:{
    goToRoute :RequestSequence
  };
}

class StudyCard extends Component<Props> {
  handleCardClick = (event :SyntheticEvent<HTMLElement>) => {
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

const mapDispatchToProps = (dispatch :() => void) => ({
  actions: bindActionCreators({
    goToRoute
  }, dispatch)
});

// $FlowFixMe
export default connect(null, mapDispatchToProps)(StudyCard);
