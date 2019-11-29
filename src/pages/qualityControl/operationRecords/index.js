/*
 * @Author: Jiaqi
 * @Date: 2019-11-15 11:37:27
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-29 16:54:54
 * @desc: 质控仪操作记录
 */
import React, { Component } from 'react';
import { Card, Modal, Tooltip, Icon } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import ResultContrastPage from '../resultContrast/ResultContrastPage'
import moment from 'moment';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dateValue: [],
      DGIMN: null,
      PollutantCode: null,
    };
    this._SELF_ = {
      configId: "QCAnalyzerControlCommand"
    }
  }
  render() {
    const { configId } = this._SELF_;
    const { dateValue, DGIMN, PollutantCode } = this.state;
    return (
      <PageHeaderWrapper>
        <Card className="contentContainer">
          <SearchWrapper
            configId={configId}
          />
          <AutoFormTable
            getPageConfig
            configId={configId}
            appendHandleRows={(row, key) => {
              if (row["dbo.T_Bas_QCAnalyzerControlCommand.QCType"] == 1) {
                let endTime = row["dbo.T_Bas_QCAnalyzerControlCommand.StopTime"] ? row["dbo.T_Bas_QCAnalyzerControlCommand.StopTime"] : moment();
                let startTime = moment(row["dbo.T_Bas_QCAnalyzerControlCommand.QCTime"])
                return <Tooltip title="查看结果比对">
                  <a onClick={() => {
                    this.setState({
                      visible: true,
                      // dateValue: [startTime, endTime],
                      dateValue: row["dbo.T_Bas_QCAnalyzerControlCommand.ID"],
                      DGIMN: row["dbo.T_Bas_QCAnalyzerControlCommand.DGIMN"],
                      PollutantCode: row["dbo.T_Bas_QCAnalyzerControlCommand.StandardPollutantCode"]
                    })
                  }}><Icon type="profile" /></a>
                </Tooltip>
              } else {
                return '-'
              }
            }}
          />
        </Card>
        <Modal
          width={"70%"}
          title="质控结果比对"
          destroyOnClose
          visible={this.state.visible}
          footer={[]}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({ visible: false })
          }}
        >
          {
            (dateValue.length && DGIMN && PollutantCode) && <ResultContrastPage dateValue={dateValue} DGIMN={DGIMN} PollutantCode={PollutantCode} />
          }
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default index;
