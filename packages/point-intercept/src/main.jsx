import React from 'react';
import { PlotPoints, pointUtils as utils } from '@pie-lib/charting';
import PropTypes from 'prop-types';
import Controls from './controls';
import debug from 'debug';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { Feedback } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';

const log = debug('pie-ui:point-intercept:main');

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    session: PropTypes.shape({
      points: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired
        })
      )
    }),
    onSessionChange: PropTypes.func,
    model: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const points = props.session.points || [];

    this.state = {
      session: { ...props.session, points },
      selection: [],
      showCorrect: false
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const points = nextProps.session.points || [];
    const session = { ...nextProps.session, points };

    this.setState({ session });
  }

  addPoint = p => {
    const { pointLabels } = this.props.model;
    const points = utils.addPoint(this.state.session.points, p, pointLabels);
    const session = { ...this.state.session, points };

    log('[addPoint] points: ', session.points);

    this.setState({ session }, this.callOnSessionChange);
  };

  selectionChange = selection => {
    log('[selectionChange]: ', selection);
    this.setState({ selection });
  };

  callOnSessionChange = () => {
    const { onSessionChange } = this.props;

    if (onSessionChange) {
      onSessionChange(this.state.session);
    }
  };

  deleteSelection = () => {
    const points = utils.removePoints(
      this.state.session.points,
      this.state.selection
    );

    const session = { ...this.state.session, points };
    this.setState({ session, selection: [] }, this.callOnSessionChange);
  };

  movePoint = (from, to) => {
    const points = utils.swapPoint(this.state.session.points, from, to);
    const session = { ...this.state.session, points };
    const selection = utils.swapPoint(this.state.selection, from, to);
    this.setState({ session, selection }, this.callOnSessionChange);
  };

  buildPoints = () => {
    const { model } = this.props;
    const { session, showCorrect } = this.state;

    if (model.correctResponse) {
      if (showCorrect) {
        return model.correctResponse.map(p => ({ ...p, correct: true }));
      } else {
        return session.points.map(p => ({
          ...p,
          correct: utils.hasPoint(
            model.correctResponse,
            p,
            model.pointsMustMatchLabels
          )
        }));
      }
    } else {
      return session.points;
    }
  };

  toggleShowCorrect = show => {
    this.setState({ showCorrect: show });
  };

  render() {
    const { model, classes } = this.props;
    const { selection, showCorrect } = this.state;
    const points = this.buildPoints();

    return (
      <div style={{ width: `${model.width}px` }}>
        <div className={classes.main}>
          <CorrectAnswerToggle
            className={classes.toggle}
            show={
              model.correctness && model.correctness.correctness !== 'correct'
            }
            toggled={showCorrect}
            onToggle={this.toggleShowCorrect}
          />
          {!model.disabled && (
            <Controls
              disabled={!(selection && selection.length > 0)}
              onDeleteClick={this.deleteSelection}
            />
          )}
          <PlotPoints
            title={model.title}
            width={model.width}
            height={model.height}
            domain={model.domain}
            range={model.range}
            disabled={model.disabled}
            showPointCoordinates={model.showCoordinates}
            showPointLabels={model.showPointLabels}
            showAxisLabels={model.showAxisLabels}
            maxNoOfPoints={model.maxPoints}
            onAddPoint={this.addPoint}
            onSelectionChange={this.selectionChange}
            onMovePoint={this.movePoint}
            points={points}
            selection={selection}
          />
        </div>
        {model.feedback && (
          <Feedback
            correctness={model.correctness.correctness}
            feedback={model.feedback}
            width={model.width - 20}
          />
        )}
      </div>
    );
  }
}

const styles = theme => ({
  toggle: {
    paddingBottom: theme.spacing.unit * 3
  }
});

export default withStyles(styles)(Main);
