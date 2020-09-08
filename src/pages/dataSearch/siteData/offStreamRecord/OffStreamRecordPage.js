import React, { PureComponent } from 'react'
import { Card, Modal, Form, Select, Input, DatePicker, Upload, message, Button } from 'antd';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { UploadOutlined } from '@ant-design/icons';
import cuid from 'cuid';
import moment from 'moment';
import { connect } from 'dva'

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const stopTypes = {
  1: "停产",
  2: "停炉",
  3: "停运"
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const configId = "OutputStopNew"

@connect(({ offStream, loading }) => ({
}))
class OffStreamRecordPage extends PureComponent {
  state = {
    uuid: cuid(),
    StopHours: "",
    searchParams: [{
      Key: '[dbo]__[T_Bas_OutputStop]__DGIMN',
      Value: this.props.DGIMN,
      Where: '$=',
    }],
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.setState({
        searchParams: [{
          Key: '[dbo]__[T_Bas_OutputStop]__DGIMN',
          Value: this.props.DGIMN,
          Where: '$=',
        }]
      }, () => {
        this.getAutoFormData()
      })
    }
  }

  getAutoFormData = () => {
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: configId,
        searchParams: this.state.searchParams,
      },
    })
  }


  render() {
    const { uuid, searchParams } = this.state;

    return (
      <Card>
        <SearchWrapper
          configId={configId}
          searchParams={searchParams}
        />
        <AutoFormTable
          getPageConfig
          configId={configId}
          searchParams={searchParams}
          hideBtns
        />
      </Card>
    );
  }
}

export default OffStreamRecordPage;