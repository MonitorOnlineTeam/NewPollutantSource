/**
 * 功  能：缺台账工单统计
 * 创建人：张赟
 * 创建时间：2020.10.17
 */
import React, { Component } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Badge,
  Modal,
  Input,
  Button,
  Checkbox,
  Select,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup';
import Region from '../noAccountAirStatisticsDetails/noAccountAirStatisticsDetails';
import Photo from '../noAccountAirStatisticsPhoto/noAccountAirStatisticsPhoto';
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'noAccountAirStatistics/updateState',
  getData: 'noAccountAirStatistics/getDefectModel',
};
@connect(({ loading, noAccountAirStatistics, autoForm, common }) => ({
  priseList: noAccountAirStatistics.priseList,
  exloading: noAccountAirStatistics.exloading,
  loading: loading.effects[pageUrl.getData],
  total: noAccountAirStatistics.total,
  tableDatas: noAccountAirStatistics.tableDatas,

  noAccountAirStatisticsForm: noAccountAirStatistics.noAccountAirStatisticsForm,
}))
export default class airMissing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regionVisible: false,
      photoVisible: false,
      columns: [
        {
          title: <span>行政区</span>,
          dataIndex: 'Region',
          key: 'Region',
          align: 'center',
          render: (text, record) => {
            return (
              <a
                onClick={() => {
                  this.regionDetail(record);
                }}
              >
                {text}
              </a>
            );
          },
          // render: (text, record) => {
          //   return (

          //     <Link
          //       to={{
          //         pathname:
          //           '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsDetails',
          //         query: {
          //           Region: record.Region,
          //           requestData: JSON.stringify({
          //             RegionCode: record.RegionCode,
          //             BeginTime: this.props.noAccountAirStatisticsForm.BeginTime,
          //             EndTime: this.props.noAccountAirStatisticsForm.EndTime,
          //           }),
          //         },
          //       }}
          //     >
          //       {text}
          //     </Link>
          //   );
          // },
        },
        {
          title: <span>{'运维空气监测点'}</span>,
          dataIndex: 'entCount',
          key: 'entCount',

          align: 'center',
          children: [
            {
              title: <span>监测点数</span>,
              width: 100,
              dataIndex: 'PointNum',
              key: 'PointNum',
              align: 'center',
            },
            {
              title: <span>缺失台账监测点数</span>,
              width: 100,
              dataIndex: 'PointNotNum',
              key: 'PointNotNum',
              align: 'center',
            },
          ],
        },
        {
          title: <span>巡检工单</span>,
          dataIndex: 'pointCount',
          key: 'pointCount',
          align: 'center',
          children: [
            {
              title: <span>完成工单数</span>,
              width: 100,
              dataIndex: 'InspectionNum',
              key: 'InspectionNum',
              align: 'center',
            },
            {
              title: <span>缺失台账工单数</span>,
              width: 100,
              dataIndex: 'InspectionNotNum',
              key: 'InspectionNotNum',
              align: 'center',
              render: (text, record) => {
                return (
                  <a
                    onClick={() => {
                      record.TaskType='0',
                      this.photonDetail(record);
                    }}
                  >
                    {text}
                  </a>
                );
              },
              // render: (text, record) => {
              //   return (
              //     <Link
              //       to={{
              //         pathname:
              //           '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsPhoto',
              //         query: {
              //           Region: record.Region,
              //           requestData: JSON.stringify({
              //             RegionCode: record.RegionCode,
              //             BeginTime: this.props.noAccountAirStatisticsForm.BeginTime,
              //             EndTime: this.props.noAccountAirStatisticsForm.EndTime,
              //           }),
              //         },
              //       }}
              //     >
              //       {text}
              //     </Link>
              //   );
              // },
            },
          ],
        },
        {
          title: <span>质控工单</span>,
          dataIndex: 'pointCount',
          key: 'pointCount',
          align: 'center',
          children: [
            {
              title: <span>完成工单数</span>,
              width: 100,
              dataIndex: 'CalibrationNum',
              key: 'CalibrationNum',
              align: 'center',
            },
            {
              title: <span>缺失台账工单数</span>,
              width: 100,
              dataIndex: 'CalibrationNotNum',
              key: 'CalibrationNotNum',
              align: 'center',
              // render: (text, record) => {
              //   return (
              //     <Link
              //       to={{
              //         pathname:
              //           '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsPhoto',
              //         query: {
              //           Region: record.Region,
              //           requestData: JSON.stringify({
              //             RegionCode: record.RegionCode,
              //             BeginTime: this.props.noAccountAirStatisticsForm.BeginTime,
              //             EndTime: this.props.noAccountAirStatisticsForm.EndTime,
              //           }),
              //         },
              //       }}
              //     >
              //       {text}
              //     </Link>
              //   );
              // },
              render: (text, record) => {
                return (
                  <a
                    onClick={() => {
                      record.TaskType='1',
                      this.photonDetail(record);
                    }}
                  >
                    {text}
                  </a>
                );
              },
            },
          ],
        },
      ],
    };
  }
  photonDetail = record => {
    setTimeout(() => {
      this.setState({
        photoVisible: true,
        requestData: JSON.stringify({
          TaskType:record.TaskType,
          RegionCode: record.RegionCode,
          BeginTime: this.props.noAccountAirStatisticsForm.BeginTime,
          EndTime: this.props.noAccountAirStatisticsForm.EndTime,
        }),
      });
    });
  };
  regionDetail = record => {
   

    // setTimeout(() => {
    //   this.setState({
    //     regionVisible: true,
    //     requestData: JSON.stringify({
    //       RegionCode: record.RegionCode,
    //       BeginTime: this.props.noAccountAirStatisticsForm.BeginTime,
    //       EndTime: this.props.noAccountAirStatisticsForm.EndTime,
    //     }),
    //   });
    // });
    router.push({pathname:'/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/citylevel',query:{RegionCode:record.RegionCode}})

  };
  componentDidMount() {
    this.updateQueryState({ ModelType: 'All', RegionCode: undefined });

    setTimeout(() => {
      this.getTableData();
    });
  }

  updateQueryState = payload => {
    const { noAccountAirStatisticsForm, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { noAccountAirStatisticsForm: { ...noAccountAirStatisticsForm, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, noAccountAirStatisticsForm } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...noAccountAirStatisticsForm },
    });
  };

  //创建并获取模板   导出
  template = () => {
    const { dispatch, noAccountAirStatisticsForm } = this.props;
    dispatch({
      type: 'noAccountAirStatistics/exportDefectDataSummary',
      payload: { ...noAccountAirStatisticsForm },
      callback: data => {
        downloadFile(`/wwwroot${data}`);
      },
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();
  };

  onRef1 = ref => {
    this.child = ref;
  };

  dateChange = (date, dataType) => {
    this.updateQueryState({
      dataType: dataType,
      BeginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
      EndTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  render() {
    const {
      noAccountAirStatisticsForm: {
        BeginTime,
        EndTime,

        dataType,
      },
      exloading,
    } = this.props;
    const { regionVisible, photoVisible, workNumVisible, requestData } = this.state;
    return (
      <Card
        bordered={false}
        title={
          <Form layout="inline">
            {regionVisible ? (
              <Region
                requestData={requestData}
                regionVisible={regionVisible}
                regionCancel={() => {
                  this.setState({ regionVisible: false });
                }}
              />
            ) : null}
            {photoVisible ? (
              <Photo
                requestData={requestData}
                photoVisible={photoVisible}
                photoCancel={() => {
                  this.setState({ photoVisible: false });
                }}
              />
            ) : null}
            <Row>
              <Form.Item>
                日期查询：
                <RangePicker_
                  dataType={dataType}
                  allowClear={false}
                  style={{ minWidth: '200px', marginRight: '10px' }}
                  dateValue={[moment(BeginTime), moment(EndTime)]}
                  callback={(dates, dataType) => this.dateChange(dates, dataType)}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" onClick={this.queryClick}>
                  查询
                </Button>
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  onClick={this.template}
                  loading={exloading}
                >
                  导出
                </Button>
              </Form.Item>
            </Row>
          </Form>
        }
      >
        <SdlTable
          rowKey={(record, index) => `complete${index}`}
          loading={false}
          columns={this.state.columns}
          dataSource={this.props.tableDatas}
          // pagination={{
            // showSizeChanger: true,
            // showQuickJumper: true,
            // sorter: true,
            // total: this.props.total,
            //defaultPageSize: 20,
            // pageSize: PageSize,
            // current: PageIndex,
            // pageSizeOptions: ['10', '20', '30', '40', '50'],
          // }}
        />
      </Card>
    );
  }
}
