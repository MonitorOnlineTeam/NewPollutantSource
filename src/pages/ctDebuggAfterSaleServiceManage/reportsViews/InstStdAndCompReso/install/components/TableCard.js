/*
 * @Author: JiaQi
 * @Date: 2024-04-16 16:37:56
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-21 14:42:25
 * @Description:  安装调试达标率表格
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Descriptions, Space, Tooltip, Modal } from 'antd';
import styles from '../../index.less';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import InstallEquipment from '@/pages/ctDebuggAfterSaleServiceManage/supervisionInspection/installEquipment';

const dvaPropsData = ({ loading, reportsAndViews }) => ({
  installPageData: reportsAndViews.installPageData,
  loading: loading.effects[`reportsAndViews/GetInstallationDebugRate`],
  exportLoading: loading.effects['reportsAndViews/ExportWarrantyServiceAnalysis'],
});

const TableCard = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    dispatch,
    loading,
    exportLoading,
    installPageData: { ColumnList, TableList },
    title,
    date,
    modalWrapClassName,
  } = props;

  useEffect(() => {}, []);

  // 导出
  const onExport = () => {
    dispatch({
      type: 'reportsAndViews/ExportInstallationDebugRate',
      payload: {
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };
  
  const onCancel = () => {
    setIsModalOpen(false);
  };
  const [queryData,setQueryData]=useState({})
  const typeClick = (data) =>{
    setIsModalOpen(true);
    setQueryData(data)
  }
  const TypeRenderComponents = ({data}) =>{
  return <a onClick={()=>typeClick(data)}>{data?.text || data?.text==0?  data.text : ''}</a>
  }
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
            render:(text,record)=>{
              return <TypeRenderComponents data={{auditResults:1,serviceAreaCode:item.ID,text:text, time:[moment(record.btime),moment(record.etime) ],systemModelId:record.SystemModelId }}  />
            }
          },
          {
            title: '合格',
            dataIndex: `Qualified${item.ID}`,
            key: `Qualified${item.ID}`,
            width: 100,
            align: 'center',
            render:(text,record)=>{
              return <TypeRenderComponents data={{auditResults:2,serviceAreaCode:item.ID,text:text,time:[moment(record.btime),moment(record.etime) ],systemModelId:record.SystemModelId  }}  />
            }
          },
          {
            title: '不合格',
            dataIndex: `Unqualified${item.ID}`,
            key: `Unqualified${item.ID}`,
            width: 100,
            align: 'center',
            render:(text,record)=>{
              return <TypeRenderComponents data={{auditResults:3,serviceAreaCode:item.ID,text:text,time:[moment(record.btime),moment(record.etime) ],systemModelId:record.SystemModelId  }}  />
            }
          },
          {
            title: '无照片',
            dataIndex: `NoPhotos${item.ID}`,
            key: `NoPhotos${item.ID}`,
            width: 100,
            align: 'center',
            render:(text,record)=>{
              return <TypeRenderComponents data={{auditResults:4,serviceAreaCode:item.ID,text:text,time:[moment(record.btime),moment(record.etime) ],systemModelId:record.SystemModelId  }}  />
            }
          },
          {
            title: '/',
            dataIndex: `NoNeed${item.ID}`,
            key: `NoNeed${item.ID}`,
            width: 100,
            align: 'center',
            render:(text,record)=>{
              return <TypeRenderComponents data={{auditResults:5,serviceAreaCode:item.ID,text:text,time:[moment(record.btime),moment(record.etime) ],systemModelId:record.SystemModelId  }}  />
            }
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
            render:(text,record)=>{
              return <TypeRenderComponents data={{auditResults:1,text:text,time:[moment(record.btime),moment(record.etime)],systemModelId:record.SystemModelId  }}  />
            }
          },
          {
            title: '合格',
            dataIndex: 'Qualified',
            key: 'Qualified',
            width: 100,
            align: 'center',
            fixed: 'left',
            render:(text,record)=>{
              return <TypeRenderComponents data={{auditResults:2,text:text,time:[moment(record.btime),moment(record.etime)],systemModelId:record.SystemModelId  }}  />
            }
          },
          {
            title: '不合格',
            dataIndex: 'Unqualified',
            key: 'Unqualified',
            width: 100,
            align: 'center',
            fixed: 'left',
            render:(text,record)=>{
              return <TypeRenderComponents data={{auditResults:3,text:text,time:[moment(record.btime),moment(record.etime)],systemModelId:record.SystemModelId  }}  />
            }
          },
          {
            title: '无照片',
            dataIndex: 'NoPhotos',
            key: 'NoPhotos',
            width: 100,
            align: 'center',
            fixed: 'left',
            render:(text,record)=>{
              return <TypeRenderComponents data={{auditResults:4,text:text,time:[moment(record.btime),moment(record.etime)],systemModelId:record.SystemModelId  }}  />
            }
          },
          {
            title: '/',
            dataIndex: `NoNeed`,
            key: `NoNeed`,
            width: 100,
            align: 'center',
            fixed: 'left',
            render:(text,record)=>{
              return <TypeRenderComponents data={{auditResults:5,text:text,time:[moment(record.btime),moment(record.etime)],systemModelId:record.SystemModelId  }}  />
            }
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

  const computeStartAndEnd = () => {
    let _date = moment(date);
    var now = moment();
    var currentYear = now.format('YYYY');
    let inputYear = _date.format('YYYY');

    var start = moment(_date.format('YYYY-01-01 00:00:00')),
      end;
    if (inputYear === currentYear) {
      end = now;
    } else {
      end = _date.endOf('year');
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
          {/* <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            查看基础数据
          </Button> */}
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
          wrapClassName={modalWrapClassName || "spreadOverModal"}
          open={isModalOpen}
          destroyOnClose
          footer={null}
          mask={false}
          bodyStyle={{padding:0}}
          onCancel={() => {
            onCancel();
          }}
        >
          <InstallEquipment
            hideBreadcrumb
            modalWrapClassName = {modalWrapClassName}
            defaultTime={computeStartAndEnd(date)}
            queryData = {queryData}
            defaultStatus=""
            auditResultList={[1, 2, 3, 4, 5]}
            location={props.location}
            match={props.match}
          />
        </Modal>
      )}
    </Card>
  );
};

export default connect(dvaPropsData)(TableCard);
