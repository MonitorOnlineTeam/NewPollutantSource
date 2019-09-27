import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import styles from './style.less'


class UnlimitedMarqueeItem extends Component {
  render() {
    const { dataItem } = this.props;

    return (
      <div className={styles["item-div"]}>
        <a className={styles["item-a"]} href={dataItem.url || "javascript:void(0)"} title={dataItem.desc}>{dataItem.desc}</a>
      </div>
    );
  }
}

UnlimitedMarqueeItem.propTypes = {
  dataItem: PropTypes.object.isRequired,
}
export default UnlimitedMarqueeItem;
