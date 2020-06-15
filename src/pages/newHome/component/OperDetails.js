import React, { PureComponent } from 'react';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { Card, Button, Tooltip, Popconfirm, Icon, Divider, Modal, Form, Select, Input, Row, Spin } from 'antd';
import { router } from 'umi'
import { connect } from 'dva'

@connect()
class OperDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      configId: "TaskRecordForOps"
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: this.state.configId
      }
    });
  }

  render() {
    const { configId } = this.state;
    const { DGIMN } = this.props;
    return (
      <>
        <SearchWrapper
          configId={configId}
          searchParams={[{
            Key: "dbo__T_Bas_Task__DGIMN",
            Value: DGIMN,
            Where: '$=',
          }]}
        />
        <AutoFormTable
          style={{ marginTop: 10 }}
          configId={configId}
          searchParams={[{
            Key: "dbo__T_Bas_Task__DGIMN",
            Value: DGIMN,
            Where: '$=',
          }]}
          scroll={{ y: "calc(60vh - 200px)" }}
          appendHandleRows={(row, key) => {
            const text = row["dbo.T_Bas_Task.CompleteTime"];
            const TaskID = row["dbo.T_Bas_Task.ID"];
            let reslist = [];
            reslist.push(
              <Tooltip title="详情">
                <a><Icon onClick={() => router.push(`/operations/taskRecord/details/${TaskID}/${DGIMN}`)} type="profile" /></a>
              </Tooltip>
            )
            return reslist;
          }}
        />
      </>
    );
  }
}

export default OperDetails;