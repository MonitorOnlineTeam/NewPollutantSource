
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Checkbox
} from 'antd'
import { connect } from 'dva';

@connect(({ loading, autoForm }) => ({
  configIdList: autoForm.configIdList,
}))
class SdlCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, data } = this.props;
    !data.length && dispatch({
      type: 'autoForm/getConfigIdList',
      payload: {
        configId
      }
    })
  }
  render() {
    const { configId, configIdList, data, itemValue, itemName } = this.props;
    const dataList = data.length ? data : configIdList[configId];
    return (
      <Checkbox.Group {...this.props}>
        {
          dataList.map(itm => {
            return <Checkbox key={itm.key} value={itm.key}>{itm.value}</Checkbox>
          })
        }
      </Checkbox.Group>
    );
  }
}


// SearchSelect.propTypes = {
//   // placeholder
//   placeholder: PropTypes.string,
//   // mode
//   mode: PropTypes.string,
//   // configId
//   configId: PropTypes.string.isRequired,
//   // itemName
//   itemName: PropTypes.string.isRequired,
//   // itemValue
//   itemValue: PropTypes.string.isRequired,
// }

export default SdlCheckbox;