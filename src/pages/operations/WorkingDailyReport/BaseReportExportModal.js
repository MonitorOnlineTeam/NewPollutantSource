/*
 * 导出弹窗
 * @Author: Jiaqi
 * @Date: 2019-04-23 13:57:02
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-04-26 10:23:42
 */

import React, { PureComponent } from 'react';
import { Modal, Button, DatePicker, Row, Col, Checkbox, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const { MonthPicker, RangePicker } = DatePicker;

@connect(({ loading, statisticsmodel }) => ({
  loading: loading.effects['statisticsmodel/exportBaseReport'],
  exportColumn: statisticsmodel.exportColumn,
}))
class BaseReportExportModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      checkedList: [],
      checkAll: false,
      indeterminate: true,
    };

    this._SELF_ = {
      plainOptions: [],
    };
    this.onCheckChange = this.onCheckChange.bind(this);
    this.submitModal = this.submitModal.bind(this);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'statistics/getExportColumn',
      payload: {
        type: this.props.type,
      },
    });
  }

  handleCancel = e => {
    this.props.onCancel();
  };

  // check
  onCheckChange(checkedList) {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < this._SELF_.plainOptions.length,
      checkAll: checkedList.length === this._SELF_.plainOptions.length,
    });
  }

  // 全选/反选
  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? this._SELF_.plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  // 提交导出
  submitModal() {
    if (this.state.checkedList.length) {
      this.props.onOk(this.state.checkedList);
    } else {
      message.error('请选择列！');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.exportColumn !== nextProps.exportColumn) {
      this._SELF_.plainOptions = nextProps.exportColumn.map(item => item.ID);
    }

    const defaultCheckedList = nextProps.exportColumn
      .filter(item => item.IsCheck === true)
      .map(item => item.ID);
    if (this.state.checkedList.length === 0 && this.state.checkedList !== defaultCheckedList) {
      this.setState({
        checkedList: defaultCheckedList,
      });
    }
  }

  render() {
    const { exportColumn } = this.props;
    return (
      <Modal
        title={this.props.title || '导出'}
        visible={this.state.visible}
        onOk={this.submitModal}
        onCancel={this.handleCancel}
        width="50%"
        confirmLoading={this.props.loading}
      >
        {/* <Row style={{ maring: "10px 0" }}>
          <Col>
            请选择导出列：
          </Col>
        </Row> */}
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全选/反选
          </Checkbox>
        </div>
        <Checkbox.Group
          value={this.state.checkedList}
          style={{ width: '100%', marginTop: 10 }}
          onChange={this.onCheckChange}
        >
          <Row>
            {exportColumn.map(item => {
              return (
                <Col key={item.ID} span={8}>
                  <Checkbox key={item.ID} value={item.ID}>
                    {item.FieldName}
                  </Checkbox>
                </Col>
              );
            })}
          </Row>
        </Checkbox.Group>
      </Modal>
    );
  }
}

export default BaseReportExportModal;
