
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Radio
} from 'antd'
import { connect } from 'dva';

@connect(({ loading, autoForm }) => ({
  configIdList: autoForm.configIdList,
}))
class SdlRadio extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, data, configId } = this.props;
    if(!data.length) {
      console.log("props=", this.props)
    }
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
      <Radio.Group {...this.props}>
        {
          this.props.all && <Radio key={""} value={null}>全部</Radio>
        }
        {
          (dataList || []).map(radio => {
            return <Radio key={radio.key} value={radio.key}>{radio.value}</Radio>
          })
        }
      </Radio.Group>
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

export default SdlRadio;