/*
 * @Author: JiaQi
 * @Date: 2024-04-24 10:36:40
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-29 16:13:49
 * @Description:  数据质量分析
 */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Select, Input, Progress } from 'antd';
import SdlTable from '@/components/SdlTable';
import styles from '../../styles.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import {
  handleHomeDate,
  getModelGuidsByBaseTypeCode,
  ModalTypeNameConversion,
} from '@/pages/AbnormalIdentifyModel/CONST';
import EntAtmoList from '@/components/EntAtmoList';
import { RollbackOutlined } from '@ant-design/icons';
import WarningTableData from './WarningTableData';
import CluesListModal from './CluesListModal';
import { isArray } from 'lodash';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome, AbnormalIdentifyModel }) => ({
  // todoList: wordSupervision.todoList,
  entRequestParams: AbnormalIdentifyModelHome.entRequestParams,
  OverRate: AbnormalIdentifyModelHome.OverRate,
  warningForm: AbnormalIdentifyModel.warningForm,
  loading: !!loading.effects['AbnormalIdentifyModelHome/GetQualityDrillDownData'],
});

const DataQualityAnalysisModal = props => {
  const [form] = Form.useForm();
  const { dispatch, loading, warningForm } = props;
  let requestParams = props.entRequestParams;
  const [dataSource, setDataSource] = useState([]);
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
      industryCode: requestParams.industryCode || undefined,
      entCode: requestParams.entCode || undefined,
    });
    getPageData();
    GetModelList();
  }, []);

  // 获取数据模型列表
  const GetModelList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetModelList',
      payload: {
        type: 1, // 过滤掉打标记和数据现象
      },
      callback: modelList => {
        setModelList(modelList);
      },
    });
  };

  // 获取页面数据
  const getPageData = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetQualityDrillDownData',
      payload: {
        regionCode: values.regionCode,
        entCode: values.entCode,
        beginTime: values.date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.date[1].format('YYYY-MM-DD HH:mm:ss'),
        industryCode: values.industryCode,
      },
      callback: res => {
        setDataSource(res);
      },
    });
  };

  // // 更新异常线索清单model状态
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
    let warningTypeCode = [];
    if (isArray(type)) {
      // 合并数组，数据异常小时数包括：人为干预和故障
      warningTypeCode = getModelGuidsByBaseTypeCode(modelList, type[0]).concat(
        getModelGuidsByBaseTypeCode(modelList, type[1]),
      );
    } else {
      warningTypeCode = getModelGuidsByBaseTypeCode(modelList, type);
    }
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
    let columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
      },
      {
        title: '企业',
        dataIndex: 'EntName',
        key: 'EntName',
        width: 200,
      },
      {
        title: '监测点',
        dataIndex: 'PointName',
        key: 'PointName',
        width: 200,
        render: (text, record) => {
          return record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                // // onHourNumClick(record, 'StopHour', '停炉');
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
    ];
    const sameColumns = [
      {
        title: '总时长',
        dataIndex: 'AllHours',
        key: 'AllHours',
        width: 160,
        sorter: (a, b) => a.AllHours - b.AllHours,
      },
      {
        title: '排放源运行小时数',
        dataIndex: 'RunHour',
        key: 'RunHour',
        sorter: (a, b) => a.RunHour - b.RunHour,
        render: (text, record) => {
          return (
            <a
              onClick={e => {
                onHourNumClick(record, 'RunHour', '排放源运行');
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: '停炉小时数',
        dataIndex: 'StopHour',
        key: 'StopHour',
        sorter: (a, b) => a.StopHour - b.StopHour,
        render: (text, record) => {
          return (
            <a
              onClick={e => {
                onHourNumClick(record, 'StopHour', '停炉数据');
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: '数据异常',
        children: [
          {
            title: '数据异常小时数',
            dataIndex: 'ExceptionHour',
            key: 'StopHour',
            width: 180,
            align: 'center',
            sorter: (a, b) => a.StopHour - b.StopHour,
            render: (text, record) => {
              return (
                <a
                  onClick={e => {
                    onHourNumClick(record, 'ExceptionHour', '数据异常', true);
                    updateCluesListFormState(record, ['1', '2']);
                  }}
                >
                  {text}
                </a>
              );
            },
          },
          {
            title: '数据异常率',
            dataIndex: 'ExceptionRate',
            key: 'ExceptionRate',
            width: 240,
            align: 'center',
            sorter: (a, b) => a.ExceptionRate - b.ExceptionRate,
            render: (text, record) => {
              let percent = Number(text).toFixed(2);
              return (
                <Progress
                  successPercent={percent}
                  percent={percent}
                  size="small"
                  style={{ width: '80%' }}
                  format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
                />
              );
            },
          },
          {
            title: ModalTypeNameConversion('人为干预小时数'),
            dataIndex: 'RenweiHour',
            key: 'RenweiHour',
            width: 180,
            align: 'center',
            sorter: (a, b) => a.RenweiHour - b.RenweiHour,
            render: (text, record) => {
              return (
                <a
                  onClick={e => {
                    onHourNumClick(
                      record,
                      'RenweiHour',
                      ModalTypeNameConversion('人为干预数据'),
                      true,
                    );
                    updateCluesListFormState(record, '1');
                  }}
                >
                  {text}
                </a>
              );
            },
          },
          {
            title: ModalTypeNameConversion('设备故障'),
            children: [
              {
                title: ModalTypeNameConversion('设备故障小时数'),
                dataIndex: 'FaultHour',
                key: 'FaultHour',
                width: 180,
                align: 'center',
                sorter: (a, b) => a.FaultHour - b.FaultHour,
                render: (text, record) => {
                  return (
                    <a
                      onClick={e => {
                        onHourNumClick(
                          record,
                          'FaultHour',
                          ModalTypeNameConversion('设备故障'),
                          true,
                        );
                        updateCluesListFormState(record, '2');
                      }}
                    >
                      {text}
                    </a>
                  );
                },
              },
              {
                title: '故障率',
                dataIndex: 'FaultRate',
                key: 'FaultRate',
                width: 240,
                align: 'center',
                sorter: (a, b) => a.FaultRate - b.FaultRate,
                render: (text, record) => {
                  let percent = Number(text).toFixed(2);
                  return (
                    <Progress
                      successPercent={percent}
                      percent={percent}
                      size="small"
                      style={{ width: '80%' }}
                      format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
                    />
                  );
                },
              },
            ],
          },
        ],
      },
      {
        title: '数据缺失',
        children: [
          {
            title: '数据缺失小时数',
            dataIndex: 'NormalMissHour',
            key: 'NormalMissHour',
            width: 200,
            align: 'center',
            sorter: (a, b) => a.NormalMissHour - b.NormalMissHour,
            render: (text, record) => {
              return (
                <a
                  onClick={e => {
                    onHourNumClick(record, 'NormalMissHour', '数据缺失', true);
                    updateCluesListFormState(record, '4');
                  }}
                >
                  {text}
                </a>
              );
            },
          },
          {
            title: '数据缺失率',
            dataIndex: 'NormalMissRate',
            key: 'NormalMissRate',
            width: 240,
            align: 'center',
            sorter: (a, b) => a.NormalMissRate - b.NormalMissRate,
            render: (text, record) => {
              let percent = Number(text).toFixed(2);
              return (
                <Progress
                  successPercent={percent}
                  percent={percent}
                  size="small"
                  style={{ width: '80%' }}
                  format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
                />
              );
            },
          },
        ],
      },
      {
        title: '设备维护',
        children: [
          {
            title: '设备维护小时数',
            dataIndex: 'DefendHour',
            key: 'DefendHour',
            width: 180,
            align: 'center',
            sorter: (a, b) => a.DefendHour - b.DefendHour,
            render: (text, record) => {
              return (
                <a
                  onClick={e => {
                    onHourNumClick(record, 'DefendHour', '设备维护');
                  }}
                >
                  {text}
                </a>
              );
            },
          },
          {
            title: '设备维护率',
            dataIndex: 'DefendRate',
            key: 'DefendRate',
            width: 240,
            align: 'center',
            sorter: (a, b) => a.DefendRate - b.DefendRate,
            render: (text, record) => {
              let percent = Number(text).toFixed(2);
              return (
                <Progress
                  successPercent={percent}
                  percent={percent}
                  size="small"
                  style={{ width: '80%' }}
                  format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
                />
              );
            },
          },
        ],
      },
    ];

    return [...columns, ...sameColumns];
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
        <Form.Item label="企业" name="entCode" style={{ display: level == 2 ? 'block' : 'none' }}>
          <EntAtmoList
            regionCode={form.getFieldValue('regionCode')}
            style={{ width: 200 }}
            onChange={value => {
              getPageData(2);
            }}
          />
        </Form.Item>
      </Form>
      <SdlTable
        rowKey={(record, index) => index}
        defaultWidth={200}
        loading={loading}
        align="center"
        dataSource={dataSource}
        columns={getColumns()}
        scroll={{ y: 'calc(100vh - 200px)' }}
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

export default connect(dvaPropsData)(DataQualityAnalysisModal);
