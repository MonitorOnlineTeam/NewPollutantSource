/*
 * @Author: JiaQi
 * @Date: 2024-04-08 16:09:00
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-11 15:11:59
 * @Description:  数据有效率统计
 */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Select, Input, Progress } from 'antd';
import SdlTable from '@/components/SdlTable';
import styles from '../../styles.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import { handleHomeDate, getModelGuidsByBaseTypeCode } from '@/pages/AbnormalIdentifyModel/CONST';
import EntAtmoList from '@/components/EntAtmoList';
import { RollbackOutlined } from '@ant-design/icons';
import WarningTableData from './WarningTableData';
import CluesListModal from './CluesListModal';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome, AbnormalIdentifyModel }) => ({
  // todoList: wordSupervision.todoList,
  entRequestParams: AbnormalIdentifyModelHome.entRequestParams,
  requestParams: AbnormalIdentifyModelHome.requestParams,
  OverRate: AbnormalIdentifyModelHome.OverRate,
  warningForm: AbnormalIdentifyModel.warningForm,
  loading: !!loading.effects['AbnormalIdentifyModelHome/GetEffectiveDrillDownData'],
});

const DataEfficiencyRateModal = props => {
  const [form] = Form.useForm();
  const { dispatch, loading, warningForm } = props;
  let requestParams = props.level == 3 ? props.entRequestParams : props.requestParams;
  const [dataSource, setDataSource] = useState([[], [], []]);
  const [level, setLevel] = useState(props.level);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCluesModalOpen, setIsCluesModalOpen] = useState(false);
  const [DGIMN, setDGIMN] = useState();
  const [quotaType, setQuotaType] = useState();
  const [modalTitle, setModalTitle] = useState();
  const [modelList, setModelList] = useState([]);
  const [isShowCluesList, setIsShowCluesList] = useState(false);

  useEffect(() => {
    const { btime, etime } = handleHomeDate(requestParams.btime, requestParams.dateType);
    form.setFieldsValue({
      date: [btime, etime],
      ...requestParams,
      regionCode: requestParams.regionCode || undefined,
      industryCode: requestParams.industryCode || undefined,
      entCode: requestParams.entCode || undefined,
      entCode_temp: requestParams.entCode || undefined,
    });
    getPageData(level);
    GetModelList();
  }, []);

  // 获取数据模型列表
  const GetModelList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetModelList',
      payload: {
        type: 1, // 过滤掉打标记和数据现象
      },
      callback: (modelList, unfoldModelList) => {
        setModelList(modelList);
      },
    });
  };

  // 获取页面数据
  const getPageData = dataType => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetEffectiveDrillDownData',
      payload: {
        regionCode: values.regionCode,
        entCode: values.entCode,
        beginTime: values.date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.date[1].format('YYYY-MM-DD HH:mm:ss'),
        dataType: dataType,
        industryCode: values.industryCode,
      },
      callback: res => {
        let dataSource_temp = [...dataSource];
        dataSource_temp[dataType] = res;
        setDataSource(dataSource_temp);
      },
    });
  };

  // 更新异常线索清单model状态
  // const updateCluesListFormState = params => {
  //   dispatch({
  //     type: 'AbnormalIdentifyModel/updateState',
  //     payload: {
  //       warningForm: {
  //         ...warningForm,
  //         all: {
  //           ...warningForm['all'],
  //           rowKey: undefined,
  //           scrollTop: 0,
  //           ...params,
  //         },
  //       },
  //     },
  //   });
  //   setTimeout(() => {
  //     setIsCluesModalOpen(true);
  //   }, 0);
  // };

  // 更新异常线索清单model状态
  const updateCluesListFormState = (rowData, type) => {
    let warningTypeCode = type ? getModelGuidsByBaseTypeCode(modelList, type) : [];
    let requestParams_temp = _.cloneDeep(requestParams);
    const { btime, etime } = handleHomeDate(requestParams_temp.btime, requestParams_temp.dateType);

    let params = {
      date: [],
      date1: [btime, etime],
      regionCode: rowData.RegionCode || undefined,
      warningTypeCode: warningTypeCode,
      PollutantCode:
        requestParams_temp.pollutantCode === '01,02,03' ? '' : requestParams_temp.pollutantCode,
      pageSize: 20,
      pageIndex: 1,
      EntCode: rowData.EntCode,
      DGIMN: rowData.DGIMN,
    };

    // 进入线索列表，传入时间、场景类型、企业、污染物
    dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        warningForm: {
          ...warningForm,
          all: {
            ...warningForm['all'],
            rowKey: undefined,
            scrollTop: 0,
            ...params,
          },
        },
      },
    });
  };

  const getColumns = () => {
    const sorter = (a, b, key) => {
      if (a.RegionName !== '合计' && b.RegionName !== '合计') {
        return a[key] - b[key];
      }
    };

    let columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        fixed: 'left',
        // width: 80,
        render: (text, record, index) => {
          return index + 1;
        },
      },
    ];

    const rateColumn = [
      {
        title: '数据有效率',
        dataIndex: 'EffectiveRate',
        key: 'EffectiveRate',
        fixed: 'left',
        width: 200,
        sorter: (a, b) => sorter(a, b, 'EffectiveRate'),
        render: (text, record) => {
          let percent = Number(text).toFixed(2);
          return (
            <Progress
              successPercent={percent}
              percent={percent}
              size="small"
              style={{ width: '76%' }}
              format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
            />
          );
        },
      },
      {
        title: '运行率',
        dataIndex: 'RunRate',
        key: 'RunRate',
        fixed: 'left',
        width: 200,
        sorter: (a, b) => sorter(a, b, 'RunRate'),
        render: (text, record) => {
          let percent = Number(text).toFixed(2);
          return (
            <Progress
              successPercent={percent}
              percent={percent}
              size="small"
              style={{ width: '76%' }}
              format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
            />
          );
        },
      },
    ];
    switch (level) {
      case 1:
        columns.push(
          {
            title: '行政区',
            dataIndex: 'RegionName',
            key: 'RegionName',
            fixed: 'left',
            render: (text, record) => {
              return text !== '合计' ? (
                <a
                  onClick={e => {
                    form.setFieldsValue({ regionCode: record.RegionCode });
                    setLevel(2);
                    getPageData(2);
                  }}
                >
                  {text}
                </a>
              ) : (
                text
              );
            },
          },
          {
            title: '企业数',
            dataIndex: 'EntNum',
            key: 'EntNum',
            fixed: 'left',
            width: 120,
            sorter: (a, b) => a.EntNum - b.EntNum,
          },
          {
            title: '监测点数',
            dataIndex: 'PointNum',
            key: 'PointNum',
            fixed: 'left',
            width: 120,
            sorter: (a, b) => a.PointNum - b.PointNum,
          },
        );
        break;
      case 2:
        columns.push(
          {
            title: '行政区',
            dataIndex: 'RegionName',
            key: 'RegionName',
            fixed: 'left',
          },
          {
            title: '企业',
            dataIndex: 'EntName',
            fixed: 'left',
            key: 'EntName',
            width: 200,
            render: (text, record) => {
              return record.RegionName !== '合计' ? (
                <a
                  onClick={e => {
                    form.setFieldsValue({ entCode: record.EntCode });
                    setLevel(3);
                    getPageData(3);
                  }}
                >
                  {text}
                </a>
              ) : (
                text
              );
            },
          },
          {
            title: '监测点数',
            dataIndex: 'PointNum',
            key: 'PointNum',
            fixed: 'left',
            width: 120,
            sorter: (a, b) => a.PointNum - b.PointNum,
          },
        );
        break;
      case 3:
        columns.push(
          {
            title: '行政区',
            dataIndex: 'RegionName',
            key: 'RegionName',
            fixed: 'left',
          },
          {
            title: '企业',
            dataIndex: 'EntName',
            key: 'EntName',
            width: 200,
            fixed: 'left',
          },
          {
            title: '监测点',
            dataIndex: 'PointName',
            key: 'PointName',
            width: 200,
            fixed: 'left',
            render: (text, record) => {
              return record.RegionName !== '合计' ? (
                <a
                  onClick={e => {
                    // let requestParams_temp = _.cloneDeep(requestParams);
                    // const { btime, etime } = handleHomeDate(
                    //   requestParams_temp.btime,
                    //   requestParams_temp.dateType,
                    // );
                    // // 进入线索列表，传入时间、场景类型、企业、污染物
                    // updateCluesListFormState({
                    //   date: [],
                    //   date1: [btime, etime],
                    //   regionCode: record.RegionCode,
                    //   // warningTypeCode: item.code,
                    //   PollutantCode:
                    //     requestParams_temp.pollutantCode === '01,02,03'
                    //       ? ''
                    //       : requestParams_temp.pollutantCode,
                    //   pageSize: 20,
                    //   pageIndex: 1,
                    //   EntCode: record.EntCode,
                    //   DGIMN: record.DGIMN,
                    // });
                    updateCluesListFormState(record);
                    setTimeout(() => {
                      setIsCluesModalOpen(true);
                    }, 0);
                  }}
                >
                  {text}
                </a>
              ) : (
                text
              );
            },
          },
        );
        break;
      default:
        break;
    }

    const sameColumns = [
      {
        title: '总时长',
        dataIndex: 'AllHours',
        key: 'AllHours',
        width: 160,
        sorter: (a, b) => a.AllHours - b.AllHours,
      },
      {
        title: '停炉小时数',
        dataIndex: 'StopHour',
        key: 'StopHour',
        sorter: (a, b) => a.StopHour - b.StopHour,
        render: (text, record) => {
          return level == 3 && record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onHourNumClick(record, 'StopHour', '停炉');
              }}
            >
              {text}
            </a>
          ) : (
            text
          );
        },
      },
      {
        title: '排放源运行小时数',
        dataIndex: 'RunHour',
        key: 'RunHour',
        sorter: (a, b) => a.RunHour - b.RunHour,
        render: (text, record) => {
          return level == 3 && record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onHourNumClick(record, 'RunHour', '排放源运行小时数');
              }}
            >
              {text}
            </a>
          ) : (
            text
          );
        },
      },
      {
        title: '维护数据小时数',
        dataIndex: 'DefendHour',
        key: 'DefendHour',
        sorter: (a, b) => a.DefendHour - b.DefendHour,
        // 内蒙注释掉
        render: (text, record) => {
          return level == 3 && record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onHourNumClick(record, 'DefendHour', '维护数据');
              }}
            >
              {text}
            </a>
          ) : (
            text
          );
        },
      },
      {
        title: '数据现象异常小时数',
        dataIndex: 'DataExceptionHour',
        key: 'DataExceptionHour',
        sorter: (a, b) => a.DataExceptionHour - b.DataExceptionHour,
        render: (text, record) => {
          return level == 3 && record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onHourNumClick(record, 'DataException', '数据现象异常小时数');
              }}
            >
              {text}
            </a>
          ) : (
            text
          );
        },
      },
      {
        title: '人为干预小时数',
        dataIndex: 'RenweiHour',
        key: 'RenweiHour',
        sorter: (a, b) => a.RenweiHour - b.RenweiHour,
        render: (text, record) => {
          return level == 3 && record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onHourNumClick(record, 'RenweiHour', '人为干预', true);
                updateCluesListFormState(record, '1');
              }}
            >
              {text}
            </a>
          ) : (
            text
          );
        },
      },
      {
        title: '设备故障小时数',
        dataIndex: 'FaultHour',
        key: 'FaultHour',
        sorter: (a, b) => a.FaultHour - b.FaultHour,
        render: (text, record) => {
          return level == 3 && record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onHourNumClick(record, 'FaultHour', '设备故障', true);
                updateCluesListFormState(record, '2');
              }}
            >
              {text}
            </a>
          ) : (
            text
          );
        },
      },
      {
        title: '工况正常缺失小时数',
        dataIndex: 'NormalMissHour',
        key: 'NormalMissHour',
        width: 200,
        sorter: (a, b) => a.NormalMissHour - b.NormalMissHour,
        render: (text, record) => {
          return level == 3 && record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onHourNumClick(record, 'NormalMissHour', '工况正常缺失', true);
                updateCluesListFormState(record, '4');
              }}
            >
              {text}
            </a>
          ) : (
            text
          );
        },
      },
      {
        title: 'CEMS正常测量数据小时数',
        dataIndex: 'NomarlHour',
        key: 'NomarlHour',
        width: 200,
        sorter: (a, b) => a.NomarlHour - b.NomarlHour,
        render: (text, record) => {
          return level == 3 && record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onHourNumClick(record, 'NormalHour', 'CEMS正常测量数据');
              }}
            >
              {text}
            </a>
          ) : (
            text
          );
        },
      },
    ];

    return [...columns, ...rateColumn, ...sameColumns];
  };

  // 返回
  const onBack = () => {
    if (level == 2) {
      form.setFieldsValue({ entCode: undefined, regionCode: undefined, entCode_temp: undefined });
    }
    let level_temp = level - 1;
    setLevel(level_temp);
  };

  // 小数数点击事件 - 打开数据工况表格
  const onHourNumClick = (record, quotaType, title, isShowCluesList) => {
    setQuotaType(quotaType);
    setDGIMN(record.DGIMN);
    setIsModalOpen(true);
    setModalTitle(title);
    setIsShowCluesList(isShowCluesList);
  };

  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }}>
      <Form
        name="searchForm"
        form={form}
        layout="inline"
        // initialValues={{
        //   ...requestParams,
        // }}
        autoComplete="off"
        onValuesChange={(changedFields, allFields) => {}}
      >
        <div style={{ display: level == 1 ? 'flex' : 'none' }}>
          <Form.Item label="日期" name="date">
            <RangePicker_ dataType="day" format="YYYY-MM-DD" style={{ width: 250 }} />
          </Form.Item>
          <Form.Item label="行业" name="industryCode">
            <SearchSelect
              placeholder="排口所属行业"
              style={{ width: 130 }}
              configId={'IndustryType'}
              itemName={'dbo.T_Cod_IndustryType.IndustryTypeName'}
              itemValue={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => getPageData(1)} loading={loading}>
              查询
            </Button>
          </Form.Item>
        </div>
        <Form.Item label="行政区" name="regionCode" style={{ display: 'none' }}>
          <Input />
        </Form.Item>
        <Form.Item label="企业" name="entCode" style={{ display: 'none' }}>
          <Input />
        </Form.Item>
        <Form.Item
          label="企业"
          name="entCode_temp"
          style={{ display: level == 2 ? 'block' : 'none' }}
        >
          <EntAtmoList
            regionCode={form.getFieldValue('regionCode')}
            style={{ width: 200 }}
            onChange={value => {
              form.setFieldValue('entCode', value);
              getPageData(2);
            }}
          />
        </Form.Item>
        {level != 1 && props.level !== level && (
          <Form.Item>
            <Button onClick={() => onBack()}>
              <RollbackOutlined />
              返回
            </Button>
          </Form.Item>
        )}
      </Form>
      <SdlTable
        rowKey={(record, index) => index}
        defaultWidth={200}
        loading={loading}
        align="center"
        dataSource={dataSource[level]}
        columns={getColumns()}
        scroll={{ y: 'calc(100vh - 250px)' }}
      />
      {isModalOpen && (
        <WarningTableData
          open={isModalOpen}
          DGIMN={DGIMN}
          quotaType={quotaType}
          date={form.getFieldValue('date')}
          title={modalTitle}
          isShowCluesList={isShowCluesList}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}

      <CluesListModal
        // history={props.history}
        open={isCluesModalOpen}
        onCancel={() => setIsCluesModalOpen(false)}
      />
    </Card>
  );
};

export default connect(dvaPropsData)(DataEfficiencyRateModal);
