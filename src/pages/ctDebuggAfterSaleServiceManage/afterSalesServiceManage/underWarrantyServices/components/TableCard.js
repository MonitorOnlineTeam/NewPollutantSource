import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Descriptions, Space, Tooltip, Modal, Row, Col, Select, Radio, } from 'antd';
import styles from '../index.less';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { DetailIcon } from '@/utils/icon';

const dvaPropsData = ({ loading, reportsAndViews, common }) => ({
  underWarrantyServicesData: reportsAndViews.underWarrantyServicesData,
  // TimeoutServiceReason: timeoutServices.TimeoutServiceReason, // 超时服务原因
  loading: loading.effects['reportsAndViews/GetWarrantyServiceAnalysis'],
  basicsLoading: loading.effects[`reportsAndViews/GetWarrantyServiceInfo`],
  exportLoading: loading.effects['reportsAndViews/ExportWarrantyServiceAnalysis'],
  basicsExportLoading: loading.effects['reportsAndViews/ExportWarrantyServiceInfo'],
  largeRegionList: common.CtLargeRegionList,
});

const TableCard = props => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [basicsDataSource, setBasicsDataSource] = useState([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [allDetailsDataList, setAllDetailsDataList] = useState([]);
  const [sort, setSort] = useState(0);

  const [detailsData, setDetailsData] = useState({
    CategoryTableList: [],
    ReasonTableList: [],
  });

  const {
    dispatch,
    loading,
    exportLoading,
    basicsLoading,
    basicsExportLoading,
    underWarrantyServicesData: { ColumnList, TableList, WarrantyAnalysis },
    type,
    date,
    modalWrapClassName,
    largeRegionList,
  } = props;

  useEffect(() => {
    dispatch({
      type: 'common/getCTLargeRegion',
      payload: {},
    });
  }, []);

  // 获取基础数据
  const getBasicsData = (_pageIndex, _pageSize, _sort) => {
    const values = form.getFieldsValue();
    let time = values.time;
    dispatch({
      type: 'reportsAndViews/GetWarrantyServiceInfo',
      payload: {
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
        btime: time[0] && time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        eTime: time[1] && time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        // sort: _sort || sort,
        ...values,
        time: undefined,
      },
      callback: res => {
        setAllDetailsDataList(res.Datas.ChildList);
        setBasicsDataSource(res.Datas.MainList);
        setTableTotal(res.Total);
      },
    });
  };

  // 导出
  const onExport = () => {
    const values = form.getFieldsValue();
    let time = values.time || [moment(date).startOf('year'), moment()];
    dispatch({
      type: 'reportsAndViews/ExportWarrantyServiceAnalysis',
      payload: {
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
        btime: time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        eTime: time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        type: type,
      },
    });
  };

  // 导出基础服务
  const onBasicsExport = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'reportsAndViews/ExportWarrantyServiceInfo',
      payload: {
        pageIndex: 0,
        pageSize: 0,
        btime: values.time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        eTime: values.time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        ...values,
        time: undefined,
      },
    });
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };
  const typeClick = (record) => {
    setIsModalOpen(true);
    form.setFieldsValue({
      pType:type,
      serviceAreaCode: record.serviceAreaCode,
      time:record.btime && record.etime ?  [moment(record.btime), moment(record.etime)] :  [moment(date).startOf('year'), moment(date).endOf('year')],
      questionID: record.QuestionID,
    });
    setTimeout(() => {
      handleTableChange(1, 20);
    },200)
  }
  const TypeRenderComponents = ({ record }) => {
    return <a onClick={() => typeClick(record)}>{record?.text || record?.text == 0 ? record.text : ''}</a>
  }
  //
  const getColumns = () => {
    let columnList = ColumnList.map(item => {
      return {
        title: item.LargeRegion,
        children: [
          {
            title: '次数',
            dataIndex: `Num${item.ID}`,
            key: `Num${item.ID}`,
            width: 60,
            align: 'center',
            render: (text, record) => {
              return <TypeRenderComponents record={{ text: text, serviceAreaCode: item.ID, ...record }} />
            }
          },
          {
            title: '次数占比',
            dataIndex: `NumRate${item.ID}`,
            key: `NumRate${item.ID}`,
            width: 90,
            align: 'center',
          },
          {
            title: '时长',
            dataIndex: `Times${item.ID}`,
            key: `Times${item.ID}`,
            width: 60,
            align: 'center',
            render: (text, record) => {
              return <TypeRenderComponents record={{ text: text, serviceAreaCode: item.ID, ...record }} />
            }
          },
          {
            title: '时长占比',
            dataIndex: `TimeRate${item.ID}`,
            key: `TimeRate${item.ID}`,
            width: 90,
            align: 'center',
          },
        ],
      };
    });
    return [
      {
        title: '年度',
        dataIndex: 'year',
        key: 'year',
        width: 80,
        fixed: 'left',
        className: styles.bg_white,
        render: (text, record, index) => {
          return {
            children: text,
            props: { rowSpan: record.count > 0 ? record.count + 1 : record.count },
          };
        },
      },
      {
        title: '序号',
        dataIndex: 'sort',
        key: 'sort',
        fixed: 'left',
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: text === '总计' ? 2 : 1 },
          };
        },
      },
      {
        title: type === 1 ? '服务产品类别' : '服务原因',
        dataIndex: 'ReasonName',
        key: 'ReasonName',
        width: 200,
        fixed: 'left',
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: text === '总计' ? 0 : 1 },
          };
        },
      },
      {
        title: '总计',
        children: [
          {
            title: '次数',
            dataIndex: 'SumNum',
            key: 'SumNum',
            width: 60,
            align: 'center',
            fixed: 'left',
            render: (text, record) => {
              return <TypeRenderComponents record={{ text: text, ...record }} />
            }
          },
          {
            title: '次数占比',
            dataIndex: 'SumNumRate',
            key: 'SumNumRate',
            width: 90,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '时长',
            dataIndex: 'SumTimes',
            key: 'SumTimes',
            width: 60,
            align: 'center',
            fixed: 'left',
            render: (text, record) => {
              return <TypeRenderComponents record={{ text: text, ...record }} />
            }
          },
          {
            title: '时长占比',
            dataIndex: 'SumTimeRate',
            key: 'SumTimeRate',
            width: 90,
            align: 'center',
            fixed: 'left',
          },
        ],
      },
      ...columnList,
    ];
  };

  // 基础数据表头
  const getBasicsColumns = () => {
    const commomCol1 = [
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '派工单号',
        dataIndex: 'Num',
        key: 'Num',
        ellipsis: true,
      },
      {
        title: '项目编号',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
        ellipsis: true,
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        ellipsis: true,
        width: 280,
      },
      {
        title: '最终用户',
        dataIndex: 'CustomEnt',
        key: 'CustomEnt',
        ellipsis: true,
        width: 180,
      },
      {
        title: '服务大区',
        dataIndex: 'ServiceAreaName',
        key: 'ServiceAreaName',
        ellipsis: true,
        width: 150,
      },
      {
        title: '开始时间',
        dataIndex: 'BeginTime',
        key: 'BeginTime',
        ellipsis: true,
        width: 180,
        align: 'center',
      },
      {
        title: '结束时间',
        dataIndex: 'EndTime',
        key: 'EndTime',
        ellipsis: true,
        width: 180,
        align: 'center',
      },
      {
        title: '企业名称',
        dataIndex: 'EntName',
        key: 'EntName',
        ellipsis: true,
        align: 'center',
        width: 180,
      },
      {
        title: '监测点名称',
        dataIndex: 'PointName',
        key: 'PointName',
        ellipsis: true,
        align: 'center',
        width: 180,
      },
    ];
    const commomCol2 = [
      {
        title: '离开现场时间',
        dataIndex: 'LeaveDate',
        key: 'LeaveDate',
        ellipsis: true,
      },
      {
        title: '填报人',
        dataIndex: 'CreateUserName',
        key: 'CreateUserName',
        ellipsis: true,
      },
      {
        title: '填报时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        ellipsis: true,
      },
      // {
      //   title: '操作',
      //   dataIndex: 'handle',
      //   key: 'handle',
      //   fixed: 'right',
      //   render: (text, record) => {
      //     return (
      //       <Tooltip title="详情">
      //         <a
      //           onClick={() => {
      //             setIsDetailsModalOpen(true);
      //             let currentDetailsData = allDetailsDataList.find(item => item.Num === record.Num);
      //             handleDetailsData(currentDetailsData, record);
      //           }}
      //         >
      //           <DetailIcon />
      //         </a>
      //       </Tooltip>
      //     );
      //   },
      // },
    ]
    let columns = []
    if (type == 1) {
      columns = [
        ...commomCol1,
        {
          title: '设备型号',
          dataIndex: 'QuestionName',
          key: 'QuestionName',
          ellipsis: true,
          width: 150,
          align: 'center',
        },
        {
          title: '服务时长（小时）',
          dataIndex: 'ServiceTime',
          key: 'ServiceTime',
          ellipsis: true,
          width: 150,
          align: 'center',
        },
        {
          title: '是否解决',
          dataIndex: 'SolveStatusName',
          key: 'SolveStatusName',
          ellipsis: true,
          width: 150,
          align: 'center',
        },
        {
          title: '未解决原因',
          dataIndex: 'Remark',
          key: 'Remark',
          ellipsis: true,
          width: 150,
          align: 'center',
        },
        ...commomCol2,
      ]
    } else {
      columns = [
        ...commomCol1,
        {
          title: '服务原因',
          dataIndex: 'QuestionName',
          key: 'QuestionName',
          ellipsis: true,
          width: 150,
          align: 'center',
        },
        {
          title: '服务时长（小时）',
          dataIndex: 'ServiceTime',
          key: 'ServiceTime',
          ellipsis: true,
          width: 150,
          align: 'center',
        },
        ...commomCol2,
      ]
    }
    return columns;
  };

  function aggregateAndSortByLevelWithCount(data) {
    // 用来存储各个Level对应的ChildList集合
    const levelMap = {};

    // 遍历原始数据
    data.forEach(item => {
      // 检查这个Level是否已经在map里，如果不在就初始化为空数组
      if (!levelMap[item.Level]) {
        levelMap[item.Level] = [];
      }
      // 把当前Level的ChildList并到相应的数组里
      levelMap[item.Level].push(...item.ChildList);
    });
    // 转换map成数组，并按Level排序, 同时处理ChildList中的count字段
    const sortedLevels = Object.keys(levelMap)
      .sort((a, b) => a - b)
      .map(level => {
        const childListWithCount = levelMap[level].map((child, index) => {
          // 对每个ChildList初始化count字段，如果是第一个元素则为ChildList的长度，否则为0
          return { ...child, count: index === 0 ? levelMap[level].length : 0 };
        });

        return {
          Level: parseInt(level),
          ChildList: childListWithCount,
        };
      });

    return sortedLevels;
  }

  // 处理详情数据
  const handleDetailsData = (data, rowData) => {
    let CategoryTableList = [];
    aggregateAndSortByLevelWithCount(data.CategoryChildList).map(item => {
      CategoryTableList = CategoryTableList.concat(item.ChildList);
    });
    let ReasonTableList = [];
    aggregateAndSortByLevelWithCount(data.ReasonChildList).map(item => {
      ReasonTableList = ReasonTableList.concat(item.ChildList);
    });

    // // 服务原因表格数据
    // data.ReasonChildList.sort((a, b) => a.Level - b.Level).map(item => {
    //   item.ChildList.map((child, index) => {
    //     ReasonTableList.push({
    //       ...child,
    //       count: index == 0 ? item.ChildList.length : 0,
    //     });
    //   });
    // });
    // // 产品类别表格数据
    // data.CategoryChildList.sort((a, b) => a.Level - b.Level).map(item => {
    //   item.ChildList.map((child, index) => {
    //     CategoryTableList.push({
    //       ...child,
    //       count: index == 0 ? item.ChildList.length : 0,
    //     });
    //   });
    // });
    setDetailsData({
      CategoryTableList,
      ReasonTableList,
      ...rowData,
    });
  };

  //分页
  const handleTableChange = (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getBasicsData(PageIndex, PageSize);
  };

  // 排序、分页
  const onTableChange = (pagination, filters, sorter) => {
    const { pageSize, current } = pagination;
    setPageSize(pageSize);
    setPageIndex(current);
    let order = sorter.order === 'ascend' ? 1 : sorter.order === 'descend' ? 2 : 0;
    setSort(order);
    getBasicsData(current, pageSize, order + '');
  };

  const TitleComponents = props => {
    // position:'sticky',top: 0,zIndex:998,background: '#fff',
    return (
      <div
        style={{
          display: 'inline-block',
          fontWeight: 'bold',
          marginTop: 4,
          padding: '2px 0',
          marginBottom: 12,
          borderBottom: '1px solid rgba(0,0,0,.1)',
        }}
      >
        {props.text}
      </div>
    );
  };

  // 将数字转换成文字   n -> 第n次
  const translateNumberToChineseOrdinal = n => {
    const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千', '万'];
    let str = n
      .toString()
      .split('')
      .reverse()
      .join('');

    let result = '';

    for (let i = 0; i < str.length; i++) {
      result = chineseNumbers[str[i]] + (str[i] === '0' ? '' : units[i]) + result;
    }

    return '第' + result.replace(/零+/g, '零') + '次';
  };

  // 获取产品类别表格列
  const getProductColumns = () => {
    return [
      {
        title: <b>按产品类别</b>,
        align: 'center',
        ellipsis: true,
        children: [
          {
            title: '序号',
            align: 'center',
            ellipsis: true,
            width: 40,
            render: (text, record, index) => {
              return index + 1;
            },
          },
          {
            title: '次数',
            dataIndex: 'Level',
            key: 'Level',
            align: 'center',
            ellipsis: true,
            width: 140,
            // render: (text, record) => {
            //   return

            // },
            render: (text, record, index) => {
              return {
                children: translateNumberToChineseOrdinal(text),
                props: { rowSpan: record.count > 0 ? record.count : record.count },
              };
            },
          },
          {
            title: '按产品分类',
            dataIndex: 'Name',
            key: 'Name',
            align: 'center',
            ellipsis: true,
            width: 240,
          },
          {
            title: '服务时长（小时）',
            dataIndex: 'ServiceTime',
            key: 'ServiceTime',
            align: 'center',
            ellipsis: true,
            width: 240,
          },
        ],
      },
    ];
  };

  // 获取服务原因表格列
  const getServiceColumns = () => {
    return [
      {
        title: <b>按服务原因</b>,
        align: 'center',
        ellipsis: true,
        children: [
          {
            title: '序号',
            align: 'center',
            ellipsis: true,
            width: 40,
            render: (text, record, index) => {
              return index + 1;
            },
          },
          {
            title: '次数',
            dataIndex: 'Level',
            key: 'Level',
            align: 'center',
            ellipsis: true,
            width: 140,
            // render: (text, record) => {
            //   return

            // },
            render: (text, record, index) => {
              return {
                children: translateNumberToChineseOrdinal(text),
                props: { rowSpan: record.count > 0 ? record.count : record.count },
              };
            },
          },
          {
            title: '服务原因',
            dataIndex: 'Name',
            key: 'Name',
            align: 'center',
            ellipsis: true,
            width: 240,
          },
          {
            title: '服务时长（小时）',
            dataIndex: 'ServiceTime',
            key: 'ServiceTime',
            align: 'center',
            ellipsis: true,
            width: 240,
          },
        ],
      },
    ];
  };

  return (
    <Card
      title={
        <Space>
          <span>{`${moment(date).format('YYYY年')}质保内服务基础数据`}</span>
          <Button
            icon={<ExportOutlined />}
            loading={exportLoading}
            onClick={() => {
              onExport();
            }}
          >
            导出
          </Button>
          {/* <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
              handleTableChange(1, 20);
            }}
          >
            查看基础数据
          </Button>  */}
        </Space>
      }
      size="small"
      bodyStyle={{ paddingBottom: 10 }}
      loading={loading}
    >
      <SdlTable
        dataSource={TableList}
        columns={getColumns()}
        align="center"
        scroll={{
          y: 500,
        }}
        pagination={false}
      />

      <Modal
        title={`${moment(date).format('YYYY年')}质保内服务统计（${
          type === 1 ? '按产品类别' : '按服务原因'
          }）`}
        wrapClassName={modalWrapClassName || 'spreadOverModal'}
        visible={isModalOpen}
        destroyOnClose
        footer={null}
        mask={false}
        onCancel={() => {
          form.resetFields();
          onCancel();
        }}
      >
        <Form
          id="searchForm"
          form={form}
          layout="inline"
          initialValues={{
            solveStatus:'',
          }}
          autoComplete="off"
        >
          <Row gutter={8} align="middle">
            <Col span={6}>
              <Form.Item name="num" label="派工单号">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="projectCode" label="项目编号">
                <Input placeholder="请输入合同编号/立项号" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="projectName" label="项目名称" className={type == 2 && 'form_label_width_97'}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="customEnt" label="最终用户" className={type == 1 && 'form_label_width_97'}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="serviceAreaCode" label="服务大区">
                <Select
                  placeholder="请选择服务大区"
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {largeRegionList.map(item => {
                    return (
                      <Option value={item.ID} key={item.ID} data-childList={item.ChildList}>
                        {item.LargeRegion}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            {type == 1 ? <>
              <Col span={6}>
                <Form.Item name="questionID" label="设备型号">
                  <Select
                    placeholder="请选择设备型号"
                    style={{ width: '100%' }}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {WarrantyAnalysis?.[0] && WarrantyAnalysis.map(item => {
                      return (
                        <Option value={item.QuestionID} key={item.QuestionID} data-childList={item.QuestionID}>
                          {item.ReasonName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
                 <Col span={6}>
                 <Form.Item name="solveStatus" label="是否解决">
                   <Radio.Group>
                     <Radio value={''}>全部</Radio>
                     <Radio value={1}>是</Radio>
                     <Radio value={0}>否</Radio>
                   </Radio.Group>
                 </Form.Item>
               </Col>
               </>
           :
           <Col span={6}>
           <Form.Item name="questionID" label="服务原因">
             <Select
               placeholder="请选择服务原因"
               style={{ width: '100%' }}
               allowClear
               showSearch
               optionFilterProp="children"
             >
               {WarrantyAnalysis?.[0] && WarrantyAnalysis.map(item => {
                 return (
                   <Option value={item.QuestionID} key={item.QuestionID} data-childList={item.QuestionID}>
                     {item.ReasonName}
                   </Option>
                 );
               })}
             </Select>
           </Form.Item>
         </Col>
          }
            <Col span={6}>
              <Form.Item name="time" label="离开现场时间" >
                <RangePicker_
                  style={{ width: '100%' }}
                  allowClear={false}
                  showTime={false}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                <Space>
                  <Button
                    loading={basicsLoading}
                    type="primary"
                    onClick={() => handleTableChange(1, 20)}
                  >
                    查询
                </Button>
                  <Button
                    loading={basicsLoading}
                    onClick={() => {
                      form.resetFields();
                      handleTableChange(1, 20);
                    }}
                  >
                    重置
                </Button>
                  <Button
                    type="primary"
                    onClick={() => onBasicsExport()}
                    loading={basicsExportLoading}
                  >
                    导出
                </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
              <Form.Item hidden name='pType'/>
        </Form>
        <SdlTable
          loading={basicsLoading}
          dataSource={basicsDataSource}
          columns={getBasicsColumns()}
          align="center"
          onChange={onTableChange}
          pagination={{
            total: tableTotal,
            pageSize: pageSize,
            current: pageIndex,
            showSizeChanger: true,
            showQuickJumper: true,
            // onChange: handleTableChange,
          }}
        />
      </Modal>
      <Modal
        title="质保内服务详情"
        wrapClassName={modalWrapClassName || 'spreadOverModal'}
        visible={isDetailsModalOpen}
        destroyOnClose
        footer={null}
        mask={false}
        onCancel={() => {
          setIsDetailsModalOpen(false);
        }}
      >
        <Descriptions
          className={styles.detailsWrapper}
          title={<TitleComponents text="基本信息" />}
          labelStyle={{ fontWeight: 500 }}
        >
          <Descriptions.Item label="派工单号">{detailsData.Num}</Descriptions.Item>
          <Descriptions.Item label="合同编号">{detailsData.ProjectCode}</Descriptions.Item>
          <Descriptions.Item label="立项号">{detailsData.ItemCode}</Descriptions.Item>
          <Descriptions.Item label="项目名称">{detailsData.ProjectName}</Descriptions.Item>
          <Descriptions.Item label="离开现场时间">{detailsData.LeaveDate}</Descriptions.Item>
          <Descriptions.Item label="填报人">{detailsData.CreateUserName}</Descriptions.Item>
          <Descriptions.Item label="填报时间" span={3}>
            {detailsData.CreateTime}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          className={styles.detailsWrapper}
          title={<TitleComponents text="服务详情" />}
          labelStyle={{ fontWeight: 500 }}
          style={{ marginTop: 20 }}
          column={4}
        >
          <Descriptions.Item label="本次服务开始时间">{detailsData.BeginTime}</Descriptions.Item>
          <Descriptions.Item label="本次服务结束时间">{detailsData.EndTime}</Descriptions.Item>
          <Descriptions.Item label="服务时长（小时）">{detailsData.ServiceCount}</Descriptions.Item>
          <Descriptions.Item label="合同要求服务时长（小时）">
            {detailsData.ProjectCount}
          </Descriptions.Item>
        </Descriptions>
        <SdlTable
          dataSource={detailsData.CategoryTableList}
          columns={getProductColumns()}
          align="center"
          pagination={false}
        />
        <SdlTable
          style={{ marginTop: 20 }}
          dataSource={detailsData.ReasonTableList}
          columns={getServiceColumns()}
          align="center"
          pagination={false}
        />
      </Modal>
    </Card>
  );
};

export default connect(dvaPropsData)(TableCard);
