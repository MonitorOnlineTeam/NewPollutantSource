import React, { Component, Fragment } from 'react';
import { Card, Table, Tag } from 'antd';
import { connect } from 'dva';
@connect(({ loading, standardlibrary }) => ({
  ...loading,
  reason: standardlibrary.reason,
  requstresult: standardlibrary.requstresult,
  standardlibrarypollutant: standardlibrary.standardlibrarypollutant,
}))
export default class PollutantView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    const StandardLibraryID = this.props.StandardLibraryID;
    if (StandardLibraryID !== null) {
      this.props.dispatch({
        type: 'standardlibrary/getstandardlibrarypollutantlist',
        payload: {
          StandardLibraryID: StandardLibraryID,
        },
      });
    }
  }
  render() {
    const columns = [
      {
        title: '污染物编号',
        dataIndex: 'PollutantCode',
        key: 'PollutantCode',
        width: '15%',
        render: (text, record) => {
          return text;
        },
      },
      {
        title: '污染物名称',
        dataIndex: 'PollutantName',
        key: 'PollutantName',
        width: '40%',
        render: (text, record) => {
          return text;
        },
      },
      {
        title: '报警类型',
        dataIndex: 'AlarmType',
        key: 'AlarmType',
        width: '10%',
        render: (text, record) => {
          if (text === 0) {
            return (
              <span>
                {' '}
                <Tag color="magenta"> 无报警 </Tag>{' '}
              </span>
            );
          }
          if (text === 1) {
            return (
              <span>
                {' '}
                <Tag color="green"> 上限报警 </Tag>{' '}
              </span>
            );
          }
          if (text === 2) {
            return (
              <span>
                {' '}
                <Tag color="cyan"> 下线报警 </Tag>{' '}
              </span>
            );
          }
          if (text === 3) {
            return (
              <span>
                {' '}
                <Tag color="lime"> 区间报警 </Tag>{' '}
              </span>
            );
          }
        },
      },
      {
        title: '报警上限',
        dataIndex: 'UpperLimit',
        key: 'UpperLimit',
        width: '10%',
        render: (text, record) => {
          return text;
        },
      },
      {
        title: '报警下限',
        dataIndex: 'LowerLimit',
        key: 'LowerLimit',
        width: '10%',
        render: (text, record) => {
          return text;
        },
      },
    ];
    return (
      <div>
        <Card>
          <Table
            loading={this.props.effects['standardlibrary/getstandardlibrarypollutantlist']}
            columns={columns}
            dataSource={
              this.props.requstresult === '1' ? this.props.standardlibrarypollutant : null
            }
            pagination={true}
          />
        </Card>
      </div>
    );
  }
}
