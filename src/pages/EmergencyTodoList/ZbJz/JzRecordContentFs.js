/*
 * @Author: lzp
 * @Date: 2019-08-22 09:36:43
 * @LastEditors: outman0611
 * @LastEditTime: 2025-04-03 16:49:31
 * @Description: cems零点量程漂移与校准记录表 废水-淄博
 */
import React, { Component } from 'react';
import { Spin, Upload } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MonitorContent from '@/components/MonitorContent/index';
import styles from './JzRecordContent.less';
import moment from 'moment';
import ImageView from '@/components/ImageView';

//import * as fstream from 'fstream';

@connect(({ task, loading }) => ({
  isloading: loading.effects['task/GetFSCalibrationRecordZB'],
  JzRecord: task.JzRecordZbFs,
}))
class JzRecordContentZb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      imageIndex: -1,
      fileList: []
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'task/GetFSCalibrationRecordZB',
      payload: {
        TaskID: this.props.TaskID,
        TypeID: this.props.TypeID,
      },
    });
  }
  imgListData = (item) => {
    return [
      { title: '仪器最新校准日期信息和参数值', imgList: item?.['YQZXJZRQXXHCSZ_PIC']?.ImgNameList || [] },
    ]
  }
  handlePreview = (fileList, file) => {
    this.setState({
      previewVisible: true,
      fileList: fileList,
      imageIndex: file?.index || 0,
    });
  };
  remarkImg = ({item}) => { //情况说明和 图片
    return <>
      <tr>
        <td style={{ width: '14%', height: '30px', minWidth: 150 }}>情况说明</td>
        <td colSpan="5">{item?.Remark}</td>
      </tr>
      {
        this.imgListData(item).map((section, index) => {

          const fileList = section?.imgList?.map((imgItem, imgIndex) => ({ url: `/wwwroot/Upload/${imgItem}`, name: `${imgItem}`, uid: `${imgIndex}`,index:imgIndex, status: 'done', }))
         return <tr style={{paddingBottom:1}}>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>{section.title}</td>
            <td colSpan="5"  style={{paddingBottom:1}} >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={(file)=>this.handlePreview(fileList,file)}
                disabled={true}
              />
            </td>
          </tr>
        })
      }

    </>

  }


  // 渲染表单内容
  renderFormContent = (rd, item) => {
    const RemarkImg = this.remarkImg
    return (
      <table className={styles.FormTable}>
        <tbody>
          <tr>
            <td
              colSpan={6}
              style={{ height: '30px', fontWeight: 'bold', minWidth: 150, textAlign: 'left' }}
            >
              {item}分析仪校准
            </td>
          </tr>
          <tr>
            <td style={{ width: '16.6%', height: '30px', minWidth: 150 }}>仪器名称</td>
            <td style={{ width: '16.6%', height: '30px', minWidth: 150 }}>
              {rd && rd.YQName}
            </td>
            <td style={{ width: '16.6%', height: '30px', minWidth: 150 }}>仪器型号</td>
            <td style={{ width: '16.6%', height: '30px', minWidth: 150 }}>{rd && rd.YQCode}</td>
            <td style={{ width: '16.6%', height: '30px', minWidth: 150 }}>监测因子</td>
            <td style={{ width: '16.6%', height: '30px', minWidth: 150 }}>{rd && rd.ItemID }</td>
          </tr>
          <tr>
            <td rowSpan="2" style={{ width: '16.6%', height: '30px' }}>
              校准
            </td>

            <td style={{ width: '16.6%', height: '30px' }}>上次校准日期</td>
            <td style={{ width: '16.6%', height: '30px' }}>最新校准日期</td>
            <td style={{ width: '16.6%', height: '30px' }}>校准参数名称 （电压、斜率等）</td>
            <td colSpan={2} style={{ width: '16.6%', height: '30px' }}>最新校准参数 （参数数值）</td>
          </tr>
          <tr>
            <td style={{ width: '16.6%', height: '30px' }}>{rd && rd.LastJZTime}</td>
            <td style={{ width: '16.6%', height: '30px' }}>{rd && rd.NewJZTime}</td>
            <td style={{ width: '16.6%', height: '30px' }}>{rd && rd.JZCSMC}</td>
            <td colSpan={2} style={{ width: '16.6%', height: '30px' }}>{rd && rd.ZXJZCSZ}</td>
          </tr>
          {/* {this.remarkImg(rd)} */}
          <RemarkImg  item={rd}/>
        </tbody>
      </table>
    );
  };

  renderItem = (Record, code) => {
    const rtnVal = [];
    if (Record != null && Record.length > 0) {
      if (code != null && code.length > 0) {
        code.map((item, key) => {
          let currentItem = Record.find(item1 => item1.ItemID === item);
          if (currentItem) {
            rtnVal.push(this.renderFormContent(currentItem, item));
          }
        });
      }
    } else {
      rtnVal.push(
        <table key={'2'} className={styles.FormTable}>
          <tbody>
            <tr>
              <td colSpan="6" style={{ height: '60px', textAlign: 'center', minWidth: 900 }}>
                没有填写校准项
              </td>
            </tr>
          </tbody>
        </table>,
      );
    }
    return rtnVal;
  };
  // 渲染签名图片
  renderSignature = (signContent) => {
    return (<div style={{ width: '80%', margin: '0 auto', paddingTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={styles.signatureTitle}>手写签名：</div>
        {signContent && <img src={`${signContent}`} alt="签名" className={styles.signatureImage} />}
      </div>
    </div>
    );
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
      this.props.scrolly === 'none'
        ? { overflowY: 'none' }
        : { height: document.querySelector('body').offsetHeight - 250 };
    const Record = this.props.JzRecord !== null ? this.props.JzRecord.Record : null;
    const Content = Record !== null ? Record.Content : null;
    const Code = this.props.JzRecord !== null ? this.props.JzRecord.Code : null;
    const SignContent =
      Record !== null
        ? Record.SignContent === null
          ? null
          : `${Record.SignContent}`
        : null;
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

    return (<>
      <div className={styles.FormDiv} style={style}>
        <div className={styles.FormName}>CEMS零点量程漂移与校准记录表</div>
        <div className={styles.HeadDiv} style={{ fontWeight: 'bold' }}>
          企业名称：
          {Content !== null ? Content.EnterpriseName : null}
        </div>
        <table className={styles.FormTable}>
          <tbody>
            <tr>
              <td style={{ width: '16.6%', height: '30px', textAlign: 'left', minWidth: 150 }}>
                COD设备生产商
              </td>
              <td style={{ width: '16.6%', height: '30px', minWidth: 150 }}>
                {Content !== null ? Content.CODEquipmentManufacturer : null}
              </td>
              <td style={{ width: '16.6%', height: '30px', minWidth: 150 }}>
                氨氮设备规格型号
              </td>
              <td style={{ width: '16.6%', height: '30px', minWidth: 150 }}>
                {Content !== null ? Content.ANDANCode : null}
              </td>
              <td style={{ width: '16.6%', height: '30px', minWidth: 150 }}>校准日期</td>
              <td style={{ width: '16.6%', height: '30px', minWidth: 150 }}>
                {Content && Content.AdjustStartTime
                  ? moment(Content.AdjustStartTime).format('YYYY-MM-DD')
                  : null}
              </td>
            </tr>
            <tr>
              <td style={{ width: '16.6%', height: '30px', textAlign: 'left' }}>
                总磷设备生产商
              </td>
              <td style={{ width: '16.6%', height: '30px' }}>
                {Content !== null ? Content.ZONGLEquipmentManufacturer : null}
              </td>
              <td>总氮设备规格型号</td>
              <td style={{ width: '16.6%', height: '30px' }}>
                {Content !== null ? Content.ZONGDEquipmentManufacturer : null}
              </td>
              <td style={{ width: '16.6%', height: '30px' }}>校准开始时间</td>
              <td style={{ width: '16.6%', height: '30px' }}>
                {Content !== null ? Content.AdjustStartTime : null}
              </td>
            </tr>
            <tr>
              <td style={{ width: '16.6%', height: '30px', textAlign: 'left' }}>安装地点</td>
              <td style={{ width: '16.6%', height: '30px' }}>
                {Content !== null ? Content.PointPosition : null}
              </td>
              <td style={{ width: '16.6%', height: '30px', textAlign: 'left' }}>维护管理单位</td>
              <td colSpan="3">{Content !== null ? Content.MaintenanceManagementUnit : null}</td>
            </tr>
          </tbody>
        </table>
        {this.renderItem(Record !== null ? Record.RecordList : null, Code)}
        <table className={styles.FormTable} style={{ border: '0' }}>
          <tbody>
            <tr>
              <td style={{ width: '16.6%', height: '30px', }}>运维人</td>
              <td colSpan='2' style={{ width: '33.2%', height: '30px', }}>
                {Record !== null ? Record.CreateUserID : null}
              </td>
              <td style={{ width: '16.6%', height: '30px', }}>校准结束时间</td>
              <td colSpan='2' style={{ width: '33.2%', height: '30px', }}>
                {Content !== null ? Content.AdjustEndTime : null}
              </td>
            </tr>
          </tbody>
        </table>
        {this.renderSignature(SignContent)}
      </div>
      {/* 查看附件弹窗 */}
     <ImageView
        isOpen={this.state.previewVisible}
        images={this.state.fileList.map(item => item.url)}
        imageIndex={this.state.imageIndex}
        onCloseRequest={() => {
          this.setState({
            previewVisible: false,
          });
        }}
      />
    </>
    );
  }
}
export default JzRecordContentZb;
