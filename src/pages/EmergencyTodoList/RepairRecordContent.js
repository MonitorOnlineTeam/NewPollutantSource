/*
 * @Author: lzp
 * @Date: 2019-08-22 09:36:43
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:29:00
 * @Description: 维修记录表
 */
import React, { Component } from 'react';
import { Spin, Button, Card } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MonitorContent from '../../components/MonitorContent/index';
import styles from './RepairRecordContent.less';

@connect(({ task, loading }) => ({
  isloading: loading.effects['task/GetRepairRecord'],
  Repair: task.RepairRecord,
}))
class RepairRecordContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'task/GetRepairRecord',
      payload: {
        TaskID: this.props.TaskID,
      },
    });
    this.setState({
      isloading: false,
    });
  }

  renderItem = Repair => {
    const rtnVal = [];
    if (Repair !== null) {
      if (Repair.Code !== null && Repair.Code.length > 0) {
        Repair.Code.map((item, index) => {
          rtnVal.push(
            <tr key={index}>
              <td
                key={`${index}a`}
                rowSpan="2"
                style={{ width: '20%', height: '50px', textAlign: 'center', fontSize: '14px' }}
              >
                {item.Name}
              </td>
              <td
                key={`${index}b`}
                style={{ width: '20%', height: '50px', textAlign: 'center', fontSize: '14px' }}
              >
                维修情况描述
              </td>
              {this.renderItemChildOne(item.ItemID, Repair)}
            </tr>,
          );
          rtnVal.push(
            <tr key={`${index}1`}>
              <td
                key={`${index}a`}
                style={{ width: '20%', height: '50px', textAlign: 'center', fontSize: '14px' }}
              >
                更换部件
              </td>
              {this.renderItemChildTwo(item.ItemID, Repair)}
            </tr>,
          );
        });
      }
    }
    return rtnVal;
  };

  renderItemChildOne = (item, Repair) => {
    const rtnValChildOne = [];
    if (Repair.Record.RecordList !== null && Repair.Record.RecordList.length > 0) {
      Repair.Record.RecordList.map((items, index) => {
        if (items.ItemID === item) {
          rtnValChildOne.push(
            <td
              key={index}
              style={{ width: '60%', height: '50px', textAlign: 'center', fontSize: '14px' }}
            >
              {items.RepairDescription}
            </td>,
          );
        }
      });
    }
    if (rtnValChildOne.length === 0) {
      rtnValChildOne.push(
        <td
          key="a"
          style={{ width: '60%', height: '50px', textAlign: 'center', fontSize: '14px' }}
        />,
      );
    }
    return rtnValChildOne;
  };

  renderItemChildTwo = (item, Repair) => {
    const rtnValChildTwo = [];
    if (Repair.Record.RecordList !== null && Repair.Record.RecordList.length > 0) {
      Repair.Record.RecordList.map((items, index) => {
        if (items.ItemID === item) {
          rtnValChildTwo.push(
            <td
              key={`${index}1`}
              style={{ width: '60%', height: '50px', textAlign: 'center', fontSize: '14px' }}
            >
              {items.ChangeSpareparts}
            </td>,
          );
        }
      });
    }
    if (rtnValChildTwo.length === 0) {
      rtnValChildTwo.push(
        <td
          key="a"
          style={{ width: '60%', height: '50px', textAlign: 'center', fontSize: '14px' }}
        />,
      );
    }
    return rtnValChildTwo;
  };

  render() {
    const appStyle = this.props.appStyle;
    let style = null;
    if (appStyle) {
      style = appStyle;
    } else {
      style = {
        height: 'calc(100vh - 200px)',
      };
    }
    const SCREEN_HEIGHT =
      this.props.scrolly === 'none' ? { overflowY: 'none' } : { height: 'calc(100vh-200px)' };
    const Record = this.props.Repair !== null ? this.props.Repair.Record : null;
    const Content = Record !== null ? Record.Content : null;
    const SignContent =
      Record !== null
        ? Record.SignContent === null
          ? null
          : `data:image/jpeg;base64,${Record.SignContent}`
        : null;
    const StartTime =
      Content !== null ? (Content.StartTime !== null ? Content.StartTime : '--') : null;
    const EndTime = Content !== null ? (Content.EndTime !== null ? Content.EndTime : '--') : null;
    if (this.props.isloading) {
      return (
        <Spin
          style={{
            width: '100%',
            height: 'calc(100vh/2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          size="large"
        />
      );
    }
    return (
      <div className={styles.FormDiv} style={style}>
        <div className={styles.FormName}>CEMS维修记录表</div>
        <div className={styles.HeadDiv} style={{ fontWeight: 'bold' }}>
          企业名称：{Content !== null ? Content.EnterpriseName : null}
        </div>
        <table key="1" className={styles.FormTable}>
          <tbody>
            <tr>
              <td style={{ width: '20%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                安装地点
              </td>
              <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px' }}>
                {Content !== null ? Content.PointPosition : null}
              </td>
            </tr>
            {this.renderItem(this.props.Repair)}
            <tr>
              <td style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                站房是否清理
              </td>
              <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px' }}>
                {Content !== null ? Content.IsClear : null}
              </td>
            </tr>
            <tr>
              <td style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                维修情况总结
              </td>
              <td colSpan="2" style={{ textAlign: 'center', fontSize: '14px' }}>
                {Content !== null ? Content.RepairSummary : null}
              </td>
            </tr>
            <tr>
              <td style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                备注
              </td>
              <td
                colSpan="2"
                style={{ width: '25%', height: '50px', textAlign: 'center', fontSize: '14px' }}
              >
                {Content !== null ? Content.Remark : null}
              </td>
            </tr>
            <tr>
              <td style={{ width: '18%', height: '50px', textAlign: 'center', fontSize: '14px' }}>
                <b>维修人:</b>
                {Record !== null ? Record.CreateUserID : null}
              </td>
              <td
                style={{ width: '25%', height: '50px', textAlign: 'center', fontSize: '14px' }}
                colSpan="2"
              >
                <b>维修时间&nbsp;：</b>
                {StartTime} &nbsp;至&nbsp;{EndTime}
              </td>
            </tr>
          </tbody>
        </table>
        <table key="2" className={styles.FormTable}>
          <tbody>
            <tr>
              <td
                style={{
                  width: '87%',
                  height: '50px',
                  textAlign: 'right',
                  border: '0',
                  fontWeight: 'bold',
                }}
              >
                负责人签名：
              </td>
              <td style={{ width: '13%', height: '50px', border: '0' }}>
                {SignContent === null ? null : (
                  <img style={{ width: '80%', height: '110%' }} src={SignContent} />
                )}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  width: '87%',
                  height: '50px',
                  textAlign: 'right',
                  border: '0',
                  fontWeight: 'bold',
                }}
              >
                签名时间：
              </td>
              <td style={{ width: '13%', height: '50px', border: '0', minWidth: 120 }}>
                {Record !== null ? Record.SignTime : null}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
export default RepairRecordContent;
