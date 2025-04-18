import React, { Component } from 'react';
import { Spin, Radio, Space } from 'antd';
import { connect } from 'dva';
import styles from './DataConsistencyRealDate.less';
import MonitorContent from '../../components/MonitorContent/index';
import styles2 from './Patrol/styles.less';
import moment from 'moment';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';
// 图片上传渲染数据
const IMAGE_LIST = [
  {
    name: '示值误差工作过程及数据（低浓度）',
    key: 'DFile',
  },
  {
    name: '示值误差工作过程及数据（中浓度）',
    key: 'ZFile',
  },
  {
    name: '示值误差工作过程及数据（高浓度）',
    key: 'GFile',
  },
  {
    name: '工作标气标签',
    key: 'BFile',
  },
  {
    name: '系统响应时间测量工作照片',
    key: 'BeforeFile',
  },
  {
    name: '系统响应时间（秒表）照片',
    key: 'AfterFile',
  },
];

@connect(({ task, loading }) => ({
  loading: loading.effects['task/GetIndicationErrorSystemResponseRecordListForPCZB'],
  IndicationErrorSystemResponseRecordList: task.IndicationErrorSystemResponseRecordListZB,
}))
class ZbValueError extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPollutantData: [], // 当前选中的污染物
      currentRecordIndex: 0, // 当前量程索引
      currentPollIndex: 0,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'task/GetIndicationErrorSystemResponseRecordListForPCZB',
      payload: {
        TaskID: this.props.TaskID,
        TypeID: this.props.TypeID,
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.IndicationErrorSystemResponseRecordList !==
      this.props.IndicationErrorSystemResponseRecordList
    ) {
      this.onChangePollutant(0);
    }
  }

  // 渲染示值误差表格数据
  renderErrorTableData = () => {
    const { IndicationErrorSystemResponseRecordList } = this.props;
    const errorRecords = IndicationErrorSystemResponseRecordList?.recordList?.filter(
      item => item.recordType === 1,
    );

    return errorRecords?.map((record, index) => (
      <tr key={index}>
        <td style={{ textAlign: 'center' }}>{record.sort}</td>
        <td style={{ textAlign: 'center' }}>{record.nominalValue}</td>
        <td style={{ textAlign: 'center' }}>{record.labelGas1}</td>
        <td style={{ textAlign: 'center' }}>{record.cemsAvg}</td>
        <td style={{ textAlign: 'center' }}>{record.indicationError}</td>
        <td style={{ textAlign: 'center' }}>{record.labelGas2}</td>
        <td style={{ textAlign: 'center' }}>{record.labelGas3}</td>
        <td style={{ textAlign: 'center' }}>
          {Number(record.labelGas2) + Number(record.labelGas3)}
        </td>
        <td style={{ textAlign: 'center' }}>{record.remark}</td>
      </tr>
    ));
  };

  // 渲染系统响应时间表格数据
  renderResponseTimeData = () => {
    const { IndicationErrorSystemResponseRecordList } = this.props;
    const responseRecords = IndicationErrorSystemResponseRecordList?.recordList?.filter(
      item => item.recordType === 2,
    );

    return responseRecords?.map((record, index) => (
      <tr key={index}>
        <td style={{ textAlign: 'center' }}>{record.sort}</td>
        <td style={{ textAlign: 'center' }}>{record.timeT1}</td>
        <td style={{ textAlign: 'center' }}>{record.timeT2}</td>
        <td style={{ textAlign: 'center' }}>{record.responseTime}</td>
        <td style={{ textAlign: 'center' }}>{record.timeAvg}</td>
        <td style={{ textAlign: 'center' }}></td>
        <td style={{ textAlign: 'center' }}></td>
        <td style={{ textAlign: 'center' }}></td>
        <td style={{ textAlign: 'center' }}></td>
      </tr>
    ));
  };

  // 切换污染物
  onChangePollutant = index => {
    this.setState({
      //   currentPollutantData: this.props.IndicationErrorSystemResponseRecordList[index].TableList[0],
      currentRecordIndex: 0,
      currentPollIndex: index,
      currentRecordIndex: 0,
    });
  };

  renderFormData = () => {
    const { IndicationErrorSystemResponseRecordList } = this.props;
    const { currentRecordIndex, currentPollIndex } = this.state;
    const MainModel =
      IndicationErrorSystemResponseRecordList?.[currentPollIndex]?.TableList?.[currentRecordIndex]
        ?.MainModel || {};

    const Point = IndicationErrorSystemResponseRecordList?.[currentPollIndex]?.Point || {};
    return [
      {
        lable: '测试人员',
        value: MainModel?.Tester,
      },
      {
        lable: 'CEMS 生产厂商',
        value: MainModel?.CEMSPlant,
      },
      {
        lable: '测试地点',
        value: Point?.EnterpriseName,
      },
      {
        lable: 'CEMS 型号、编号',
        value: MainModel?.CEMSNumModel,
      },
      {
        lable: '测试位置',
        value: Point?.PointPosition,
      },
      {
        lable: 'CEMS 原理',
        value: MainModel?.CEMSPrinciple,
      },
      {
        lable: '污染物名称',
        value: IndicationErrorSystemResponseRecordList?.[0]?.PollutantCodeList.find(
          item => item.ChildID === MainModel.PollutantCode,
        )?.Name,
      },
      {
        lable: '计量单位',
        value: MainModel.Unit,
      },
      {
        lable: '上次测试日期',
        value: moment(Point.LastCheckTime).format('YYYY-MM-DD'),
      },
      {
        lable: '测试开始结束日期',
        value: Point.CheckBTime + ' ～ ' + Point.CheckETime,
      },
      {
        lable: '工作时间',
        value: Point.WorkingDateBegin + ' ～ ' + Point.WorkingDateEnd,
      },
      {
        lable: '量程',
        value: MainModel?.Range?.replace(',', '-'),
      },
      {
        lable: '维护管理单位',
        value: MainModel.MaintenanceManagementUnit,
        fullRow: true, // 标记该项需要占据整行
      },
    ];
  };

  // 渲染第二个表格的数据
  renderSecondTableData = () => {
    const { IndicationErrorSystemResponseRecordList } = this.props;
    const { currentPollIndex, currentRecordIndex } = this.state;
    debugger;
    const tableData =
      IndicationErrorSystemResponseRecordList?.[currentPollIndex]?.TableList?.[currentRecordIndex]
        ?.ChildList || [];

    // 将数据按每3个分组
    const groupedData = [];
    for (let i = 0; i < tableData.length; i += 3) {
      groupedData.push(tableData.slice(i, i + 3));
    }

    return groupedData.map((group, groupIndex) => {
      // 获取组内的第一条数据用于合并的单元格
      const firstItem = group[0];

      return group.map((item, index) => (
        <tr key={`${groupIndex}-${index}`}>
          <td className={styles.tdCenter}>{groupIndex * 3 + index + 1}</td>
          {index === 0 ? (
            // 第一行显示所有列，包括需要合并的列
            <>
              <td className={styles.tdCenter} rowSpan={group.length}>
                {firstItem.NominalValue || ''}
              </td>
              <td className={styles.tdCenter}>{item.LabelGas1 || ''}</td>
              <td className={styles.tdCenter} rowSpan={group.length}>
                {firstItem.CEMSAvg || ''}
              </td>
              <td className={styles.tdCenter} rowSpan={group.length}>
                {firstItem.IndicationError || ''}
              </td>
              <td className={styles.tdCenter}>{item.TimeT1 || ''}</td>
              <td className={styles.tdCenter}>{item.TimeT2 || ''}</td>
              <td className={styles.tdCenter}>{item.ResponseTime || ''}</td>
              <td className={styles.tdCenter} rowSpan={group.length}>
                {item.TimeAvg || ''}
              </td>
              <td className={styles.tdCenter} rowSpan={group.length}>
                {firstItem.Remark || ''}
              </td>
            </>
          ) : (
            // 非第一行只显示不需要合并的列
            <>
              <td className={styles.tdCenter}>{item.LabelGas1 || ''}</td>
              <td className={styles.tdCenter}>{item.TimeT1 || ''}</td>
              <td className={styles.tdCenter}>{item.TimeT2 || ''}</td>
              <td className={styles.tdCenter}>{item.ResponseTime || ''}</td>
            </>
          )}
        </tr>
      ));
    });
  };

  // 渲染图片
  renderImages = (title, imageType) => {
    const { currentPollIndex } = this.state;
    const { IndicationErrorSystemResponseRecordList } = this.props;
    const Point = IndicationErrorSystemResponseRecordList?.[currentPollIndex]?.Point || {};
    const pic = Point?.[imageType + 'Pic'];
    if (!pic || !pic.ImgList || pic.ImgList.length === 0) {
      return null;
    }

    // 将图片数据转换成SdlUpload需要的格式
    const fileList = pic.ImgList.map((item, index) => ({
      uid: pic.AttachID || `bdjg-${index}`,
      name: pic.ImgNameList?.[index] || `图片${index + 1}`,
      status: 'done',
      url: `/${item}`,
    }));

    return (
      <div className={styles2.uploadSection}>
        <div className={styles2.uploadTitle}>{title}</div>
        <SdlUpload cuid={pic.AttachID} fileList={fileList} accept="image/*" isView={true} />
      </div>
    );
  };

  // 渲染签名
  renderSignature = () => {
    const { IndicationErrorSystemResponseRecordList } = this.props;
    const { currentPollIndex } = this.state;
    const Point = IndicationErrorSystemResponseRecordList?.[currentPollIndex]?.Point || {};
    if (!Point.SignContent) {
      return null;
    }

    return (
      <div className={styles2.signatureSection}>
        <div className={styles2.signatureTitle}>巡检人员签字：</div>
        <img src={Point.SignContent} alt="签名" className={styles2.signatureImage} />
      </div>
    );
  };

  render() {
    const { loading, IndicationErrorSystemResponseRecordList } = this.props;
    const { currentRecordIndex, currentPollIndex } = this.state;
    const appStyle = this.props.appStyle;
    const MainModel =
      IndicationErrorSystemResponseRecordList?.[currentPollIndex]?.TableList?.[currentRecordIndex]
        ?.MainModel || {};
    let style = null;
    if (appStyle) {
      style = appStyle;
    } else {
      //   style = {
      //     height: 'calc(100vh - 200px)',
      //   };
    }

    if (loading) {
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

    const baseData = this.renderFormData();

    return (
      <div style={{}}>
        <div style={{ marginBottom: 20 }} className="no-print">
          <Space direction="vertical">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              defaultValue={0}
              onChange={(e, index) => {
                this.setState({
                  currentPollIndex: e.target.value,
                  currentRecordIndex: 0,
                });
              }}
            >
              {IndicationErrorSystemResponseRecordList?.[0]?.PollutantCodeList?.map(
                (item, index) => {
                  return (
                    <Radio.Button key={index} value={index}>
                      {item.Name}
                    </Radio.Button>
                  );
                },
              )}
            </Radio.Group>
            <Radio.Group
              value={currentRecordIndex}
              onChange={e => {
                this.setState({
                  currentRecordIndex: e.target.value,
                });
              }}
            >
              {IndicationErrorSystemResponseRecordList?.[currentPollIndex]?.TableList?.map(
                (item, index) => {
                  return (
                    <Radio.Button key={index} value={index}>
                      记录{index + 1}
                    </Radio.Button>
                  );
                },
              )}
            </Radio.Group>
          </Space>
        </div>

        <div className={styles.FormDiv} style={style}>
          <div className={styles.FormName}>气态污染物 CEMS 示值误差和系统响应时间检测</div>
          <table className={styles.FormTable}>
            <tbody>
              {/* 每行显示两组数据 */}
              {Array.from({ length: Math.ceil((baseData.length - 1) / 2) }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {/* 第一组数据 */}
                  <td style={{ width: '15%', textAlign: 'center' }}>
                    {baseData[rowIndex * 2]?.lable}
                  </td>
                  <td style={{ width: '35%', textAlign: 'center' }}>
                    {baseData[rowIndex * 2]?.value}
                  </td>
                  {/* 第二组数据（如果存在） */}
                  {baseData[rowIndex * 2 + 1] && !baseData[rowIndex * 2 + 1].fullRow && (
                    <>
                      <td style={{ width: '15%', textAlign: 'center' }}>
                        {baseData[rowIndex * 2 + 1]?.lable}
                      </td>
                      <td style={{ width: '35%', textAlign: 'center' }}>
                        {baseData[rowIndex * 2 + 1]?.value}
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {/* 单独渲染需要占据整行的项目 */}
              {baseData
                .filter(item => item.fullRow)
                .map((item, index) => (
                  <tr key={`fullRow-${index}`}>
                    <td style={{ width: '15%', textAlign: 'center' }}>{item.lable}</td>
                    <td style={{ textAlign: 'center' }} colSpan={3}>
                      {item.value}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* 修改第二个表格 */}
          <table className={styles.FormTable} style={{ marginBottom: '10px' }}>
            <tbody>
              <tr>
                <td
                  rowSpan="3"
                  className={styles.tdCenter}
                  style={{
                    width: '40px',
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  序号
                </td>
                <td
                  rowSpan="3"
                  className={styles.tdCenter}
                  style={{
                    width: '120px',
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  标准气体或校准器件参考值
                </td>
                <td
                  rowSpan="3"
                  className={styles.tdCenter}
                  style={{
                    width: '100px',
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  CEMS显示值
                </td>
                <td
                  rowSpan="3"
                  className={styles.tdCenter}
                  style={{
                    width: '120px',
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  CEMS显示值的平均值
                </td>
                <td
                  rowSpan="3"
                  className={styles.tdCenter}
                  style={{
                    width: '100px',
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  示值误差(%)
                </td>
                <td
                  colSpan="4"
                  className={styles.tdCenter}
                  style={{
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  系统响应时间（s）
                </td>
                <td
                  rowSpan="3"
                  className={styles.tdCenter}
                  style={{
                    width: '100px',
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  备注
                </td>
              </tr>
              <tr>
                <td
                  colSpan="3"
                  className={styles.tdCenter}
                  style={{
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  测量值
                </td>
                <td
                  rowSpan="2"
                  className={styles.tdCenter}
                  style={{
                    width: '80px',
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  平均值
                </td>
              </tr>
              <tr>
                <td
                  className={styles.tdCenter}
                  style={{
                    width: '80px',
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  T1
                </td>
                <td
                  className={styles.tdCenter}
                  style={{
                    width: '80px',
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  T2
                </td>
                <td
                  className={styles.tdCenter}
                  style={{
                    width: '80px',
                    fontWeight: '600',
                    backgroundColor: 'rgb(250, 250, 250)',
                  }}
                >
                  T=T1+T2
                </td>
              </tr>
              {/* 渲染数据行 */}
              {this.renderSecondTableData()}
              {/* 评价依据作为表格的最后一行 */}
              <tr>
                <td colSpan="2" className={styles.tdCenter}>
                  评价依据
                </td>
                <td
                  colSpan="8"
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.5',
                  }}
                >
                  {MainModel?.Col1?.replace(/\\n/g, '\n')?.replace(/\\/g, '') || ''}
                </td>
              </tr>
            </tbody>
          </table>
          {/* 渲染图片 */}
          {IMAGE_LIST.map(item => this.renderImages(item.name, item.key))}
          {/* 渲染签名 */}
          {this.renderSignature()}
        </div>
      </div>
    );
  }
}

export default ZbValueError;
