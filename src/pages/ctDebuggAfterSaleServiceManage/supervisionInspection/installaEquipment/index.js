/**
 * 功  能：设备安装审核 设备安装规范性
 * 创建人：jab
 * 创建时间：2024.03
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Radio,Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import moment from 'moment';
import Cookie from 'js-cookie';
import config from '@/config';
import ImageView from '@/components/ImageView';
import SetUserListBtn from "@/components/SetUserListBtn";
import { API } from '@config/API';
import cuid from 'cuid';
import styles from "./style.less"
const { Option } = Select;
const { Step } = Steps;
const namespace = 'installaEquipment'

const dvaPropsData = ({ loading, installaEquipment, global, }) => ({
  tableLoading: loading.effects[`${namespace}/GetEquipmentAuditList`],
  tableDatas: installaEquipment.installEquipmentTableDatas,
  tableTotal: installaEquipment.installEquipmentTableTotal,
  queryPar: installaEquipment.installaEquipmentQueryPar,
  installPhotoData: installaEquipment.installPhotoData,
  auditPhotoLoading: loading.effects[`${namespace}/GetAuditPhoto`],
  addAuditInfoLoading: loading.effects[`${namespace}/AddAuditInfo`],
  configInfo: global.configInfo,
})

const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();



  const { queryPar, tableDatas, tableTotal, tableLoading, auditPhotoLoading, installPhotoData, addAuditInfoLoading} = props;

  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    onFinish(pageIndex, pageSize)
  }, []);
  const columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '派工单号',
      dataIndex: 'Num',
      key: 'Num',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '合同编号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '立项号',
      dataIndex: 'ItemCode',
      key: 'ItemCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务大区',
      dataIndex: 'ServiceAreaName',
      key: 'ServiceAreaName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目所在省',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务工程师',
      dataIndex: 'WorkerName',
      key: 'WorkerName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '设备型号',
      dataIndex: 'SystemModelName',
      key: 'SystemModelName',
      align: 'center',
      ellipsis: true,
    },

    {
      title: '离开现场时间',
      dataIndex: 'LeaveDate',
      key: 'LeaveDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '安装照片',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return <a onClick={() => viewPhotos(record)}>查看照片</a>
      }
    },
    {
      title: '照片上传时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '审核状态',
      dataIndex: 'StatusName',
      key: 'StatusName',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        return <Tag color={text == '待审核' ? "processing" : text == '审核未通过' ? "error" : "success"}>{text}</Tag>
      }
    },
    {
      title: <span>操作</span>,
      align: 'center',
      fixed: 'right',
      width: 60,
      ellipsis: true,
      render: (text, record) => {
        return (
          <Tooltip title="审核">
            <a
              onClick={() => {
                examinePhotos(record)
              }}
            >
              <AuditOutlined style={{ fontSize: 16 }} />
            </a>
          </Tooltip>
        );

      }
    },
  ];
  const [viewPhotosVisible, setViewPhotosVisible] = useState(false)
  const viewPhotos = (row) => {
    setViewPhotosVisible(true)
    props.dispatch({
      type: `${namespace}/GetAuditPhoto`,
      payload: {
        systemModelId: row.Col1,
        dispatchId: row.DispatchId,
        pointId: row.PointId,
        equipmentAuditId: row.EquipmentAuditId,
      }
    });
  }


  const onFinish = async (PageIndex, PageSize, queryPar) => {  //查询

    try {
      const values = await form.validateFields();
      const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
        ...values,
        pageIndex: PageIndex,
        pageSize: PageSize,
      }
      props.dispatch({
        type: `${namespace}/GetEquipmentAuditList`,
        payload: {
          ...par,
        }
      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize, props.queryPar)
  }

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { setPageIndex(1); onFinish(1, pageSize) }}
      initialValues={{
      }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Form.Item name='num' label='派工单号'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item name='projectCode' label='项目编号' >
            <Input placeholder="合同编号、立项号" allowClear />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item name='projectName' label='项目名称' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='status' label='审核状态' >
            <Select placeholder='请选择' allowClear>
              <Option value={1}>待审核</Option>
              <Option value={2}>已审核</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={tableLoading}>
              查询
         </Button>
            <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); setPageIndex(1); setPageSize(20); onFinish(1, 20) }}  >
              重置
         </Button>
            <SetUserListBtn type={4} text='审核人员清单' />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  const ViewPhotosComponents = () => {
    return <Row className='seePhotoSty'>
      {auditPhotoLoading ?
        <Skeleton active avatar paragraph={{ rows: 8 }} />
        :
        <>{installPhotoData?.PhotosList?.[0] ? installPhotoData.PhotosList.map((item, index) => {
          return <Col span={6} style={{ padding: '0 18px 14px 0' }}>
            <div style={{ padding: '12px 0 12px 12px', borderRadius: 8, boxShadow: '0px 0px 16px 0px rgba(153,153,153,0.16)' }}>
              <Row align='middle'>
                <Image preview={true} src={`/ctInstallaEquipmentImg/installPhotos/${index}.png`} />
                <div style={{ paddingLeft: 8, width: 'calc(100% - 58px)' }}>
                  <div style={{ fontSize: 16, fontWeight: 400 }} className='textOverflow'>{item.Name}</div>
                <div className='textOverflow'>备注：{!item.Remark ? 
                   <Tooltip placement="bottom" title="1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111122222222222222222222222222222222211111111111111111111111111">{item.Remark}11</Tooltip> 
                   :
                   '无'}</div>
                </div>
                <Row style={{ marginTop: 4, width:'100%' }}>
                       <Upload
                      listType="picture-card"
                      showUploadList={{ showRemoveIcon: false }}
                      fileList={         
                        item?.FilesList?.ImgList[0]? item.FilesList.ImgList.map((imgItem, index) => {
                            return {
                              uid: index,
                              status: 'done',
                              url: `/${imgItem}`
                            }
                          }) : []
                        }
                      onPreview={file => {
                        setIsImageViewOpen(true);
                        let imageListIndex = 0,imageData=[];
                        item?.FilesList?.ImgList?.map((item, index) => {
                          imageData.push(`/${item}`)
                          if (index === file.uid) {
                            imageListIndex = index;
                           } 
                        });
                        setImageIndex(imageListIndex);
                        setImageList(imageData);
                      }}
                    />
                </Row>

              </Row>
            </div>
          </Col>

        })
          :
          <Empty />

        }</>
      }
    </Row>
  }

  const HandlingSuggesComponents = ({type}) => {
    return <Row className='handlingSuggesSty' style={{  width: type==1?'90%':'100%',margin:  type==1? '18px auto' : '18px 0', backgroundColor: '#fff' }}>
      <div style={{ lineHeight: '40px', width: '100%', backgroundColor: '#E8F2FD', paddingLeft: 18, borderTop: '1px solid #BBDAF9' }}>
        处理人意见区
     </div>
      <div style={{ width: '100%', boxShadow: '0px 0px 8px 0px rgba(153,153,153,0.14)', backgroundColor: '#fff',   }}>
        {auditPhotoLoading ?
          <div style={{ padding: 24 }}><Skeleton active avatar paragraph={{ rows: 8 }} /></div>
          :
          <>
            <Row style={{ flex: 1, height: 24 }} />
            {installPhotoData?.OpinionList?.[0] ? installPhotoData?.OpinionList.map((item, index) => {
              return <><div>
                <Row style={{ lineHeight: '40px', padding: '0 24px', backgroundColor: '#F4F5F8' }}>
                  <span style={{ color: '#4D97F3', paddingRight: 24 }}>{item.UserName}</span>   <span style={{ color: item.StatusName == '驳回' ? '#FF5959' : item.StatusName == '申诉' ? '#F89F2D' : '#242425', paddingRight: 24 }}>{item.StatusName}</span>  <span style={{ color: '#999', paddingRight: 24 }}>{item.Time}</span>
                </Row>
                <Row style={{ padding: '16px 24px' }}>
                  <div style={{ height: '100%' }}>备注：</div>
                  <div style={{ width: 'calc(100% - 42px)' }}>
                    {item.Opinion ? item.Opinion : '无'}
                  </div>
                </Row>
              </div>
                <div style={{padding:'0 24px 8px 24px'}}>
                       <Upload
                      listType="picture-card"
                      showUploadList={{ showRemoveIcon: false }}
                      fileList={         
                        item?.FilesList?.ImgList[0]? item.FilesList.ImgList.map((imgItem, index) => {
                            return {
                              uid: index,
                              status: 'done',
                              url: `/${imgItem}`
                            }
                          }) : []
                        }
                      onPreview={file => {
                        setIsImageViewOpen(true);
                        let imageListIndex = 0,imageData=[];
                        item?.FilesList?.ImgList?.map((item, index) => {
                          imageData.push(`/${item}`)
                          if (index === file.uid) {
                            imageListIndex = index;
                           } 
                        });
                        setImageIndex(imageListIndex);
                        setImageList(imageData);
                      }}
                    />
                </div>
              </>
            })
              :
              <Empty />

            }</>
        }
      </div>
    </Row>
  }

  const [files, setFiles] = useState(cuid()) 
  const [fileList, setFileList] = useState([])
  const uploadProps = (name) => {
    return { // 核查问题照片附件 上传
      action: API.UploadApi.UploadPicture,
      headers: { Cookie: null, Authorization: "Bearer " + Cookie.get(config.cookieName) },
      accept: 'image/*',
      listType: 'picture-card',
      data: {
        FileUuid: files,
        FileActualType: '0',
      },
      beforeUpload: (file) => {
        const fileType = file?.type; //获取文件类型 type  image/*
        if (!(/^image/g.test(fileType))) {
          message.error(`请上传图片格式文件!`);
          return false;
        }
      },
      onChange(info) {
        const fileList = [];
        info.fileList.map(item => {
          if (item.response && item.response.IsSuccess) { //刚上传的
            fileList.push({ ...item, url: `/${item.response.Datas}`, })
          } else if (!item.response) {
            fileList.push({ ...item })
          }
        })
        if (info.file.status == 'uploading') {
          setFileList(fileList)
        }
        if (info.file.status === 'done') {
            if(info.file?.response?.IsSuccess){
              form2.setFieldsValue({ [name]: files })
              message.success(`${info.file.name} 上传成功`);
            }else{
              message.error(info.file?.response?.Message)
            }
            setFileList(fileList)
        } else if (info.file.status === 'error' || info.file.status === 'removed') {
          form2.setFieldsValue({[name]:fileList && fileList[0] ? files : undefined})//有上传成功的取前面的uid 没有则表示没有上传成功的图片
          if(info.file.status === 'error'){
            message.error(`${info.file.name} ${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '上传失败'}`);
          }else{
            setFileList(fileList)
          }
        } 
      },
      onRemove: (file) => {
        if (!file.error) {
          props.dispatch({
            type: "autoForm/deleteAttach",
            payload: {
              Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
            }
          })
        }

      },
      onPreview: file => { //预览
        setIsImageViewOpen(true);
        let imageListIndex = 0,imgList=[];
        fileList.map((item, index) => {
          if (item.uid === file.uid) {
            imageListIndex = index;
          }
          imgList.push(`${item.url}`)
        });
        setImageIndex(imageListIndex);
        setImageList(imgList);
      },
      fileList: fileList
    }

  }
  const ExamineComponents = () => {
    return <div style={{padding:'14px 18px 0 18px'}}>
      <Form
      form={form2}
      name="advanced_search2"
      className={'ant-advanced-search-form2'}
    >
      <Form.Item name='auditResults' label='审核结果'  rules={[{ required: true, message: '请选择审核结果！' }]}>
        <Radio.Group>
          <Radio value={1}>优秀</Radio>
          <Radio value={2}>合格</Radio>
          <Radio value={3}>不合格</Radio>
          <Radio value={4}>无照片</Radio>
          <Radio value={5}>/</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name='opinion' label='审核意见' rules={[{ required: true, message: '请输入审核意见！' }]}>
        <Input.TextArea rows={2} placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name='auditFiles' label='附件'>
        <Upload {...uploadProps('auditFiles')} style={{ width: '100%' }}>
          <div>
            <PlusOutlined />
            <div className="ant-upload-text">上传</div>
          </div>
        </Upload>
      </Form.Item>
    </Form>
     <HandlingSuggesComponents type={2}/>
      </div>
  }
  const [examineVisible, setExamineVisible] = useState(false)
  const [examineTitle, setExamineTitle] = useState('')
  const [examineData, setExamineData] = useState()

  const examinePhotos = (row) => {
    setExamineVisible(true)
    SetCurrent(0)
    setExamineTitle(`安装审核照片（${row.EntName} - ${row.PointName} -${row.SystemModelName} ）`)
    setExamineData(row)
    props.dispatch({
      type: `${namespace}/GetAuditPhoto`,
      payload: {
        systemModelId: row.Col1,
        dispatchId: row.DispatchId,
        pointId: row.PointId,
        equipmentAuditId: row.EquipmentAuditId,
      }
    });
  }

  const steps = ['安装照片', '审核', '完成']
  const [current, SetCurrent] = useState(0)

  const saveNext = async () => { //下一步
    switch (current) {
      case 0: //安装照片
        SetCurrent(current + 1)
        break;
      case 1: //审核
      const values = await form2.validateFields();
      const par = {
          ...values,
          systemModelId: examineData.Col1,
          dispatchId: examineData.DispatchId,
          pointId: examineData.PointId,
          equipmentAuditId: examineData.EquipmentAuditId,
          workerID:examineData.PointId,
          projectCode: examineData.ProjectCode,
          itemCode:  examineData.ItemCode,
          entName:  examineData.EntName,
          pointName:  examineData.PointName,
      }
      props.dispatch({
        type: `${namespace}/AddAuditInfo`,
        payload: {
         ...par
        },
        callback:()=>{
          SetCurrent(current + 1)
        }
      });  
        break;
      case 2: //完成
        setExamineVisible(false)
        break;
      default:
        SetCurrent(0)
        break;
    }
  }
  const CompleteComponents = ()=>{
    return  <Result
    status="success"
    title="审核完成"
  />
  }
  return (
    <div className={styles.installaEquipmentSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            style={{ marginTop: 6 }}
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            pagination={{
              total: tableTotal,
              pageSize: pageSize,
              current: pageIndex,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange,
            }}
          />
          <Modal
            visible={viewPhotosVisible}
            title={'安装照片'}
            onCancel={() => { setViewPhotosVisible(false) }}
            footer={null}
            mask={false}
            destroyOnClose
            wrapClassName={`spreadOverModal ${styles.modalSty}`}
          >
            <ViewPhotosComponents />

            <HandlingSuggesComponents type={1}/>
          </Modal>
          <Modal
            visible={examineVisible}
            title={examineTitle}
            onCancel={() => { setExamineVisible(false) }}
            destroyOnClose
            mask={false}
            wrapClassName={`spreadOverModal ${styles.modalSty2}`}
            footer={<div className="steps-action">
              {current > 0 && current != steps.length - 1 && (
                <Button
                  onClick={() => prev()}
                >
                  上一步
                </Button>
              )}
              {current <= steps.length - 1 && (
                <Button type="primary" loading={current==1? addAuditInfoLoading : false} onClick={() => saveNext()}>
                  {current < steps.length - 1 ? '下一步' : '完成'}
                </Button>
              )}
            </div>}
          >
            <Steps current={current}>
              {steps.map(item => <Step title={item} />)}
            </Steps>
              <div style={{marginTop:12}}>{current==0? <ViewPhotosComponents /> : current==1 ? <ExamineComponents />  : <CompleteComponents /> } </div>
          </Modal>
        </Card>
        {/* 查看照片弹窗 */}
        <ImageView
          isOpen={isImageViewOpen}
          images={imageList?.length ? imageList : []}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            setIsImageViewOpen(false);
          }}
        />
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);