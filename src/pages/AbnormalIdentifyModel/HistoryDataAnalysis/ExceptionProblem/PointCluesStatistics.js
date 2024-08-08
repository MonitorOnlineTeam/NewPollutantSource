import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Tag,
  Radio,
  Row,
  Col,
  Space,
  Button,
  Statistic,
  Form,
  InputNumber,
  Modal,
} from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import CluesListModal from '@/pages/AbnormalIdentifyModel/Home/ModalPage/CluesListModal.js';
import WarningTableData from '@/pages/AbnormalIdentifyModel/Home/ModalPage/WarningTableData.js';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  warningForm: AbnormalIdentifyModel.warningForm,
  loading: loading.effects['AbnormalIdentifyModel/GetExcepInfoPageData'],
});

const PointCluesStatistics = props => {
  const [form] = Form.useForm();

  const { dispatch, loading, data, open, onCancel, reqParams, warningForm } = props;

  const [cluesListModalOpen, setCluesListModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [currentHourData, setCurrentHourData] = useState({});
  const [entCode, setEntCode] = useState();
  const [rateData, setRateData] = useState({
    TranEffRate: 0,
    TranInvRate: 0,
    EffRate: 0,
    InvRate: 0,
  });
  const [dataSource, setDataSource] = useState([]);
  const [dataSource2, setDataSource2] = useState([]);

  useEffect(() => {
    loadData();

    return () => {
      // 组件销毁，重置数据
      resetCluesListParams();
    };
  }, []);

  // 重置数据列表表单
  const resetCluesListParams = () => {
    // 重置表单
    dispatch({
      type: 'AbnormalIdentifyModel/onReset',
      payload: {
        modelNumber: 'all',
      },
    });
  };

  //
  const loadData = _dataType => {
    let bTime = moment(reqParams.date[0]).format('YYYY-MM-DD HH:mm:ss');
    let eTime = moment(reqParams.date[1]).format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'AbnormalIdentifyModel/GetExcepInfoPageData',
      payload: {
        ...reqParams,
        beginTime: bTime,
        endTime: eTime,
        date: undefined,
        modelGuid: data.ModelGuid,
      },
      callback: result => {
        if (result.IsSuccess) {
          setDataSource(result.Datas.TableData);
        }
      },
    });

    // {
    //   "dgimn": "",
    //   "entCode": "",
    //   "regionCode": "",
    //   "beginTime": "2024-01-23",
    //   "endTime": "2024-07-23",
    //   "modelExcepLevel": "",
    //   "modelExcepType": "",
    //   "modelExcepAction": "",
    //   "modelGuid": ""
    // }
  };

  // 更新异常线索清单model状态
  const updateCluesListFormState = row => {
    const { ParentKey, Key } = row;

    let params = {};
    if (reqParams.modelExcepLevel) {
      params.level = data.ModelGuid.split(',');
    }
    if (reqParams.modelExcepType) {
      params.types = data.ModelGuid.split(',');
    }
    if (reqParams.modelExcepAction) {
      params.warningTypeCode = data.ModelGuid.split(',');
    }

    let body = {
      date: [],
      date1: reqParams.date,
      pageSize: 20,
      pageIndex: 1,
      rowKey: undefined,
      scrollTop: 0,
      // warningTypeCode: data.ModelGuid.split(','),
      EntCode: ParentKey,
      DGIMN: Key,
      ...params,
    };

    // 进入线索列表，传入时间、场景类型、企业、污染物
    dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        warningForm: {
          ...warningForm,
          all: {
            ...warningForm['all'],
            ...body,
          },
        },
      },
    });
    setCluesListModalOpen(true);
  };

  const getColumns = () => {
    const columns = [
      {
        title: '序号',
      },
      {
        title: '企业',
        dataIndex: 'ParentName',
        key: 'ParentName',
        ellipsis: true,
      },
      {
        title: '排口',
        dataIndex: 'Name',
        key: 'Name',
        ellipsis: true,
        sorter: (a, b) => a.ExcepRate - b.ExcepRate,
      },
      {
        title: '异常小时数',
        dataIndex: 'ExcepHours',
        key: 'ExcepHours',
        width: 100,
        sorter: (a, b) => a.ExcepHours - b.ExcepHours,
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                let quotaType = '';
                // 全部合计：0
                if (reqParams.modelExcepLevel) {
                  quotaType =
                    'level-' +
                    (reqParams.modelExcepLevel.length > 1
                      ? 0
                      : reqParams.modelExcepLevel.toString());
                }
                if (reqParams.modelExcepType) {
                  quotaType =
                    'type-' +
                    (reqParams.modelExcepType.length > 1 ? 0 : reqParams.modelExcepType.toString());
                }
                if (reqParams.modelExcepAction) {
                  const list = ['RenweiHour', 'FaultHour', 'CEMSException', 'NormalMissHour'];
                  quotaType =
                    reqParams.modelExcepAction.length > 1
                      ? list.toString()
                      : list[reqParams.modelExcepAction - 1];
                }
                setCurrentHourData({
                  quotaType,
                  DGIMN: record.Key,
                  title: `(${record.ParentName}/${record.Name}) - 异常小时数`,
                  ModelGuid: data.ModelGuid,
                });
                setIsModalOpen(true);
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: '异常次数',
        dataIndex: 'ExcepNums',
        key: 'ExcepNums',
        width: 100,
        sorter: (a, b) => a.ExcepNums - b.ExcepNums,
        render: (text, record) => {
          return <a onClick={() => updateCluesListFormState(record)}>{text}</a>;
        },
      },

      {
        title: '操作',
        dataIndex: 'ReasonList',
        key: 'ReasonList',
        ellipsis: true,
        width: 100,
        render: (text, record) => {
          return <a onClick={() => updateCluesListFormState(record)}>查看线索</a>;
        },
      },
    ];
    return columns;
  };

  return (
    <Modal
      title={data.ModelName}
      width={800}
      // wrapClassName={
      //   window.location.pathname === '/SystemDashboard/AbnormalIdentify'
      //     ? 'fullScreenModal'
      //     : 'spreadOverModal'
      // }
      destroyOnClose
      open={open}
      footer={false}
      onCancel={onCancel}
    >
      <SdlTable
        loading={loading}
        align="center"
        columns={getColumns()}
        dataSource={dataSource}
        pagination={false}
        scroll={{ y: 'calc(100vh - 300px)' }}
      />
      <CluesListModal open={cluesListModalOpen} onCancel={() => setCluesListModalOpen(false)} />
      {isModalOpen && (
        <WarningTableData
          open={isModalOpen}
          DGIMN={currentHourData.DGIMN}
          ModelGuid={currentHourData.ModelGuid}
          quotaType={currentHourData.quotaType}
          date={reqParams.date}
          title={currentHourData.title}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </Modal>
  );
};

export default connect(dvaPropsData)(PointCluesStatistics);
