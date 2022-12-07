/**
 * 功  能：督查整改详情
 * 创建人：jab
 * 创建时间：2022.11.24
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tabs, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { getAttachmentArrDataSource } from '@/utils/utils';
import styles from "./style.less"
import Cookie from 'js-cookie';
import AttachmentView from '@/components/AttachmentView'

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;


const namespace = 'superviseRectification'




const dvaPropsData = ({ loading, superviseRectification, global, common }) => ({
  detailLoading: loading.effects[`${namespace}/getInspectorRectificationView`],
  statusLoading: loading.effects[`${namespace}/updateRectificationStatus`] || false,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getInspectorRectificationView: (payload, callback) => {//获取单个督查表实体
      dispatch({
        type: `${namespace}/getInspectorRectificationView`,
        payload: payload,
        callback: callback,
      })

    },
    updateRectificationStatus: (payload, callback) => { //修改状态
      dispatch({
        type: `${namespace}/updateRectificationStatus`,
        payload: payload,
        callback: callback
      })
    },
  }
}




const Index = (props) => {


  const { detailLoading, ID, pollutantType, statusLoading, } = props;

  const [operationInfoList, setOperationInfoList] = useState([])
  const [infoList, seInfoList] = useState(null)


  useEffect(() => {
    initData();
  }, []);
   
  const initData = (isRectificat) =>{
    props.getInspectorRectificationView({ ID: ID }, (data) => {
      setOperationInfoList(data)
      !isRectificat&&seInfoList(data.Info && data.Info[0] ? data.Info[0] : null)
    })
  }
  const rectification = (record,status) => { //整改通过 or  整改驳回 
    props.updateRectificationStatus({ ID: record.Id,Status:status }, () => {
      initData('rectificat');
    })
  }

  const TitleComponents = (props) => {
    return <div style={{ display: 'inline-block', fontWeight: 'bold', padding: '2px 4px', marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,.1)' }}>{props.text}</div>

  }
  const getAttachmentDataSource = (fileInfo) => {
    const fileList = [];
    if (fileInfo) {
      fileInfo.split(',').map(item => {
        if (!item.IsDelete) {
          fileList.push({ name: `${item}`, attach: `/upload/${item}` })
        }
      })
    }
    return fileList;
  }
  const supervisionCol = (data) => [{
    title: <span style={{ fontWeight: 'bold', fontSize: 14 }}>
      {data[0].Title}
    </span>,
    align: 'center',
    children: [
      {
        title: '序号',
        align: 'center',
        width: 100,
        render: (text, record, index) => {
          return index + 1
        }
      },
      {
        title: '督查内容',
        dataIndex: 'ContentItem',
        key: 'ContentItem',
        align: 'center',
        width: 380,
        render: (text, record) => {
          return <div style={{ textAlign: "left" }}>{text}</div>
        },
      },
      {
        title: '问题描述',
        dataIndex: 'InspectorProblem',
        key: 'InspectorProblem',
        align: 'center',
        render: (text, record) => {
          return <div style={{ textAlign: "left" }}>{text}</div>
        },
      },
      {
        title: '问题附件',
        dataIndex: 'InspectorAttachment',
        key: 'InspectorAttachment',
        align: 'center',
        width: 120,
        render: (text, record) => {
          const attachmentDataSource = getAttachmentDataSource(text);
          return <div>
            {text && <AttachmentView noDataNoShow dataSource={attachmentDataSource} />}
          </div>
        },
      },
      {
        title: '整改描述',
        dataIndex: 'RectificationDescribe',
        key: 'RectificationDescribe',
        align: 'center',
        render: (text, record) => {
          return <div style={{ textAlign: "left" }}>{text}</div>
        },
      },
      {
        title: '整改附件',
        dataIndex: 'RectificationAttachment',
        key: 'RectificationAttachment',
        align: 'center',
        width: 120,
        render: (text, record) => {
          const attachmentDataSource = getAttachmentDataSource(text);
          return <div>
            {text && <AttachmentView noDataNoShow dataSource={attachmentDataSource} />}
          </div>
        },
      },
      {
        title: '整改状态',
        dataIndex: 'StatusName',
        key: 'StatusName',
        align: 'center',
      },
      {
        title: '整改日期',
        dataIndex: 'RectificationDateTime',
        key: 'RectificationDateTime',
        align: 'center',
      },
      {
        title: <span>操作</span>,
        align: 'center',
        fixed: 'right',
        width: 180,
        ellipsis: true,
        render: (text, record) => {
          return  <Fragment>
           {(record.Status==1|| record.Status==4)&&<Popconfirm title="确定要整改通过？" style={{ paddingRight: 5 }} onConfirm={() => { rectification(record,3) }} okText="是" cancelText="否">
              <a>整改通过</a>
            </Popconfirm>  }
           
            {record.Status==1&& <><Divider type="vertical" /><Popconfirm title="确定要整改驳回？" style={{ paddingRight: 5 }} onConfirm={() => { rectification(record,4) }} okText="是" cancelText="否">
              <a>整改驳回</a>
            </Popconfirm></>}
          </Fragment>
          
        }
      },
    ]
  }
  ]

  // const supervisionCol2 = [ {
  //   title: <span style={{fontWeight:'bold',fontSize:14}}>
  //     {operationInfoList.importanProblemList&&operationInfoList.importanProblemList[0]&&operationInfoList.importanProblemList[0].Title}
  //   </span>,
  //   align: 'center',
  //   children:[
  //     {
  //       title: '序号',
  //       align: 'center',
  //       width:100,
  //       render:(text,record,index)=>{
  //        return index+1
  //       }
  //    },
  //   {
  //     title: '督查内容',
  //     dataIndex: 'ContentItem',
  //     key: 'ContentItem',
  //     align: 'center',
  //     width:380,
  //     render: (text, record) => {
  //       return <div style={{textAlign:"left"}}>{text}</div>
  //     },
  //   },
  //   {
  //     title: `扣分`,
  //     dataIndex: 'Inspector',
  //     key: 'Inspector',
  //     align: 'center',
  //     width:200,
  //   },
  //   {
  //     title: '说明',
  //     dataIndex: 'Remark',
  //     key: 'Remark',
  //     align: 'center',
  //     render: (text, record) => {
  //       return <div style={{textAlign:"left"}}>{text}</div>
  //     },
  //    },
  //    {
  //     title: '附件',
  //     dataIndex: 'Attachments',
  //     key: 'Attachments',
  //     align: 'center',
  //     width:120,
  //     render: (text, record) => {
  //       const attachmentDataSource = getAttachmentDataSource(text);
  //       return   <div>
  //          {text&&<AttachmentView noDataNoShow dataSource={attachmentDataSource} />}
  //     </div>
  //     },
  //   },
  //   ]
  //   }]

  //   const supervisionCol3 = [{
  //     title: <span style={{fontWeight:'bold',fontSize:14}}>{operationInfoList.CommonlyProblemList&&operationInfoList.CommonlyProblemList[0]&&operationInfoList.CommonlyProblemList[0].Title}</span>,
  //     align: 'center',
  //     children:[ 
  //       {
  //         title: '序号',
  //         align: 'center',
  //         width:100,
  //         render:(text,record,index)=>{
  //          return index+1
  //         }
  //      },
  //     {
  //       title: '督查内容',
  //       dataIndex: 'ContentItem',
  //       key: 'ContentItem',
  //       align: 'center',
  //       width:380,
  //       render: (text, record) => {
  //         return <div style={{textAlign:"left"}}>{text}</div>
  //       },
  //     },
  //     {
  //       title: `扣分`,
  //       dataIndex: 'Inspector',
  //       key: 'Inspector',
  //       align: 'center',
  //       width:200,
  //     },
  //     {
  //       title: '说明',
  //       dataIndex: 'Remark',
  //       key: 'Remark',
  //       align: 'center',
  //       render: (text, record) => {
  //         return <div style={{textAlign:"left"}}>{text}</div>
  //       },
  //     },
  //     {
  //       title: '附件',
  //       dataIndex: 'Attachments',
  //       key: 'Attachments',
  //       align: 'center',
  //       width:120,
  //       render: (text, record) => {
  //         const attachmentDataSource = getAttachmentDataSource(text);
  //         return   <div>
  //            {text&&<AttachmentView noDataNoShow  dataSource={attachmentDataSource} />}
  //       </div>
  //       },
  //     },
  //   ]
  //     }]
  // const supervisionCol4 = [
  //   {
  //     align: 'center',
  //     width: 480,
  //     render: (text, record, index) => {
  //       return index == 0 ? '总分' : '评价'
  //     },
  //   },
  //   {
  //     key: 'Sort',
  //     render: (text, record, index) => {
  //       if (index == 0) {
  //         return <div>{infoList && infoList.TotalScore} </div>
  //       } else {
  //         return {
  //           children: <div>{infoList && infoList.Evaluate} </div>,
  //           props: { colSpan: 3 },
  //         };
  //       }

  //     }
  //   },
  //   {
  //     key: 'Sort',
  //     align: 'center',
  //     render: (text, record, index) => {
  //       const obj = {
  //         children: '附件',
  //         props: {},
  //       };
  //       if (index === 1) {
  //         obj.props.colSpan = 0;
  //       }
  //       return obj;
  //     }
  //   },
  //   {
  //     key: 'Sort',
  //     render: (text, record, index) => {
  //       const attachmentDataSource = getAttachmentArrDataSource(infoList && infoList.FilesList);
  //       const obj = {
  //         children: <div>
  //           <AttachmentView noDataNoShow style={{ marginTop: 10 }} dataSource={attachmentDataSource} />
  //         </div>,
  //         props: {},
  //       };
  //       if (index === 1) {
  //         obj.props.colSpan = 0;
  //       }
  //       return obj;
  //     }
  //   },
  // ]

  return (
    <div className={'detail'} >
      <div style={{ fontSize: 16, padding: 6, textAlign: 'center', fontWeight: 'bold' }}>督查整改详情</div>

      <Spin spinning={detailLoading || statusLoading}>

        <Form
          name="basics"
        >

          <div className={'essentialInfoSty'}>
            <TitleComponents text='基本信息' />
            <Row>
              <Col span={12}>
                <Form.Item label="企业名称" >
                  {infoList && infoList.EntName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='行政区'>
                  {infoList && infoList.RegionName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='站点名称' >
                  {infoList && infoList.PointName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='督查类别' >
                  {infoList && infoList.InspectorTypeName}
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item label="督查人员"   >
                  {infoList && infoList.InspectorName}
                </Form.Item>
              </Col >
              <Col span={12}>
                <Form.Item label="督查日期" >
                  {infoList && infoList.InspectorDate}

                </Form.Item>
              </Col >
              <Col span={12}>
                <Form.Item label="运维人员"  >
                  {infoList && infoList.OperationUserName}

                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="得分"  >
                  {infoList && infoList.TotalScore}

                </Form.Item>
              </Col>
            </Row>
          </div>

        </Form>

        <div className={'supervisionDetailSty'}>
          <TitleComponents text='督查内容' />
          {!operationInfoList.PrincipleProblemList && !operationInfoList.importanProblemList && !operationInfoList.CommonlyProblemList ?

            <Table
              bordered
              dataSource={[]}
              columns={[]}
              pagination={false}
              locale={{ emptyText: '暂无模板数据' }}
            />
            :
            <>
              {operationInfoList.PrincipleProblemList && operationInfoList.PrincipleProblemList[0] && <Table
                bordered
                dataSource={operationInfoList.PrincipleProblemList}
                columns={supervisionCol(operationInfoList.PrincipleProblemList)}
                rowClassName="editable-row"
                pagination={false}
              />}
              {operationInfoList.importanProblemList && operationInfoList.importanProblemList[0] && <Table
                bordered
                dataSource={operationInfoList.importanProblemList}
                columns={supervisionCol(operationInfoList.importanProblemList)}
                rowClassName="editable-row"
                className="impTableSty"
                pagination={false}
              />}
              {operationInfoList.CommonlyProblemList && operationInfoList.CommonlyProblemList[0] && <> <Table
                bordered
                dataSource={operationInfoList.CommonlyProblemList}
                columns={supervisionCol(operationInfoList.CommonlyProblemList)}
                rowClassName="editable-row"
                pagination={false}
                className={'commonlyTableSty'}
              /></>}
              {/* <Table
                bordered
                dataSource={[{ Sort: 1 }, { Sort: 2 }]}
                columns={supervisionCol4}
                className="summaryTableSty"
                pagination={false}
              /> */}
            </>
          }

        </div>

      </Spin>

    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);