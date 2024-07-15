/*
 * @Author: JiaQi
 * @Date: 2024-04-24 10:31:43
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-04-24 18:02:41
 * @Description:  超标率统计
 */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Select, Input, Progress } from 'antd';
import SdlTable from '@/components/SdlTable';
import styles from '../../styles.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import { handleHomeDate } from '@/pages/AbnormalIdentifyModel/CONST';
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
  loading: !!loading.effects['AbnormalIdentifyModelHome/GetOverStandardDrillDownData'],
});

const OverRateModal = props => {
  const [form] = Form.useForm();
  const { dispatch, loading, warningForm } = props;
  const [dataSource, setDataSource] = useState([[], [], []]);
  const [level, setLevel] = useState(props.level);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCluesModalOpen, setIsCluesModalOpen] = useState(false);
  const [DGIMN, setDGIMN] = useState();
  const [quotaType, setQuotaType] = useState();
  const [modalTitle, setModalTitle] = useState();

  let requestParams = props.level == 3 ? props.entRequestParams : props.requestParams;

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
  }, []);

  // 获取页面数据
  const getPageData = dataType => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetOverStandardDrillDownData',
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
  const updateCluesListFormState = params => {
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
    setTimeout(() => {
      setIsCluesModalOpen(true);
    }, 0);
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        // width: 80,
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
            width: 200,
            render: (text, record) => {
              return record.RegionName !== '合计' ? (
                <a
                  onClick={e => {
                    // onHourNumClick(record, 'StopHour', '停炉');
                    let requestParams_temp = _.cloneDeep(requestParams);
                    const { btime, etime } = handleHomeDate(
                      requestParams_temp.btime,
                      requestParams_temp.dateType,
                    );
                    // 进入线索列表，传入时间、场景类型、企业、污染物
                    updateCluesListFormState({
                      date: [],
                      date1: [btime, etime],
                      regionCode: record.RegionCode,
                      // warningTypeCode: item.code,
                      PollutantCode:
                        requestParams_temp.pollutantCode === '01,02,03'
                          ? ''
                          : requestParams_temp.pollutantCode,
                      pageSize: 20,
                      pageIndex: 1,
                      EntCode: record.EntCode,
                      DGIMN: record.DGIMN,
                    });
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
        title: '排放源运行小时数',
        dataIndex: 'RunHourNum',
        key: 'RunHourNum',
        sorter: (a, b) => a.RunHourNum - b.RunHourNum,
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
        title: '超标小时数',
        dataIndex: 'OverHourNum',
        key: 'OverHourNum',
        sorter: (a, b) => a.OverHourNum - b.OverHourNum,
        render: (text, record) => {
          return level == 3 && record.RegionName !== '合计' ? (
            <a
              onClick={e => {
                onHourNumClick(record, 'OverHour', '超标小时数');
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

    const rateColumn = [
      {
        title: '超标率',
        dataIndex: 'OverRate',
        key: 'OverRate',
        // fixed: 'left',
        width: 240,
        sorter: (a, b) => a.OverRate - b.OverRate,
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
  // 陡变计算过程的折线图显示
  // 小数数点击事件 - 打开数据工况表格
  const onHourNumClick = (record, quotaType, title) => {
    setQuotaType(quotaType);
    setDGIMN(record.DGIMN);
    setIsModalOpen(true);
    setModalTitle(title);
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
        dataSource={dataSource[level]}
        scroll={{ y: 'calc(100vh - 250px)' }}
        columns={getColumns()}
      />
      {isModalOpen && (
        <WarningTableData
          open={isModalOpen}
          DGIMN={DGIMN}
          quotaType={quotaType}
          date={form.getFieldValue('date')}
          title={modalTitle}
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

export default connect(dvaPropsData)(OverRateModal);
