import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Descriptions, Space, Tooltip, Modal } from 'antd';
import styles from '../../index.less';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import InstallaEquipment from '@/pages/ctDebuggAfterSaleServiceManage/supervisionInspection/installaEquipment';
import { DetailIcon } from '@/utils/icon';

const dvaPropsData = ({ loading, instStdAndCompReso }) => ({
  installPageData: instStdAndCompReso.installPageData,
  loading: loading.effects[`instStdAndCompReso/GetInstallationDebugRate`],
  basicsLoading: loading.effects[`ctAfterSalesServiceManagement/GetWarrantyServiceInfo`],
  exportLoading: loading.effects['ctAfterSalesServiceManagement/ExportWarrantyServiceAnalysis'],
  basicsExportLoading: loading.effects['ctAfterSalesServiceManagement/ExportWarrantyServiceInfo'],
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
  const [detailsData, setDetailsData] = useState({
    CategoryTableList: [],
    ReasonTableList: [],
  });

  const {
    dispatch,
    loading,
    exportLoading,
    installPageData: { ColumnList, TableList },
    title,
    date,
  } = props;

  useEffect(() => {}, []);

  // 获取基础数据
  const getBasicsData = (_pageIndex, _pageSize, _sort) => {
    const values = form.getFieldsValue();
    console.log('values', values);
    let time = values.time || [moment().startOf('month'), moment()];
    dispatch({
      type: 'ctAfterSalesServiceManagement/GetWarrantyServiceInfo',
      payload: {
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
        btime: time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        eTime: time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
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
    dispatch({
      type: 'ctAfterSalesServiceManagement/ExportInstallationDebugRate',
      payload: {
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  // 导出基础服务
  const onBasicsExport = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'ctAfterSalesServiceManagement/ExportWarrantyServiceInfo',
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

  //
  const getColumns = () => {
    let columnList = ColumnList.map(item => {
      return {
        title: item.LargeRegion,
        children: [
          {
            title: '优秀',
            dataIndex: `Excellent${item.ID}`,
            key: `Excellent${item.ID}`,
            width: 100,
            align: 'center',
          },
          {
            title: '合格',
            dataIndex: `Qualified${item.ID}`,
            key: `Qualified${item.ID}`,
            width: 100,
            align: 'center',
          },
          {
            title: '不合格',
            dataIndex: `Unqualified${item.ID}`,
            key: `Unqualified${item.ID}`,
            width: 100,
            align: 'center',
          },
          {
            title: '无照片',
            dataIndex: `NoPhotos${item.ID}`,
            key: `NoPhotos${item.ID}`,
            width: 100,
            align: 'center',
          },
          {
            title: '/',
            dataIndex: `NoNeed${item.ID}`,
            key: `NoNeed${item.ID}`,
            width: 100,
            align: 'center',
          },
          {
            title: '达标率',
            dataIndex: `Rate${item.ID}`,
            key: `Rate${item.ID}`,
            width: 100,
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
        title: '安装设备型号',
        dataIndex: 'CategoryName',
        key: 'CategoryName',
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
        title: '总计（安装套数）',
        children: [
          {
            title: '优秀',
            dataIndex: 'Excellent',
            key: 'Excellent',
            width: 100,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '合格',
            dataIndex: 'Qualified',
            key: 'Qualified',
            width: 100,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '不合格',
            dataIndex: 'Unqualified',
            key: 'Unqualified',
            width: 100,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '无照片',
            dataIndex: 'NoPhotos',
            key: 'NoPhotos',
            width: 100,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '/',
            dataIndex: `NoNeed`,
            key: `NoNeed`,
            width: 100,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '达标率',
            dataIndex: `Rate`,
            key: `Rate`,
            width: 100,
            fixed: 'left',
            align: 'center',
          },
        ],
      },
      ...columnList,
    ];
  };

  // 基础数据表头
  const getBasicsColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        fixed: 'left',
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '派工单号',
        dataIndex: 'Num',
        key: 'Num',
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '合同编号',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '立项号',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        ellipsis: true,
        width: 280,
        fixed: 'left',
      },
      {
        title: '服务大区',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        ellipsis: true,
        width: 280,
        fixed: 'left',
      },
      {
        title: '项目所在省',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        ellipsis: true,
      },
      {
        title: '服务工程师',
        dataIndex: 'LeaveDate',
        key: 'LeaveDate',
        ellipsis: true,
      },
      {
        title: '企业名称',
        dataIndex: 'LeaveDate',
        key: 'LeaveDate',
        ellipsis: true,
        width: 240,
      },
      {
        title: '监测点名称',
        dataIndex: 'LeaveDate',
        key: 'LeaveDate',
        ellipsis: true,
        width: 240,
      },
      {
        title: '设备型号',
        dataIndex: 'CreateUserName',
        key: 'CreateUserName',
        ellipsis: true,
      },
      {
        title: '离开现场时间',
        dataIndex: 'LeaveDate',
        key: 'LeaveDate',
        ellipsis: true,
      },
      {
        title: '安装照片',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        ellipsis: true,
      },
      {
        title: '照片上传时间',
        dataIndex: 'LeaveDate',
        key: 'LeaveDate',
        ellipsis: true,
      },
      {
        title: '审核结果',
        dataIndex: 'LeaveDate',
        key: 'LeaveDate',
        ellipsis: true,
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        fixed: 'right',
        render: (text, record) => {
          return (
            // <Tooltip title="详情">
            //   <a
            //     onClick={() => {
            //       setIsDetailsModalOpen(true);
            //       let currentDetailsData = allDetailsDataList.find(item => item.Num === record.Num);
            //       handleDetailsData(currentDetailsData, record);
            //       // setDetailsData({
            //       //   ...currentDetailsData,
            //       //   ...record,
            //       // });
            //     }}
            //   >
            //     <DetailIcon />
            //   </a>
            // </Tooltip>
            <a onClick={() => {}}>
              <ExportOutlined />
            </a>
          );
        },
      },
    ];

    return columns;
  };

  // 处理详情数据
  const handleDetailsData = (data, rowData) => {
    let CategoryTableList = [],
      ReasonTableList = [];

    // 服务原因表格数据
    data.ReasonChildList.sort((a, b) => a.Level - b.Level).map(item => {
      item.ChildList.map((child, index) => {
        ReasonTableList.push({
          ...child,
          count: index == 0 ? item.ChildList.length : 0,
        });
      });
    });
    // 产品类别表格数据
    data.CategoryChildList.sort((a, b) => a.Level - b.Level).map(item => {
      item.ChildList.map((child, index) => {
        CategoryTableList.push({
          ...child,
          count: index == 0 ? item.ChildList.length : 0,
        });
      });
    });

    console.log('CategoryTableList', CategoryTableList);
    console.log('ReasonTableList', ReasonTableList);

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

  const computeStartAndEnd = () => {
    var now = moment();
    var currentYear = now.format('YYYY');
    let inputYear = date.format('YYYY');

    var start = moment(date.format('YYYY-01-01 00:00:00')),
      end;
    if (inputYear === currentYear) {
      end = now;
    } else {
      end = date.endOf('year');
    }
    return [start, end];
  };

  return (
    <Card
      title={
        <Space>
          <span>{title}</span>
          <Button
            icon={<ExportOutlined />}
            loading={exportLoading}
            onClick={() => {
              onExport();
            }}
          >
            导出
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
              handleTableChange(1, 20);
            }}
          >
            查看基础数据
          </Button>
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
      {isModalOpen && (
        <Modal
          title="安装调试达标基础数据"
          wrapClassName="spreadOverModal"
          visible={isModalOpen}
          destroyOnClose
          footer={null}
          onCancel={() => {
            onCancel();
          }}
        >
          <InstallaEquipment
            hideBreadcrumb
            defaultTime={computeStartAndEnd(date)}
            location={props.location}
            match={props.match}
          />
        </Modal>
      )}

      <Modal
        title="质保内服务详情"
        wrapClassName="spreadOverModal"
        visible={isDetailsModalOpen}
        destroyOnClose
        footer={null}
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
          {/* <Descriptions.Item label="立项号"></Descriptions.Item> */}
          <Descriptions.Item label="离开现场时间">{detailsData.LeaveDate}</Descriptions.Item>
          <Descriptions.Item label="项目名称">{detailsData.ProjectName}</Descriptions.Item>
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
