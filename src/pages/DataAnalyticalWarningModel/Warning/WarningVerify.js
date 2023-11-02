/*
 * @Author: JiaQi
 * @Date: 2023-05-30 15:07:19
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-10-25 20:11:49
 * @Description：报警核实详情
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Descriptions, Row, Col, Tag, Upload, Button, Tooltip, Empty, message } from 'antd';
import { router } from 'umi';
import styles from '../styles.less';
import { RollbackOutlined } from '@ant-design/icons';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import ImageView from '@/components/ImageView';
import ModelChart from './components/ModelChart';
import ModelChartMultiple from './components/ModelChart-multiple';
import ModelChartLinear from './components/ModelChart-Linear';
import ModelTable from './components/ModelTable';
import WarningDataModal from './WarningDataModal';
import moment from 'moment';
import { ChartDefaultSelected, getPollutantNameByCode, ModalNameConversion } from '../CONST';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  warningInfoLoading: loading.effects['dataModel/GetSingleWarning'],
  modelChartsLoading: loading.effects['dataModel/GetSnapshotData'],
});

const WarningVerify = props => {
  const warningId = props.match.params.id;
  const COLOR = [
    '#5470c6',
    '#91cc75',
    '#ea7ccc',
  ];
  const { dispatch, warningInfoLoading, modelChartsLoading,height } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [dataModalVisible, setDataModalVisible] = useState(false);
  const [warningDataDate, setWarningDataDate] = useState();
  const [warningDate, setWarningDate] = useState([]);
  const [rtnFinal, setRtnFinal] = useState([]);
  const [imageIndex, setImageIndex] = useState();
  const [warningInfo, setWarningInfo] = useState({});
  const [fileList, setFileList] = useState([]);
  const [modelChartDatas, setModelChartDatas] = useState([]);
  const [linearDatas, setLinearDatas] = useState([]);
  const [modelTableDatas, setModelTableDatas] = useState([]);
  const [modelDescribe, setModelDescribe] = useState('');
  const [defaultChartSelected, setDefaultChartSelected] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [snapshotData, setSnapshotData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {
    // 获取报警详情及核实信息
    dispatch({
      type: 'dataModel/GetSingleWarning',
      payload: {
        modelWarningGuid: warningId,
      },
      callback: res => {
        setWarningInfo(res);
        let _fileList = [];
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
        setFileList(_fileList);
        GetSnapshotData(res.WarningTypeCode);
      },
    });
  };

  // 获取模型快照数据
  const GetSnapshotData = WarningTypeCode => {
    dispatch({
      type: 'dataModel/GetSnapshotData',
      payload: {
        ID: warningId,
      },
      callback: res => {
        if (res.chartData) {
          setModelChartDatas(res.chartData);
          handleLinearDatas(res.chartData, WarningTypeCode);
        } else {
          setRtnFinal(res.rtnFinal);
          let tableDatas = processJSONData(res.rtnFinal);
          setModelTableDatas(tableDatas);
          // setModelTableDatas({
          //   Column: res.Column,
          //   Data: res.Data,
          // });
        }
        setModelDescribe(res.describe);
        setSnapshotData(res);
        // 处理恒定值报警时间线
        if (res.timeListByCode) {
          let timeList = res.timeListByCode;
          let newTimeList = [];
          for (const key in timeList) {
            timeList[key].map(item => {
              newTimeList.push({
                pollutantCode: key,
                time: item.split('~'),
              });
            });
          }
          console.log('newTimeList', newTimeList);
          setTimeList(newTimeList);
        }
      },
    });
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
      // else if (WarningTypeCode === 'd5dea4cc-bd6c-44fa-a122-a1f44514b465') {
      //   debugger;
      //   chart.data.map(item => {
      //     let data = [];
      //     item.data.map((itm, index) => {
      //       data.push([itm, item.dataHistory[index]]);
      //     });
      //     linearDatas.push({
      //       title: item.pollutantName + '数据与历史线性一致或重合',
      //       linear: item.linear,
      //       data: data,
      //       names: [item.pollutantName, item.pollutantName + '历史'],
      //     });
      //   });
      // }
    });

    setLinearDatas(linearDatas);
  };

  // 判断小时是否连续
  function isTimeContinuous(data) {
    // 将数据按照Time字段进行升序排序
    // data.sort((a, b) => new Date(a.Time) - new Date(b.Time));

    if (data.length !== 24) {
      return false;
    }
    // 遍历数据，判断每个Time是否连续
    for (let i = 1; i < data.length; i++) {
      const currentTime = new Date(data[i].Time);
      const previousTime = new Date(data[i - 1].Time);

      // 如果当前Time与前一个Time的差值不是1小时，则说明不连续
      if (Math.abs(currentTime - previousTime) !== 3600000) {
        return false;
      }
    }
    return true;

    // 所有Time都连续
  }

  // 查看报警数据
  const onViewWarningData = () => {
    // 表格模型
    if (modelTableDatas.length) {
      let tableData = modelTableDatas[0];
      if (tableData.Data.length && tableData.Data[0]) {
        // 排序
        let sortTableData = tableData.Data.sort((a, b) => new Date(a.Time) - new Date(b.Time));
        let startDate = sortTableData[0].Time;
        let date = [moment(startDate).subtract(2, 'day'), moment(startDate).add(6, 'day')];
        setWarningDataDate(date);

        let warningDate = [];
        if (
          // 零值
          warningInfo.WarningTypeCode === '0fa091a3-7a19-4c9e-91bd-c5a4bf2e9827'
        ) {
          // 多个表格的情况
          modelTableDatas.map(item => {
            item.Data.map(itm => {
              warningDate.push({
                name: '0', //零值报警显示0
                date: itm.Time,
              });
            });
          });
        } else {
          // 一个表格的情况
          // console.log('endData', endData);
          if (isTimeContinuous(sortTableData)) {
            let endData = tableData.Data.slice(-1)[0].Time;
            console.log('startDate', startDate);
            console.log('endData', endData);
            warningDate = [
              {
                name: '开始',
                date: moment(startDate).format('YYYY-MM-DD HH:mm'),
              },
              {
                name: '结束',
                date: endData,
              },
            ];
          } else {
            modelTableDatas.map(item => {
              item.Data.map(itm => {
                warningDate.push({
                  name: '报警', //零值报警显示0
                  date: itm.Time,
                });
              });
            });
          }

          // warningDate = [
          //   {
          //     name: endData ? '开始' : '报警',
          //     date: moment(startDate).format('YYYY-MM-DD HH:mm'),
          //   },
          // ];
          // if (endData) {
          //   warningDate.push({
          //     name: '结束',
          //     date: endData[0],
          //   });
          // }
        }

        console.log('warningDate', warningDate);
        setWarningDate(warningDate);
        handleDefaultLegendSelected();
        setDataModalVisible(true);
      } else {
        message.error('异常特征无数据，无法查看线索数据！');
      }
    } else {
      // 图表模型
      let warningDate = [];
      console.log('modelChartDatas', modelChartDatas);
      if (
        modelChartDatas.length &&
        modelChartDatas[0].data.length &&
        modelChartDatas[0].data[0].date.length
        // true
      ) {
        let startDate = modelChartDatas[0].data[0].date[0];
        let date = [moment(startDate).subtract(2, 'day'), moment(startDate).add(6, 'day')];

        // 如果接口直接返回数据时间，直接取
        if (snapshotData.BeginTime && snapshotData.EndTime) {
          date = [
            moment(snapshotData.BeginTime).subtract(2, 'day'),
            moment(snapshotData.EndTime).add(6, 'day'),
          ];
        }
        setWarningDataDate(date);

        if (
          // 疑似机组停运未及时上报
          warningInfo.WarningTypeCode === '928ec327-d30d-4803-ae83-eab3a93538c1' ||
          // 疑似机组停运虚假标记
          warningInfo.WarningTypeCode === '3568b3c6-d8db-42f1-bbff-e76406a67f7f'
        ) {
          // 每3个为一组
          modelChartDatas.map((item, index) => {
            if (index % 3 === 0) {
              if (item.data[0].date.length === 1) {
                // 只有一个时间点显示报警(没有结束时间)
                warningDate.push({
                  name: '报警',
                  date: moment(item.data[0].date[0]).format('YYYY-MM-DD HH:00'),
                });
              } else {
                let endData = item.data[0].date.slice(-1);
                warningDate.push(
                  {
                    name: '开始',
                    date: moment(item.data[0].date[0]).format('YYYY-MM-DD HH:00'),
                  },
                  {
                    name: '结束',
                    date: moment(endData[0]).format('YYYY-MM-DD HH:00'),
                  },
                );
              }
            }
          });
        } else if (timeList.length) {
          // 恒定值
          timeList.map(item => {
            warningDate = warningDate.concat([
              {
                name: '开始',
                pollutantName: getPollutantNameByCode[item.pollutantCode],
                date: moment(item.time[0]).format('YYYY-MM-DD HH:00'),
              },
              {
                name: '结束',
                pollutantName: getPollutantNameByCode[item.pollutantCode],
                date: moment(item.time[1]).format('YYYY-MM-DD HH:00'),
              },
            ]);
          });
        } else {
          // 其他
          let endData = modelChartDatas[0].data[0].date.slice(-1);
          warningDate = [
            {
              // name: '异常开始时间',
              name: '开始',
              date: moment(startDate).format('YYYY-MM-DD HH:mm'),
            },
            {
              // name: '异常结束时间',
              name: '结束',
              date: moment(endData[0]).format('YYYY-MM-DD HH:mm'),
            },
          ];
        }

        console.log('warningDate', warningDate);
        setWarningDate(warningDate);
        handleDefaultLegendSelected();
        setDataModalVisible(true);
      } else {
        message.error('异常特征无数据，无法查看线索数据！');
      }
    }
  };

  // 处理图表污染物默认选中
  const handleDefaultLegendSelected = () => {
    let defaultSelected = [];

    if (
      // 疑似超过标准标记数据无效
      warningInfo.WarningTypeCode === '6675e28e-271a-4fb7-955b-79bf0b858e8e' ||
      // 疑似恒定值微小波动
      warningInfo.WarningTypeCode === 'cda1f2e2-ec5f-425b-93d2-94ba62b17146'
    ) {
      // 默认选中异常特征图表中的污染物
      if (modelChartDatas.length && modelChartDatas[0].data.length) {
        defaultSelected = modelChartDatas[0].data.map(item => {
          return item.pollutantName;
        });
      }
    } else if (warningInfo.WarningTypeCode === '0fa091a3-7a19-4c9e-91bd-c5a4bf2e9827') {
      let firstTableData = modelTableDatas[0];
      // 疑似零值微小波动
      if (firstTableData.Data && firstTableData.Data.length) {
        let _defaultSelected = [];
        firstTableData.Column.map(item => {
          // 去掉括号及内容，将“烟气排放量”替换为“流量”
          let name = item.PollutantName.replace(/\((?:.*)\)/g, '').replace('烟气排放量', '流量');
          if (name.indexOf('波动范围') === -1) {
            _defaultSelected.push(name);
          }
        });
        // 最多取前两个
        defaultSelected = _defaultSelected.slice(0, 6);
      }
    } else {
      // 默认选中氧含量、烟气湿度、烟气温度、流速
      // 固定污染物：根据WarningTypeCode获取,
      defaultSelected = (ChartDefaultSelected[warningInfo.WarningTypeCode] || []).concat([
        '氧含量',
        '烟气湿度',
        '烟气温度',
        '流速',
      ]);
    }
    console.log('defaultSelected', defaultSelected);
    setDefaultChartSelected(defaultSelected);
  };
  const isShowBack = location.pathname.indexOf('autoLogin') <= -1;
  return (
    <BreadcrumbWrapper titles=" / 线索核实" hideBreadcrumb={props.hideBreadcrumb}>
      <div
        className={styles.WarningVerifyWrapper}
        style={{ height: height? height : isShowBack ? '100%'  : 'calc(100vh - 22px)' }}
      >
        <Card
          title="线索详情"
          bodyStyle={{ paddingTop: 16 }}
          loading={warningInfoLoading}
          extra={
            isShowBack ? (
              <Button onClick={() =>props.hideBreadcrumb&&props.onCancel? props.onCancel() : router.goBack()}>
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
                <span className={styles.textOverflow}>{ModalNameConversion(warningInfo.WarningTypeName)}</span>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="发现线索时间">{warningInfo.WarningTime}</Descriptions.Item>
            <Descriptions.Item label="线索内容">{warningInfo.WarningContent}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card
          title="异常特征"
          loading={modelChartsLoading || warningInfoLoading}
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
          {modelDescribe ? (
            <>
              <p>{modelDescribe}</p>

              {/* 图表模型 */}
              {modelChartDatas.length ? (
                <Row className={styles.chartWrapper}>
                  {// 线性系数图表
                  linearDatas.map((item, index) => {
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
                  })}

                  {// 使用其它排放口烟气代替本排放口烟气进行监测
                  warningInfo.WarningTypeCode === 'c0af25fb-220b-45c6-a3de-f6c8142de8f1' ||
                  // 同一现场借用其他合格监测设备数据
                  warningInfo.WarningTypeCode === 'ab2bf5ec-3ade-43fc-a720-c8fd92ede402' ||
                  // 引用错误、虚假的原始信号值
                  warningInfo.WarningTypeCode === 'f021147d-e7c6-4c1d-9634-1d814ff9880a'
                    ? !linearDatas.length &&
                      modelChartDatas.map((item, index) => {
                        return (
                          <Col span={12}>
                            {/* 图例多选 */}
                            <ModelChartMultiple
                              chartData={item}
                              WarningTypeCode={warningInfo.WarningTypeCode}
                            />
                          </Col>
                        );
                      })
                    : modelChartDatas.map((item, index) => {
                        return (
                          <Col span={modelChartDatas.length <= 3 ? 24 / modelChartDatas.length : 8}>
                            {/* 图例单选，显示一条线 */}
                            <ModelChart
                              chartData={item}
                              color={COLOR[index % 3]}
                              WarningTypeCode={warningInfo.WarningTypeCode}
                            />
                          </Col>
                        );
                      })}
                </Row>
              ) : (
                ''
              )}
              {/* 表格模型 */}
              {modelTableDatas.length ? (
                <Row className={styles.chartWrapper} style={{ height: 'auto' }}>
                  {modelTableDatas.map(item => {
                    return (
                      <ModelTable WarningTypeCode={warningInfo.WarningTypeCode} tableData={item} />
                    );
                  })}
                </Row>
              ) : (
                ''
              )}
            </>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Card>
        <Card title="线索核实" loading={warningInfoLoading}>
          <Descriptions column={4}>
            <Descriptions.Item label="核实状态">
              <Tag
                color={
                  warningInfo.Status === 3
                    ? 'success'
                    : warningInfo.Status === 2
                    ? 'orange'
                    : 'volcano'
                }
              >
                {warningInfo.StatusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="核实结果">
              {warningInfo.CheckedResultCode === '1' && <Tag color="error">系统误报</Tag>}
              {warningInfo.CheckedResultCode === '2' && <Tag color="warning">有异常</Tag>}
              {warningInfo.CheckedResultCode === '3' && <Tag>未核实</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="异常原因">
              {warningInfo.UntruthReason || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="核实人">{warningInfo.CheckedUser || '-'}</Descriptions.Item>
            <Descriptions.Item span={1} label="核实时间">
              {warningInfo.CheckedTime || '-'}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="暂停报警截止时间">
              {warningInfo.StopAlarmEndTime || '-'}
            </Descriptions.Item>
            <Descriptions.Item span={4} label="核实描述">
              {warningInfo.CheckedDes || '-'}
            </Descriptions.Item>
            <Descriptions.Item span={4} label="核实材料">
              {fileList.length ? (
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
                  onPreview={file => {
                    setIsOpen(true);
                    setImageIndex(file.index);
                  }}
                />
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        {/* 查看附件弹窗 */}
        <ImageView
          isOpen={isOpen}
          images={fileList.map(item => item.url)}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            setIsOpen(false);
          }}
        />
        {/* 报警数据弹窗 */}
        {dataModalVisible && warningDataDate && (
          <WarningDataModal
            PointName={`${warningInfo.EntNmae} - ${warningInfo.PointName}`}
            DGIMN={warningInfo.Dgimn}
            CompareDGIMN={warningInfo.CompareDGIMN}
            ComparePointName={`${warningInfo.CompareEntNmae} - ${warningInfo.ComparePointName}`}
            visible={dataModalVisible}
            date={warningDataDate}
            warningDate={warningDate}
            wrapClassName={isShowBack ? 'spreadOverModal' : 'fullScreenModal'}
            describe={modelDescribe}
            defaultChartSelected={defaultChartSelected}
            onCancel={() => {
              setDataModalVisible(false);
            }}
          />
        )}
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(WarningVerify);
