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
import CluesListModal from './CluesListModal';

const dvaPropsData = ({ loading, AbnormalIdentifyModel, AbnormalIdentifyModelHome }) => ({
  // todoList: wordSupervision.todoList,
  warningForm: AbnormalIdentifyModel.warningForm,
  requestParams: AbnormalIdentifyModelHome.requestParams,
  loading: !!loading.effects['AbnormalIdentifyModelHome/GetClueDrillDownData'],
});

const ClueStatisticsModal = props => {
  const [form] = Form.useForm();
  const { dispatch, requestParams, loading, warningForm } = props;
  const [dataSource, setDataSource] = useState([[], [], []]);
  const [level, setLevel] = useState(props.level);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelList, setModelList] = useState([]);

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
      type: 'AbnormalIdentifyModelHome/GetClueDrillDownData',
      payload: {
        regionCode: values.regionCode,
        entCode: values.entCode,
        btime: values.date[0].format('YYYY-MM-DD HH:mm:ss'),
        etime: values.date[1].format('YYYY-MM-DD HH:mm:ss'),
        pLeve: dataType,
        industryCode: values.industryCode,
        pollutantCode: requestParams.pollutantCode,
      },
      callback: res => {
        let dataSource_temp = [...dataSource];
        dataSource_temp[dataType] = res;
        setDataSource(dataSource_temp);
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
    ];
    switch (level) {
      case 1:
        columns.push(
          {
            title: '行政区',
            dataIndex: 'RegionName',
            key: 'RegionName',
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
            width: 160,
            sorter: (a, b) => a.EntNum - b.EntNum,
          },
          {
            title: '监测点数',
            dataIndex: 'PointNum',
            key: 'PointNum',
            width: 160,
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
          },
          {
            title: '企业',
            dataIndex: 'EntName',
            key: 'EntName',
            width: 160,
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
            width: 160,
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
          },
          {
            title: '企业',
            dataIndex: 'EntName',
            key: 'EntName',
            width: 160,
          },
          {
            title: '监测点',
            dataIndex: 'PointName',
            key: 'PointName',
            width: 160,
          },
        );
        break;
      default:
        break;
    }

    const sameColumns = [
      {
        title: 'CEMS运行管理异常（条）',
        dataIndex: 'Count_3',
        key: 'Count_3',
        width: 160,
        sorter: (a, b) => a.Count_3 - b.Count_3,
        render: (text, record) => {
          return record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onNumberClick('3', record);
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
        title: '数据缺失（条）',
        dataIndex: 'Count_4',
        key: 'Count_4',
        sorter: (a, b) => a.Count_4 - b.Count_4,
        render: (text, record) => {
          return record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onNumberClick('4', record);
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
        title: '人为干预（条）',
        dataIndex: 'Count_1',
        key: 'Count_1',
        sorter: (a, b) => a.Count_1 - b.Count_1,
        render: (text, record) => {
          return record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onNumberClick('1', record);
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
        title: '设备故障（条）',
        dataIndex: 'Count_2',
        key: 'Count_2',
        sorter: (a, b) => a.Count_2 - b.Count_2,
        render: (text, record) => {
          return record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onNumberClick('2', record);
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

    return [...columns, ...sameColumns];
  };

  const onNumberClick = (type, rowData) => {
    let warningTypeCode = getModelGuidsByBaseTypeCode(modelList, type);
    let requestParams_temp = _.cloneDeep(requestParams);
    const values = form.getFieldsValue();
    let btime = values.date[0];
    let etime = values.date[1];
    // 进入线索列表，传入时间、场景类型、企业、污染物
    updateCluesListFormState({
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
    });
  };

  // 更新异常线索清单model状态
  const updateCluesListFormState = params => {
    dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        warningForm: {
          ...warningForm,
          all: {
            ...warningForm['all'],
            // EntCode: undefined,
            rowKey: undefined,
            scrollTop: 0,
            ...params,
          },
        },
      },
    });
    setTimeout(() => {
      setIsModalOpen(true);
    }, 0);
  };

  // 返回
  const onBack = () => {
    if (level == 2) {
      form.setFieldsValue({ entCode: undefined, regionCode: undefined, entCode_temp: undefined });
    }
    let level_temp = level - 1;
    setLevel(level_temp);
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
        {form.getFieldValue('regionCode') && (
          <Form.Item
            label="企业"
            name="entCode_temp"
            style={{ display: level == 2 ? 'block' : 'none' }}
          >
            <EntAtmoList
              regionCode={form.getFieldValue('regionCode')}
              // noFilter
              style={{ width: 200 }}
              onChange={value => {
                form.setFieldValue('entCode', value);
                getPageData(2);
              }}
            />
          </Form.Item>
        )}
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
        dataSource={dataSource[level]}
        columns={getColumns()}
      />

      <CluesListModal
        // history={props.history}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        scroll={{ y: 'calc(100vh - 250px)' }}
      />
    </Card>
  );
};

export default connect(dvaPropsData)(ClueStatisticsModal);
