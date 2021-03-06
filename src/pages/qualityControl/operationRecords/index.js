/*
 * @Author: Jiaqi
 * @Date: 2019-11-15 11:37:27
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-06-19 16:43:04
 * @desc: 质控仪操作记录
 */
import React, { Component } from 'react';
import { ProfileOutlined } from '@ant-design/icons';
import { Card, Modal, Tooltip } from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
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
      QCType: null,
      QCExecuType: null,
      QCTime: null,
      StopTime: null,
      StandardPollutantName: null,
      QCAMN: null,
    };
    this._SELF_ = {
      configId: "QCAnalyzerControlCommand"
    }
  }
  render() {
    const { configId } = this._SELF_;
    const { dateValue, DGIMN, pointName, entName, PollutantCode, QCType, QCExecuType, QCTime, StopTime, StandardPollutantName, QCAMN } = this.state;
    return (
      <BreadcrumbWrapper>
        <Card className="contentContainer">
          <SearchWrapper
            configId={configId}
          />
          <AutoFormTable
            getPageConfig
            configId={configId}
            appendHandleRows={(row, key) => {
              if (row["dbo.T_Bas_QCAnalyzerControlCommand.QCType"] == 1&&row["dbo.T_Bas_QCAnalyzerControlCommand.StandardPollutantCode"]!="P") {
                let endTime = row["dbo.T_Bas_QCAnalyzerControlCommand.StopTime"] ? row["dbo.T_Bas_QCAnalyzerControlCommand.StopTime"] : moment();
                let startTime = moment(row["dbo.T_Bas_QCAnalyzerControlCommand.QCTime"])
                return (
                  <Tooltip title="查看结果比对">
                    <a onClick={() => {
                      this.setState({
                        visible: true,
                        // dateValue: [startTime, endTime],
                        dateValue: row["dbo.T_Bas_QCAnalyzerControlCommand.ID"],
                        DGIMN: row["dbo.T_Bas_QCAnalyzerControlCommand.DGIMN"],
                        PollutantCode: row["dbo.T_Bas_QCAnalyzerControlCommand.StandardPollutantCode"],
                        QCType: row["dbo.T_Bas_QCAnalyzerControlCommand.QCType"],
                        QCExecuType: row["dbo.T_Bas_QCAnalyzerControlCommand.QCExecuType"], //
                        QCTime: row["dbo.T_Bas_QCAnalyzerControlCommand.QCTime"],
                        StopTime: row["dbo.T_Bas_QCAnalyzerControlCommand.StopTime"], //
                        StandardPollutantName: row["dbo.T_Bas_QCAnalyzerControlCommand.StandardPollutantName"], //
                        QCAMN: row["dbo.T_Bas_QCAnalyzerControlCommand.QCAMN"],
                        pointName: row["dbo.View_Point.PointName"], //
                        entName: row["dbo.View_Point.ParentName"] //
                      })
                    }}><ProfileOutlined /></a>
                  </Tooltip>
                );
              } else {
                return '-'
              }
            }}
          />
        </Card>
        <Modal
          width={"90%"}
          title="质控结果比对"
          destroyOnClose
          visible={this.state.visible}
          footer={null}
          onOk={this.handleOk}
          bodyStyle={{padding: "10px 14px 14px" }}
          onCancel={() => {
            this.setState({ visible: false })
          }}
        >
          {
            (dateValue.length && DGIMN && entName && PollutantCode && QCType && QCExecuType && pointName && QCTime && StopTime && StandardPollutantName && QCAMN) &&
            <ResultContrastPage pointName={pointName} entName={entName} dateValue={dateValue} DGIMN={DGIMN} PollutantCode={PollutantCode} QCType={QCType}
              QCExecuType={QCExecuType} QCTime={QCTime} QCAMN={QCAMN} StopTime={StopTime} StandardPollutantName={StandardPollutantName} />
          }
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default index;
