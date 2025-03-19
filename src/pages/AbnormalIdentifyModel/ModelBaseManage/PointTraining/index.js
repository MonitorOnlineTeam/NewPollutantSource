/*
 * @Author: JiaQi
 * @Date: 2024-09-02 17:05:03
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-02-07 09:37:09
 * @Description:  新增点位训练页面
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Steps,
  Tag,
  DatePicker,
  Space,
  Button,
  Form,
  message,
  Popconfirm,
  Tooltip,
  Popover,
  Badge,
  Empty,
  Modal,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from '@/pages/AbnormalIdentifyModel/styles.less';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { API } from '@config/API';
import SelectPointModal from '@/pages/AbnormalIdentifyModel/ModelBase/SelectPointModal.js';
import moment from 'moment';
import MonitoringStandard from '@/components/MonitoringStandard';
import EquipmentParmars from '@/pages/platformManager/equipmentParmars/ContentPages.js';
import AssistDataAnalysis from '@/pages/AbnormalIdentifyModel/AssistDataAnalysis';
import SelectPmCemsSupplierModal from '@/pages/platformManager/combustionProcess/SelectPmCemsSupplierModal.js';
import { router } from 'umi';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({});

const PointTraining = props => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stepsList, setStepsList] = useState([]);
  const [isSelectPointModalOpen, setIsSelectPointModalOpen] = useState(false);
  const [pointList, setPointList] = useState([]);
  const [beginTime, setBeginTime] = useState();
  const [endTime, setEndTime] = useState();
  const [pollutantCheckDatas, setPollutantCheckDatas] = useState([]);
  const [paramsCheck, setParamsCheck] = useState([]);
  const [statusList, setStatusList] = useState({});
  const [combustionProcess, setCombustionProcess] = useState([]);

  const [trainBeginTime, setTrainBeginTime] = useState();
  const [trainEndTime, setTrainEndTime] = useState();
  const [workConDate, setWorkConDate] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [isParamsModalOpen, setIsParamsModalOpen] = useState(false);
  const [isWrwModalOpen, setIsWrwModalOpen] = useState(false);
  const [isPmCemsSupplierModal, setIsPmCemsSupplierModal] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const { dispatch, pageTitle, entCode, DGIMN, time, regionCode } = props;

  useEffect(() => {
    GetLastTaskInfo();
    GetPollutantCheck();
    GetParamCheck();
    GetCombustionProcess();
  }, []);

  // 获取数据
  const GenericPostRequest = ({ urlName, payload = {}, callback }) => {
    // setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel[urlName],
      payload: payload,
      callback: res => {
        callback(res.Datas);
        // setLoading(false);
      },
    });
  };

  // 创建任务
  const AddTaskInfo = () => {
    GenericPostRequest({
      urlName: 'AddTaskInfo',
      callback: res => {
        message.success('创建成功！');
        GetLastTaskInfo();
      },
    });
  };

  // 获取最新任务
  const GetLastTaskInfo = () => {
    GenericPostRequest({
      urlName: 'GetLastTaskInfo',
      callback: res => {
        let _statusList = {};
        let stepDatas = res?.logInfo?.map(item => {
          _statusList[item.NodeID] = item;

          // 返填监测数据时间
          if (item.NodeID === '3') {
            item.BeginTime && setBeginTime(moment(item.BeginTime));
            item.EndTime && setEndTime(moment(item.EndTime));
          }
          // 返填模型训练时间
          if (item.NodeID === '7') {
            item.BeginTime && setTrainBeginTime(moment(item.BeginTime));
            item.EndTime && setTrainEndTime(moment(item.EndTime));
          }
          // 返填模型执行 - 扫描工况时间
          if (item.NodeID === '8') {
            if (item.BeginTime && item.EndTime)
              setWorkConDate([moment(item.BeginTime), moment(item.EndTime)]);
          }

          return {
            ...item,
            title: item.NodeName,
            status: item.Status === '完成' ? 'finish' : 'wait',
            description: (
              <>
                <p>{item.CreateUser}</p>
                <p>{item.CreateTime}</p>
              </>
            ),
          };
        });
        console.log('_statusList', _statusList);
        console.log('stepDatas', stepDatas);
        setStatusList(_statusList);
        setStepsList(stepDatas || []);
        setPointList(res?.pointList || []);
        setCheckedKeys(res?.pointList?.map(item => item.DGIMN));
        // 返填监测数据时间
        // let step3Data = stepDatas.find(item => item.NodeID === '3');
        // setBeginTime(step3Data && step3Data.BeginTime ? moment(step3Data.BeginTime) : undefined);
        // setEndTime(step3Data && step3Data.EndTime ? moment(step3Data.EndTime) : undefined);
      },
    });
  };

  // 关联点位
  const bindingPoint = keys => {
    GenericPostRequest({
      urlName: 'SaveStatePointModelRelationDGIMN',
      payload: {
        dgimnList: keys,
      },
      callback: res => {
        setIsSelectPointModalOpen(false);
        message.success('关联成功！');
        GetLastTaskInfo();
        GetPollutantCheck();
        GetParamCheck();
        GetCombustionProcess();
      },
    });
  };

  // 监测数据获取
  const GetTaskMonitorData = () => {
    if (!beginTime || !endTime) {
      message.error('开始结束时间不能为空！');
      return;
    }
    GenericPostRequest({
      urlName: 'GetTaskMonitorData',
      payload: {
        beginTime: moment(beginTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
      },
      callback: res => {
        message.success('操作成功！');
        GetLastTaskInfo();
      },
    });
  };

  // 获取污染物核查数据
  const GetPollutantCheck = () => {
    GenericPostRequest({
      urlName: 'GetPollutantCheck',
      callback: res => {
        setPollutantCheckDatas(res);
      },
    });
  };

  // 获取备案参数核查
  const GetParamCheck = () => {
    GenericPostRequest({
      urlName: 'GetParamCheck',
      callback: res => {
        setParamsCheck(res);
      },
    });
  };

  // 获取燃烧工艺
  const GetCombustionProcess = () => {
    GenericPostRequest({
      urlName: 'GetCombustionProcess',
      callback: res => {
        setCombustionProcess(res);
      },
    });
  };

  // 燃烧工艺 - 开始获取
  const CheckProcess = () => {
    GenericPostRequest({
      urlName: 'CheckProcess',
      callback: res => {
        message.success('操作成功！');
        GetLastTaskInfo();
      },
    });
  };

  // 模型训练
  const ModelTrain = () => {
    if (!trainBeginTime || !trainEndTime) {
      message.error('模型训练：开始结束时间不能为空！');
      return;
    }
    GenericPostRequest({
      urlName: 'ModelTrain',
      payload: {
        beginTime: moment(trainBeginTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(trainEndTime).format('YYYY-MM-DD HH:mm:ss'),
      },
      callback: res => {
        message.success('操作成功！');
        GetLastTaskInfo();
      },
    });
  };

  // 扫描工况
  const ScanningConditions = () => {
    let beginTime = workConDate[0];
    let endTime = workConDate[1];
    if (!beginTime || !endTime) {
      message.error('扫描工况：开始结束时间不能为空！');
      return;
    }
    GenericPostRequest({
      urlName: 'ScanningConditions',
      payload: {
        beginTime: moment(beginTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
      },
      callback: res => {
        message.success('操作成功！');
        GetLastTaskInfo();
      },
    });
  };

  // 计算排口距离
  const CalculateDistance = () => {
    GenericPostRequest({
      urlName: 'CalculateDistance',
      callback: res => {
        message.success('操作成功！');
      },
    });
  };

  // 自动匹配模型
  const AutoModelDelection = () => {
    GenericPostRequest({
      urlName: 'AutoModelDelection',
      callback: res => {
        message.success('操作成功！');
      },
    });
  };

  // 核查完成
  const onDone = data => {
    GenericPostRequest({
      urlName: 'CheckStatus',
      payload: {
        nodeID: data.NodeID,
        TaskID: data.TaskID,
      },
      callback: res => {
        message.success('操作成功！');
        GetLastTaskInfo();
      },
    });
  };

  // 获取状态
  const renderStatusTag = nodeID => {
    return statusList[nodeID]?.Status === '完成' ? (
      <Tag color="success" style={{ marginLeft: 10 }}>
        完成
      </Tag>
    ) : (
      <Tag color="error" style={{ marginLeft: 10 }}>
        未完成
      </Tag>
    );
  };

  // 核查完成按钮渲染
  const renderDoneBtn = nodeID => {
    if (statusList[nodeID]?.Status !== '完成') {
      return <Button onClick={() => onDone(statusList[nodeID])}>核查完成</Button>;
    }
    return '';
  };

  const getColumns = type => {
    switch (type) {
      case 1: //
        return [
          {
            title: '企业',
            dataIndex: 'ParentName',
            key: 'ParentName',
          },
          {
            title: '排放口',
            dataIndex: 'PointName',
            key: 'PointName',
            width: 200,
          },
          {
            title: '经度',
            dataIndex: 'Longitude',
            key: 'Longitude',
          },
          {
            title: '维度',
            dataIndex: 'Latitude',
            key: 'Latitude',
          },
          {
            title: '状态',
            dataIndex: 'Col8',
            key: 'Col8',
            render: text => {
              return text === '1' ? '启用' : '停用';
            },
          },
          {
            title: '运维状态',
            dataIndex: 'Col5',
            key: 'Col5',
            render: text => {
              if (text) {
                return text === '0' ? '进行中' : '已暂停';
              }
              return '-';
            },
          },
          {
            title: '操作',
            dataIndex: 'handle',
            key: 'handle',
            render: (text, record) => {
              return (
                <Space>
                  <a
                    onClick={e => {
                      window.open(
                        `/platformconfig/monitortarget/AEnterpriseTest/1/undefined/monitorpoint/${record.ParentCode}/${record.ParentName}?tabName=维护点信息`,
                        '_blank',
                      );
                    }}
                  >
                    配置
                  </a>
                  <a
                    onClick={() => {
                      setCurrentRow(record);
                      setIsPointModalOpen(true);
                    }}
                  >
                    数据
                  </a>
                </Space>
              );
            },
          },
        ];
      case 2: // 污染物核查
        return [
          {
            title: '企业',
            dataIndex: 'entName',
            key: 'entName',
          },
          {
            title: '排放口',
            dataIndex: 'pointName',
            key: 'pointName',
          },
          {
            title: '配置污染物',
            dataIndex: 'pzPollutant',
            key: 'pzPollutant',
            ellipsis: true,
            width: 280,
          },
          {
            title: '上传污染物',
            dataIndex: 'sjPollutant',
            key: 'sjPollutant',
            ellipsis: true,
            width: 280,
          },
          {
            title: '操作',
            dataIndex: 'handle',
            key: 'handle',
            width: 60,
            render: (text, row) => {
              return (
                <a
                  onClick={() => {
                    setCurrentRow(row);
                    setIsWrwModalOpen(true);
                  }}
                >
                  配置
                </a>
              );
            },
          },
        ];
      case 3: // 备案参数核查
        return [
          {
            title: '企业',
            dataIndex: 'entName',
            key: 'entName',
          },
          {
            title: '排放口',
            dataIndex: 'pointName',
            key: 'pointName',
          },
          {
            title: '烟道截面积(m³)',
            dataIndex: 'flueCoefficient',
            key: 'flueCoefficient',
            render: (text, row) => {
              let _text = text || '-';
              if (row.flueCoefficientStr) {
                return (
                  <Popover content={<Badge status="warning" text={row.flueCoefficientStr} />}>
                    <span style={{ color: '#ff4d4f' }}>{_text}</span>
                  </Popover>
                );
              }
              return _text;
            },
          },
          {
            title: '当地大气压(Kpa)',
            dataIndex: 'atmos',
            key: 'atmos',
            render: (text, row) => {
              let _text = text || '-';
              if (row.atmosStr) {
                return (
                  <Popover content={<Badge status="warning" text={row.atmosStr} />}>
                    <span style={{ color: '#ff4d4f' }}>{_text}</span>
                  </Popover>
                );
              }
              return _text;
            },
          },
          {
            title: '基准氧含量(%)',
            dataIndex: 'airCoefficient',
            key: 'airCoefficient',
            render: (text, row) => {
              let _text = text || '-';
              if (row.airCoefficientStr) {
                return (
                  <Popover content={<Badge status="warning" text={row.airCoefficientStr} />}>
                    <span style={{ color: '#ff4d4f' }}>{_text}</span>
                  </Popover>
                );
              }
              return _text;
            },
          },
          {
            title: '操作',
            dataIndex: 'handle',
            key: 'handle',
            render: (text, row) => {
              return (
                <a
                  onClick={() => {
                    setCurrentRow(row);
                    setIsParamsModalOpen(true);
                  }}
                >
                  配置
                </a>
              );
            },
          },
        ];
      case 4: // 燃烧工艺
        return [
          {
            title: '企业',
            dataIndex: 'entName',
            key: 'entName',
          },
          {
            title: '排放口',
            dataIndex: 'pointName',
            key: 'pointName',
          },
          {
            title: '燃烧工艺',
            dataIndex: 'pmCemsSupplierName',
            key: 'pmCemsSupplierName',
          },
          {
            title: '操作',
            dataIndex: 'handle',
            key: 'handle',
            render: (text, row) => {
              return (
                <a
                  onClick={() => {
                    setCurrentRow(row);
                    setIsPmCemsSupplierModal(true);
                  }}
                >
                  配置
                </a>
              );
            },
          },
        ];
    }
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.PageWrapper}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Popconfirm
            title="会覆盖所存在的任务，确认是否新增？"
            onConfirm={AddTaskInfo}
            placement="bottom"
          >
            <Button type="primary">新增训练任务</Button>
          </Popconfirm>
          <Card title="流程进度" loading={loading}>
            {stepsList.length ? (
              <Steps progressDot items={stepsList} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
          <Card
            title={
              <p>
                排口选取
                {renderStatusTag('2')}
              </p>
            }
            loading={loading['GetLastTaskInfo']}
            extra={renderDoneBtn('2')}
          >
            <SdlTable dataSource={pointList} columns={getColumns(1)} ellipsis pagination={false} />
            <Button
              type="primary"
              style={{ marginTop: 10 }}
              onClick={() => setIsSelectPointModalOpen(true)}
            >
              选取排口
            </Button>
            {isSelectPointModalOpen && (
              <SelectPointModal
                open={isSelectPointModalOpen}
                checkedKeys={checkedKeys}
                onCancel={() => setIsSelectPointModalOpen(false)}
                onOk={keys => {
                  console.log('keys', keys);
                  bindingPoint(keys);
                  setCheckedKeys(keys);
                }}
              />
            )}
            <Modal
              title={`${currentRow.ParentName} - ${currentRow.PointName}`}
              wrapClassName="spreadOverModal"
              destroyOnClose
              open={isPointModalOpen}
              footer={false}
              onCancel={() => setIsPointModalOpen(false)}
              bodyStyle={{ padding: 0 }}
            >
              <AssistDataAnalysis displayType="modal" DGIMN={currentRow.DGIMN} />
            </Modal>
          </Card>
          <Card
            title={
              <p>
                监测数据获取
                {renderStatusTag('3')}
              </p>
            }
            loading={loading}
            extra={renderDoneBtn('3')}
          >
            <Space direction="vertical" size="middle">
              <p>
                开始时间：
                <DatePicker
                  value={beginTime}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime
                  onChange={(date, dateString) => {
                    setBeginTime(date);
                  }}
                />
              </p>
              <p>
                结束时间：
                <DatePicker
                  value={endTime}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime
                  onChange={(date, dateString) => {
                    setEndTime(date);
                  }}
                />
              </p>
              <Button
                type="primary"
                onClick={() => {
                  GetTaskMonitorData();
                }}
              >
                开始获取
              </Button>
            </Space>
          </Card>
          <Card
            title={
              <p>
                污染物核查
                {renderStatusTag('4')}
              </p>
            }
            loading={loading}
            extra={renderDoneBtn('4')}
          >
            <SdlTable
              dataSource={pollutantCheckDatas}
              columns={getColumns(2)}
              pagination={false}
              scroll={false}
            />
            <Modal
              title={`${currentRow.entName} - ${currentRow.pointName} / 污染物配置`}
              open={isWrwModalOpen}
              wrapClassName="spreadOverModal"
              onCancel={() => {
                setIsWrwModalOpen(false);
              }}
              footer={false}
            >
              <MonitoringStandard noload DGIMN={currentRow.DGIMN} pollutantType={1} />
            </Modal>
          </Card>
          <Card
            title={
              <p>
                备案参数核查
                {renderStatusTag('5')}
              </p>
            }
            loading={loading}
            extra={renderDoneBtn('5')}
          >
            <SdlTable
              dataSource={paramsCheck}
              columns={getColumns(3)}
              pagination={false}
              scroll={false}
            />
            <Modal
              title={`${currentRow.entName} - ${currentRow.pointName} / 备案参数核查`}
              open={isParamsModalOpen}
              wrapClassName="spreadOverModal"
              onCancel={() => {
                setIsParamsModalOpen(false);
              }}
              footer={false}
            >
              <EquipmentParmars DGIMN={currentRow.DGIMN} type={'smoke'} />
            </Modal>
          </Card>
          <Card
            title={
              <p>
                燃烧工艺
                {renderStatusTag('6')}
              </p>
            }
            loading={loading}
            extra={renderDoneBtn('6')}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <SdlTable
                dataSource={combustionProcess}
                columns={getColumns(4)}
                pagination={false}
                scroll={false}
              />
              <Button
                type="primary"
                onClick={() => {
                  CheckProcess();
                }}
              >
                开始获取
              </Button>
            </Space>
            {isPmCemsSupplierModal && (
              <SelectPmCemsSupplierModal
                currentRow={currentRow}
                open={isPmCemsSupplierModal}
                onCancel={() => setIsPmCemsSupplierModal(false)}
                onOk={() => {
                  GetCombustionProcess();
                  setIsPmCemsSupplierModal(false);
                }}
              />
            )}
          </Card>
          {/* <Card
            title={
              <p>
                模型训练
                {renderStatusTag('7')}
              </p>
            }
            extra={renderDoneBtn('7')}
          >
            <Space direction="vertical" size="middle">
              <p>
                开始时间：
                <DatePicker
                  value={trainBeginTime}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime
                  onChange={(date, dateString) => {
                    setTrainBeginTime(date);
                  }}
                />
              </p>
              <p>
                结束时间：
                <DatePicker
                  value={trainEndTime}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime
                  onChange={(date, dateString) => {
                    setTrainEndTime(date);
                  }}
                />
              </p>
              <Button
                type="primary"
                onClick={() => {
                  ModelTrain();
                }}
              >
                开始训练
              </Button>
            </Space>
          </Card> */}
          <Card
            title={
              <p>
                模型执行
                {/* {renderStatusTag('8')} */}
              </p>
            }
            // extra={renderDoneBtn('8')}
          >
            <Space direction="vertical" size="middle">
              {/* <p>
                <Button
                  type="primary"
                  onClick={() => {
                    ScanningConditions();
                  }}
                >
                  扫描工况
                </Button>
                <RangePicker_
                  value={workConDate}
                  style={{ width: 380, marginLeft: 10 }}
                  showTime
                  onChange={(date, dateString) => {
                    setWorkConDate(date);
                  }}
                />
              </p>
              <p>
                <Button type="primary" onClick={() => CalculateDistance()}>
                  计算排口距离
                </Button>
              </p> */}
              <p>
                <Button type="primary" onClick={() => AutoModelDelection()}>
                  自动匹配模型
                </Button>
              </p>
              <p>
                <Button
                  type="primary"
                  onClick={() => {
                    router.push('/AbnormalIdentifyModel/ModelBaseManage/ModelExecutive');
                  }}
                >
                  模型执行
                </Button>
              </p>
            </Space>
          </Card>
        </Space>
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(PointTraining);
