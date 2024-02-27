import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Descriptions,
  Row,
  Col,
  Tag,
  Upload,
  Button,
  Tooltip,
  Empty,
  message,
  Divider,
} from 'antd';
import { router } from 'umi';
import styles from '../styles.less';
import { RollbackOutlined } from '@ant-design/icons';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import ImageView from '@/components/ImageView';
import WarningDataModal from './WarningDataModal';
import moment from 'moment';
import { ChartDefaultSelected, getPollutantNameByCode, ModalNameConversion } from '../CONST';
import _ from 'lodash';
import ModelTable from './components/ModelTable';
import WarningDataAndChart from '@/pages/AbnormalIdentifyModel/AssistDataAnalysis/components/WarningDataAndChart.js';
import ModelChartMultiple from './components/ModelChart-multiple';
import ModelChartLinear from './components/ModelChart-Linear';
import ProgrammeCheck from '@/pages/AbnormalIdentifyModel/components/ProgrammeCheck.js';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  warningInfoLoading: loading.effects['AbnormalIdentifyModel/GetSingleWarning'],
  modelChartsLoading: loading.effects['AbnormalIdentifyModel/GetSnapshotData'],
});

const CluesDetails = props => {
  const warningId = props.match.params.id;
  const checkId = props.location.query.checkId;
  const COLOR = ['#5470c6', '#91cc75', '#ea7ccc'];
  const { dispatch, warningInfoLoading, modelChartsLoading, height } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [dataModalVisible, setDataModalVisible] = useState(false);
  const [warningDataDate, setWarningDataDate] = useState();
  const [warningDate, setWarningDate] = useState([]);
  const [searchDate, setSearchDate] = useState([]);
  const [rtnFinal, setRtnFinal] = useState([]);
  const [imageIndex, setImageIndex] = useState();
  const [warningInfo, setWarningInfo] = useState({});
  const [fileList, setFileList] = useState([]);
  const [rectFileList, setRectFileList] = useState([]);
  const [modelChartDatas, setModelChartDatas] = useState([]);
  const [linearDatas, setLinearDatas] = useState([]);
  const [modelTableDatas, setModelTableDatas] = useState([]);
  const [modelDescribe, setModelDescribe] = useState('');
  const [defaultChartSelected, setDefaultChartSelected] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [snapshotData, setSnapshotData] = useState({});
  const [images, setImages] = useState([]);
  const [chartData, setChartData] = useState();
  //   // 图表
  //   BeginTime: '',
  //   EndTime: '',
  //   PollutantCodeList: [],
  // });

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {
    // 获取报警详情及核实信息
    dispatch({
      type: 'AbnormalIdentifyModel/GetSingleWarning',
      payload: {
        modelWarningGuid: warningId,
      },
      callback: res => {
        if (res) {
          setWarningInfo(res);
          let _fileList = [],
            rectFileList = [];
          if (res.CheckedMaterial && res.CheckedMaterial.length) {
            _fileList = res.CheckedMaterial.map((item, index) => {
              return {
                uid: index,
                index: index,
                status: 'done',
                url: '/' + item,
              };
            });
          }
          if (res.RectificationMaterial && res.RectificationMaterial.length) {
            rectFileList = res.RectificationMaterial.map((item, index) => {
              return {
                uid: index,
                index: index,
                status: 'done',
                url: '/' + item,
              };
            });
          }

          setFileList(_fileList);
          setRectFileList(rectFileList);
          GetSnapshotData(res.WarningTypeCode);
        }
      },
    });
  };

  // 获取模型快照数据
  const GetSnapshotData = WarningTypeCode => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetSnapshotData',
      payload: {
        ID: warningId,
      },
      callback: res => {
        if (res.chartData) {
          // 线性图
          setModelChartDatas(res.chartData);
          handleLinearDatas(res.chartData, WarningTypeCode);
        }
        if (res.PollutantList && res.BeginTime && res.EndTime) {
          // 图表
          setChartData(res);
        }
        if (res.rtnFinal) {
          // 表格
          setRtnFinal(res.rtnFinal);
          let tableDatas = processJSONData(res.rtnFinal);
          setModelTableDatas(tableDatas);
        }
        setModelDescribe(res.describe);
        // setSnapshotData(res);
        // 处理恒定值报警时间线
        // if (res.timeListByCode) {
        //   let timeList = res.timeListByCode;
        //   let newTimeList = [];
        //   for (const key in timeList) {
        //     timeList[key].map(item => {
        //       newTimeList.push({
        //         pollutantCode: key,
        //         time: item.split('~'),
        //       });
        //     });
        //   }
        //   console.log('newTimeList', newTimeList);
        //   setTimeList(newTimeList);
        // }
      },
    });
  };

  // 处理线性系数数据
  const handleLinearDatas = (chartData, WarningTypeCode) => {
    let linearDatas = [];
    chartData.map(chart => {
      if (chart.linear) {
        let data = [];
        let names = [];
        if (chart.data.length > 1) {
          // let allData = [];
          let values = chart.data.map(item => {
            // allData = allData.concat(item.data);
            // allData = _.concat(allData, item.data);
            names.push(item.PointName || item.pollutantName);
            return item.data;
          });
          // console.log('allData', allData);
          data = values[0].map((item, index) => {
            let arr = [];
            chart.data.map(itm => {
              arr.push(itm.data[index]);
            });
            return arr;
          });
        }
        linearDatas.push({
          title: chart.title.replace('趋势', '线性'),
          linear: chart.linear,
          data: data,
          names: names,
          startPoint: chart.startPoint,
          endPoint: chart.endPoint,
        });
      }
    });

    setLinearDatas(linearDatas);
  };

  // 表格数据：相同Column数据合并
  const processJSONData = data => {
    // 创建一个空数组用于存储处理后的数据
    let mergedData = [];

    // 遍历原始数据对象数组
    data.forEach(function(obj) {
      // 检查当前数据对象的Column是否存在于mergedData中
      let existingData = mergedData.find(function(item) {
        return JSON.stringify(item.Column) === JSON.stringify(obj.Column);
      });

      // 如果存在相同的Column，则将Data合并到已存在的数据中
      if (existingData) {
        existingData.Data = existingData.Data.concat(obj.Data);
      } else {
        // 如果不存在相同的Column，则将整个数据对象添加到mergedData中
        mergedData.push(obj);
      }
    });

    return mergedData;
  };

  // 查看报警数据
  const onViewWarningData = () => {
    // 表格模型
    if (modelTableDatas.length) {
      let tableData = modelTableDatas[0];
      if (tableData.Data.length && tableData.Data[0]) {
        // 排序
        let sortTableData = tableData.Data.sort((a, b) => new Date(a.Time) - new Date(b.Time));
        let startDate = sortTableData[0].Time;
        let endData = tableData.Data.slice(-1)[0].Time;

        // 报警时间
        if (tableData.Data[1]) {
          setWarningDate([
            {
              // name: '异常开始时间',
              name: `开始\n`,
              date: moment(startDate).format('YYYY-MM-DD HH:mm'),
            },
            {
              // name: '异常结束时间',
              name: `结束\n`,
              date: moment(endData).format('YYYY-MM-DD HH:00'),
            },
          ]);
        } else {
          setWarningDate([
            {
              // name: '异常开始时间',
              name: `报警\n`,
              date: moment(startDate).format('YYYY-MM-DD HH:mm'),
            },
          ]);
        }

        let PollutantList = [];
        tableData.Column.map(item => {
          if (item.PollutantCode !== 'Flue' || item.PollutantCode !== 'Error') {
            PollutantList.push(item.PollutantCode);
          }
        });
        console.log('PollutantList', PollutantList);
        // 默认选中污染物
        setDefaultChartSelected(PollutantList.slice(0, 6));
        // 查询数据时间
        setSearchDate([moment(startDate).subtract(2, 'day'), moment(endData).add(2, 'day')]);

        setDataModalVisible(true);
      } else {
        message.error('异常特征无数据，无法查看线索数据！');
      }
    } else {
      console.log('onViewWarningData-chartData', chartData);
      if (chartData) {
        // 报警时间
        setWarningDate([
          {
            // name: '异常开始时间',
            name: `开始\n`,
            date: moment(chartData.BeginTime).format('YYYY-MM-DD HH:mm'),
          },
          {
            // name: '异常结束时间',
            name: `结束\n`,
            date: moment(chartData.EndTime).format('YYYY-MM-DD HH:00'),
          },
        ]);
        // 默认选中污染物
        setDefaultChartSelected(chartData.PollutantList.map(item => item.PollutantCode));
        // 查询数据时间
        setSearchDate([
          moment(chartData.BeginTime).subtract(2, 'day'),
          moment(chartData.EndTime).add(2, 'day'),
        ]);
        setDataModalVisible(true);
      } else {
        message.error('异常特征无数据，无法查看线索数据！');
      }
    }
  };

  const isShowBack = location.pathname.indexOf('autoLogin') <= -1;
  return (
    <BreadcrumbWrapper titles=" / 线索详情" hideBreadcrumb={props.hideBreadcrumb}>
      <div
        className={styles.PageWrapper}
        style={{ height: height ? height : isShowBack ? '100%' : 'calc(100vh - 22px)' }}
      >
        <Card
          title="线索详情"
          bodyStyle={{ paddingTop: 16 }}
          loading={warningInfoLoading}
          extra={
            isShowBack ? (
              <Button
                onClick={() =>
                  props.hideBreadcrumb && props.onCancel ? props.onCancel() : router.goBack()
                }
              >
                <RollbackOutlined />
                返回上级
              </Button>
            ) : (
              ''
            )
          }
        >
          <Descriptions column={4}>
            <Descriptions.Item label="企业">
              <Tooltip title={warningInfo.EntNmae}>
                <span className={styles.textOverflow}>{warningInfo.EntNmae}</span>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="排口">{warningInfo.PointName}</Descriptions.Item>
            <Descriptions.Item label="场景类别">
              <Tooltip title={warningInfo.WarningTypeName}>
                <span className={styles.textOverflow}>
                  {ModalNameConversion(warningInfo.WarningTypeName)}
                </span>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="发现线索时间">{warningInfo.WarningTime}</Descriptions.Item>
            <Descriptions.Item label="线索内容">{warningInfo.WarningContent}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card
          title="异常特征"
          style={{ margin: '10px 0' }}
          loading={modelChartsLoading}
          extra={
            <Button
              loading={modelChartsLoading || warningInfoLoading}
              type="primary"
              onClick={() => onViewWarningData()}
            >
              线索数据
            </Button>
          }
        >
          <Row className={styles.chartWrapper} style={{ height: 'auto' }}>
            <p style={{ marginBottom: 20 }}>{modelDescribe}</p>
            {/* 表格模型 */}
            {modelTableDatas.length
              ? modelTableDatas.map(item => {
                  return (
                    <ModelTable WarningTypeCode={warningInfo.WarningTypeCode} tableData={item} />
                  );
                })
              : ''}
            {/* 图表模型 */}
            {chartData && !modelChartDatas.length ? (
              <WarningDataAndChart
                chartStyle={{
                  height: 600,
                  marginTop: 10,
                }}
                DGIMN={warningInfo.Dgimn}
                // let date = [moment(startDate).subtract(2, 'day'), moment(startDate).add(6, 'day')];
                warningDate={[
                  {
                    // name: '异常开始时间',
                    name: `开始\n`,
                    date: moment(chartData.BeginTime).format('YYYY-MM-DD HH:mm'),
                  },
                  {
                    // name: '异常结束时间',
                    name: `结束\n`,
                    date: moment(chartData.EndTime).format('YYYY-MM-DD HH:00'),
                  },
                ]}
                date={[
                  moment(chartData.BeginTime).subtract(2, 'day'),
                  moment(chartData.EndTime).add(2, 'day'),
                ]}
                chartPollutantList={chartData.PollutantList}
                defaultChartSelected={chartData.PollutantList.map(item => item.PollutantCode).slice(
                  0,
                  6,
                )}
              />
            ) : (
              ''
            )}

            {/* 线性图表模型 */}
            {modelChartDatas.length
              ? linearDatas.map((item, index) => {
                  return (
                    <>
                      <Col span={12}>
                        <ModelChartLinear chartData={item} />
                      </Col>
                      <Col span={12}>
                        {/* 图例多选 */}
                        <ModelChartMultiple
                          chartData={modelChartDatas[index]}
                          WarningTypeCode={warningInfo.WarningTypeCode}
                        />
                      </Col>
                    </>
                  );
                })
              : ''}
          </Row>
        </Card>
        <ProgrammeCheck id={checkId} />

        {/* 查看附件弹窗 */}
        <ImageView
          isOpen={isOpen}
          images={images.map(item => item.url)}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            setIsOpen(false);
          }}
        />
        {/* 报警数据弹窗 */}
        {dataModalVisible && searchDate && (
          <WarningDataModal
            PointName={`${warningInfo.EntNmae} - ${warningInfo.PointName}`}
            DGIMN={warningInfo.Dgimn}
            CompareDGIMN={warningInfo.CompareDGIMN}
            ComparePointName={`${warningInfo.CompareEntNmae} - ${warningInfo.ComparePointName}`}
            visible={dataModalVisible}
            // date={warningDataDate}
            // warningDate={warningDate}
            // wrapClassName={isShowBack ? 'spreadOverModal' : 'fullScreenModal'}
            wrapClassName={'fullScreenModal'}
            describe={modelDescribe}
            // defaultChartSelected={defaultChartSelected}
            onCancel={() => {
              setDataModalVisible(false);
            }}
            warningDate={warningDate}
            date={searchDate}
            defaultChartSelected={defaultChartSelected.slice(0, 6)}
          />
        )}
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(CluesDetails);
