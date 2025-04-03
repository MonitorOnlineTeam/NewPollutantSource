/*
 * @Author: lzp
 * @Date: 2019-08-22 09:36:43
 * @LastEditors: outman0611
 * @LastEditTime: 2025-04-03 17:34:22
 * @Description: cems零点量程漂移与校准记录表 废气-淄博
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
  isloading: loading.effects['task/GetCemsCalibrationRecordZB'],
  JzRecord: task.JzRecordZb,
}))
class JzRecordContentZb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible:false,
      imageIndex:-1,
      fileList:[]
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'task/GetCemsCalibrationRecordZB',
      payload: {
        TaskID: this.props.TaskID,
        TypeID: this.props.TypeID,
      },
    });
  }
  imgListData = (item) => {
    switch (item.ItemID) { //名称 
      case 'SO₂':
      case 'NO':
      case 'O₂':
      case 'NO₂':
        return [
          { title: '校准前数值', imgList: item?.['JZQSZ_PIC']?.ImgNameList || [] },
          { title: '校准后零点数值', imgList: item?.['JZHLDSZ_PIC']?.ImgNameList || [] },
          { title: '校准后量程数值', imgList: item?.['JZHLCSZ_PIC']?.ImgNameList || [] },
          { title: '使用标气浓度及标签', imgList: item?.['SYBQNDJBQ_PIC']?.ImgNameList || [] }
        ]

      case '流速':
        return [
          { title: '校准前数值及工作照', imgList: item?.['JZUSZJGZZ_PIC']?.ImgNameList || [] },
          { title: '校准后数值及工作照', imgList: item?.['JZDSZJGZZ_PIC']?.ImgNameList || [] },
        ]
      case '湿度':
        return [
          { title: '通入空气/氮气测量值', imgList: item?.['TRKQDQCLZ_PIC']?.ImgNameList || [] },
          { title: '湿度仪器维护工作', imgList: item?.['SDYQWHGZ_PIC']?.ImgNameList || [] },
        ]
      default:
        return [
          { title: '零点数值（校准前）', imgList: item?.['LDSZU_PIC']?.ImgNameList || [] },
          { title: '零点数值（校准后）', imgList: item?.['LDSZD_PIC']?.ImgNameList || [] },
          { title: '量程数值（校准前）', imgList: item?.['LCSJU_PIC']?.ImgNameList || [] },
          { title: '量程数值（校准后）', imgList: item?.['LCSJD_PIC']?.ImgNameList || [] }
        ]
    }
  }
  handlePreview = (fileList,file) => {
    this.setState({
      previewVisible: true,
      fileList:fileList,
      imageIndex: file?.index || 0,
    });
  };
  remarkImg = (item) => { //情况说明和 图片
    return <>
      <tr>
        <td style={{ width: '14%', height: '30px', minWidth: 150 }}>情况说明</td>
        <td colSpan="7">{item?.Remark}</td>
      </tr>
      {
        this.imgListData(item).map((section, index) => {

          const fileList = section?.imgList?.map((imgItem, imgIndex) => ({ url: `/wwwroot/Upload/${imgItem}`, name: `${imgItem}`, uid: `${imgIndex}` , index:imgIndex, status: 'done', }))
          // const fileList = [1,2,3,4,5,6,7,8,89,10,12,22,33,44,66].map(item=>({url:'/wwwroot/Upload/SDL202504021851415141961.jpg',name:'2222',uid:item,status: 'done',})) //多图片测试
        return <tr>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>{section.title}</td>
            <td  colSpan="7"  style={{paddingBottom:1}} > {/*   className={styles.uploadSection} */}
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
  // 渲染流速湿度表单
  renderLSFormContent = (data, name) => {
    let rd = data[0];
    return (
      <table className={styles.FormTable}>
        <tbody>
          <tr>
            <td
              colSpan="8"
              style={{ height: '30px', fontWeight: 'bold', minWidth: 150, textAlign: 'left' }}
            >
              {name}校准
            </td>
          </tr>
          <tr>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>分析仪原理</td>
            <td style={{ width: '30%', height: '30px', minWidth: 150 }} colSpan="3">
              {rd && rd.FxyYl}
            </td>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>分析仪量程</td>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>{rd && rd.FxyLc}</td>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>计量单位</td>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>{rd && rd.JlUnit}</td>
          </tr>
          {data.map((item, index) => {
            return (
              <>
                <tr>
                  <td rowSpan="2" style={{ width: '14%', height: '30px' }}>
                    零点漂移校准
                    <br />
                    {`(差压表${index + 1})`}
                  </td>
                  <td style={{ width: '16%', height: '30px' }} colSpan="2">
                    {'零气浓度值'}
                  </td>
                  <td style={{ width: '14%', height: '30px' }}>上次校准后测试值</td>
                  <td style={{ width: '14%', height: '30px' }}>校前测试值</td>
                  <td style={{ width: '14%', height: '30px' }}>零点漂移%F.S.</td>
                  <td style={{ width: '14%', height: '30px' }}>仪器校准是否正常</td>
                  <td style={{ width: '14%', height: '30px' }}>校准后测试值</td>
                </tr>
                <tr>
                  <td style={{ width: '14%', height: '30px' }} colSpan="2">
                    {item.LqNdz}
                  </td>
                  <td style={{ width: '16%', height: '30px' }}>{item.LdLastCalibrationValue}</td>
                  <td style={{ width: '14%', height: '30px' }}>{item.LdCalibrationPreValue}</td>
                  <td style={{ width: '14%', height: '30px' }}>{item.LdPy}</td>
                  <td style={{ width: '14%', height: '30px' }}>{item.LdCalibrationIsOk}</td>
                  <td style={{ width: '14%', height: '30px' }}>{item.LdCalibrationSufValue}</td>
                </tr>
              </>
            );
          })}
           {this.remarkImg(rd)}
        </tbody>
      </table>
    );
  };

  // 渲染表单内容
  renderFormContent = (rd, item) => {
    return (
      <table className={styles.FormTable}>
        <tbody>
          <tr>
            <td
              colSpan="8"
              style={{ height: '30px', fontWeight: 'bold', minWidth: 150, textAlign: 'left' }}
            >
              {item}分析仪校准
            </td>
          </tr>
          <tr>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>分析仪原理</td>
            <td style={{ width: '30%', height: '30px', minWidth: 150 }} colSpan="3">
              {rd && rd.FxyYl}
            </td>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>分析仪量程</td>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>{rd && rd.FxyLc}</td>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>计量单位</td>
            <td style={{ width: '14%', height: '30px', minWidth: 150 }}>{rd && rd.JlUnit}</td>
          </tr>
          <tr>
            <td rowSpan="2" style={{ width: '14%', height: '30px' }}>
              零点漂移校准
            </td>
            {/* <td style={{ width: '14%', height: '30px' }}>{item !== '颗粒物' ? '零气浓度值' : '零气校准参考值'}</td> */}
            <td style={{ width: '16%', height: '30px' }} colSpan="2">
              {'零气浓度值'}
            </td>
            {/* <td style={{ width: '0%', height: '30px' }} colSpan="0"></td> */}
            <td style={{ width: '14%', height: '30px' }}>上次校准后测试值</td>
            <td style={{ width: '14%', height: '30px' }}>校前测试值</td>
            <td style={{ width: '14%', height: '30px' }}>零点漂移%F.S.</td>
            <td style={{ width: '14%', height: '30px' }}>仪器校准是否正常</td>
            <td style={{ width: '14%', height: '30px' }}>校准后测试值</td>
          </tr>
          <tr>
            <td style={{ width: '14%', height: '30px' }} colSpan="2">
              {rd && rd.LqNdz}
            </td>
            <td style={{ width: '16%', height: '30px' }}>{rd && rd.LdLastCalibrationValue}</td>
            <td style={{ width: '14%', height: '30px' }}>{rd && rd.LdCalibrationPreValue}</td>
            <td style={{ width: '14%', height: '30px' }}>{rd && rd.LdPy}</td>
            <td style={{ width: '14%', height: '30px' }}>{rd && rd.LdCalibrationIsOk}</td>
            <td style={{ width: '14%', height: '30px' }}>{rd && rd.LdCalibrationSufValue}</td>
          </tr>
          <tr>
            <td rowSpan="2" style={{ width: '14%' }}>
              量程漂移校准
                </td>
            {rd && rd.LcNewCalibrationPreValue ? (
              <>
                <td style={{ width: '8%', height: '30px', minWidth: '100px' }}>
                  {'更换前标气浓度'}
                </td>
                <td style={{ width: '8%', height: '30px', minWidth: '100px' }}>
                  {'更换后标气浓度'}
                </td>
              </>
            ) : (
                <td style={{ width: '16%', height: '30px', minWidth: '200px' }} colSpan="2">
                  {'标气浓度值'}
                </td>
              )}
            <td style={{ width: '14%', height: '30px', minWidth: '200px' }}>
              上次校准后测试值
                </td>
            <td style={{ width: '14%', height: '30px' }}>校前测试值</td>
            <td style={{ width: '14%', height: '30px' }}>量程漂移%F.S.</td>
            <td style={{ width: '14%', height: '30px' }}>仪器校准是否正常</td>
            <td style={{ width: '14%', height: '30px' }}>校准后测试值</td>
          </tr>

          <tr>
            {rd && rd.LcNewCalibrationPreValue ? (
              <>
                <td style={{ width: '8%', height: '30px', minWidth: '100px' }}>
                  {rd && rd.BqNdz}
                </td>
                <td style={{ width: '8%', height: '30px', minWidth: '100px' }}>
                  {rd && rd.LcNewCalibrationPreValue}
                </td>
              </>
            ) : (
                <td style={{ width: '16%', height: '30px', minWidth: '200px' }} colSpan={rd && rd.LcNewCalibrationPreValue ? '1' : '2'}>
                  {rd && rd.BqNdz}
                </td>
              )}
            <td style={{ width: '16%', height: '30px', minWidth: '200px' }}>
              {rd && rd.LcLastCalibrationValue}
            </td>
            <td style={{ width: '14%', height: '30px' }}>{rd && rd.LcCalibrationPreValue}</td>
            <td style={{ width: '14%', height: '30px' }}>{rd && rd.LcPy}</td>
            <td style={{ width: '14%', height: '30px' }}>{rd && rd.LcCalibrationIsOk}</td>
            <td style={{ width: '14%', height: '30px' }}>{rd && rd.LcCalibrationSufValue}</td>
          </tr>

          {this.remarkImg(rd)}
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
            if (item === '流速' || item === '湿度') {
              rtnVal.push(this.renderLSFormContent(currentItem.ChildList, item));
            } else {
              rtnVal.push(this.renderFormContent(currentItem, item));
            }
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
    // if (!signContent) {
    //   return null;
    // }
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
              <td style={{ width: '18%', height: '30px', textAlign: 'left', minWidth: 150 }}>
                气态污染物CEMS设备生产商
              </td>
              <td style={{ width: '16%', height: '30px', minWidth: 150 }}>
                {Content !== null ? Content.GasCemsEquipmentManufacturer : null}
              </td>
              <td style={{ width: '18%', height: '30px', minWidth: 150 }}>
                气态污染物CEMS设备规格型号
              </td>
              <td style={{ width: '18%', height: '30px', minWidth: 150 }}>
                {Content !== null ? Content.GasCemsCode : null}
              </td>
              <td style={{ width: '18%', height: '30px', minWidth: 150 }}>校准日期</td>
              <td style={{ width: '16%', height: '30px', minWidth: 150 }}>
                {Content && Content.AdjustStartTime
                  ? moment(Content.AdjustStartTime).format('YYYY-MM-DD')
                  : null}
              </td>
            </tr>
            <tr>
              <td style={{ width: '18%', height: '30px', textAlign: 'left' }}>
                颗粒物CEMS设备生产商
              </td>
              <td style={{ width: '16%', height: '30px' }}>
                {Content !== null ? Content.KlwCemsEquipmentManufacturer : null}
              </td>
              <td>颗粒物CEMS设备规格型号</td>
              <td style={{ width: '18%', height: '30px' }}>
                {Content !== null ? Content.KlwCemsCode : null}
              </td>
              <td style={{ width: '16%', height: '30px' }}>校准开始时间</td>
              <td style={{ width: '16%', height: '30px' }}>
                {Content !== null ? Content.AdjustStartTime : null}
              </td>
            </tr>
            <tr>
              <td style={{ width: '18%', height: '30px', textAlign: 'left' }}>安装地点</td>
              <td style={{ width: '16%', height: '30px' }}>
                {Content !== null ? Content.PointPosition : null}
              </td>
              <td style={{ width: '18%', height: '30px', textAlign: 'left' }}>维护管理单位</td>
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
