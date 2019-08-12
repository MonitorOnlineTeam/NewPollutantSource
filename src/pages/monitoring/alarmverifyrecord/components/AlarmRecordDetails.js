import React, { Component } from 'react';
import {
    Card,
    Spin,
    Form,
    Badge,
} from 'antd';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable'
import AutoFormViewItems from '@/pages/AutoFormManager/AutoFormViewItems'

/**
 * 报警记录详情
 * xpy 2019.08.06
 */
@connect(({ loading, alarmrecord }) => ({
    AlarmRecordList: alarmrecord.AlarmRecordList,
    isloading: loading.effects['alarmrecord/GetAlarmRecordDetails'],
}))
@Form.create()
class AlarmRecordDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    /** 初始化加载 */
  componentDidMount() {
    const { dispatch, ID } = this.props;
    dispatch({
      type: 'alarmrecord/GetAlarmRecordDetails',
      payload: {
        ExceptionVerifyID: ID,
      },
    });
  }

      render() {
          const columns = [
            {
            title: '首次报警时间',
            dataIndex: 'FirstTime',
            // fixed: 'left',
            width: 50,
            key: 'FirstTime',
          },
           {
             title: '报警类型',
             dataIndex: 'AlarmTypeName',
             width: 50,
             key: 'AlarmTypeName',
           },
          {
              title: '污染物',
              dataIndex: 'PollutantName',
              width: 50,
              key: 'PollutantName',
          },
          {
              title: '报警信息',
              dataIndex: 'AlarmMsg',
              key: 'AlarmMsg',
          },
          {
              title: '报警次数',
              dataIndex: 'AlarmCount',
              width: 50,
              key: 'AlarmCount',
          },
        ];
           const { isloading } = this.props;
          if (isloading) {
              return (<Spin
                  style={{ width: '100%',
                      height: 'calc(100vh/2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center' }}
                  size="large"
              />);
          }
          return (
                  <div style={{ width: '100%', height: 'calc(100vh - 330px)', overflow: 'auto' }}>
                      <Card title="核查单详情" bordered={false}>
                          <AutoFormViewItems
                            configId="ExceptionVerify"
                            keysParams={{ 'dbo.T_Cod_ExceptionVerify.ID': this.props.ID }}
                        />
                      </Card>
                      <Card title="报警记录" bordered={false}>
                       <SdlTable
                              loading={this.props.isloading}
                              columns={columns}
                              dataSource={this.props.AlarmRecordList}
                              rowKey = "ID"
                              pagination={{
                                   pageSize: 10,
                              }}
                          />
                      </Card>
                  </div>
          );
      }
}
export default AlarmRecordDetails;
