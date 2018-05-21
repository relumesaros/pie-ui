import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

export class GridContent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    columns: PropTypes.number
  };
  static defaultProps = {
    columns: 2
  };

  render() {
    const { classes, className, children, columns } = this.props;

    const style = {
      gridTemplateColumns: `repeat(${columns}, 1fr)`
    };
    return (
      <div style={style} className={classNames(classes.gridContent, className)}>
        {children}
      </div>
    );
  }
}

const styles = theme => ({
  gridContent: {
    display: 'grid',
    columnGap: `${theme.spacing.unit}px`,
    gridColumnGap: `${theme.spacing.unit}px`,
    rowGap: `${theme.spacing.unit}px`,
    gridRowGap: `${theme.spacing.unit}px`,
    gridAutoRows: '1fr'
  }
});

export default withStyles(styles)(GridContent);