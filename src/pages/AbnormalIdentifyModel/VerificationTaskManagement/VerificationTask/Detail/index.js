/*
 * @Author: jab
 * @Date: 2024-01-29
 * @Description：待核查任务 已核查任务
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Select, Badge, Tooltip, Input, Radio, Modal, Row, message, Popover, Table, Collapse, Cascader, Upload, Col, Tabs, } from 'antd';
import styles from '../../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { cookieName, uploadPrefix } from '@/config'
import cuid from 'cuid'

import Cookie from 'js-cookie';
import { API } from '@config/API';


const textStyle = {
    width: '100%',
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
    verificationTaskData: AbnormalIdentifyModel.verificationTaskData,
    queryLoading: loading.effects['AbnormalIdentifyModel/GetWaitCheckDatas'],

});

const Index = props => {
    const [form] = Form.useForm();


    const {
        dispatch,
        queryLoading,
        verificationTaskData,
        history,
    } = props;
    let id = history?.location?.query?.id
    const [dataSource, setDataSource] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        props.dispatch({
            type: 'AbnormalIdentifyModel/updateState',
            payload: { verificationTaskData: { ...verificationTaskData, type: 2 } },
        });
        // onFinish(pageIndex, pageSize);
    }, []);



    const getColumns = () => {
        return [
            {
                title: '编号',
                dataIndex: 'index',
                key: 'index',
                width: 80,
                ellipsis: true,
                render: (text, record, index) => {
                    return (
                        (pageIndex - 1) * pageSize + index + 1
                    );
                },
            },
            {
                title: '企业',
                dataIndex: 'EntName',
                key: 'EntName',
                width: 200,
                ellipsis: true,
            },
            {
                title: '排口',
                dataIndex: 'PointName',
                key: 'PointName',
                width: 200,
                ellipsis: true,
            },
            {
                title: '行业',
                dataIndex: 'Industry',
                key: 'Industry',
                width: 120,
                ellipsis: true,
            },
            {
                title: '发现线索时间',
                dataIndex: 'ClueTime',
                key: 'ClueTime',
                width: 180,
                ellipsis: true,
            },
            {
                title: '场景类别',
                dataIndex: 'WarningName',
                key: 'WarningName',
                width: 180,
                ellipsis: true,
            },
            {
                title: '线索内容',
                dataIndex: 'WarningContent',
                key: 'WarningContent',
                width: 240,
                ellipsis: true,
                render: (text, record) => {
                    return (
                        <Tooltip title={text}>
                            <span style={textStyle}>{text}</span>
                        </Tooltip>
                    );
                },
            },
            {
                title: '操作',
                key: 'handle',
                width: 100,
                render: (text, record) => {
                    return (
                        <Tooltip title="查看">
                            <a
                                onClick={e => {
                                    let scrollTop = 0;
                                    let el = document.querySelector('.ant-table-body');
                                    el ? (scrollTop = el.scrollTop) : '';
                                    props.dispatch({
                                        type: 'AbnormalIdentifyModel/updateState',
                                        payload: {
                                            generateVerificationTakeData: {
                                                ...generateVerificationTakeData,
                                                scrollTop: scrollTop,
                                            },
                                        },
                                    });
                                    const data = { type: 2 }
                                    router.push(
                                        `/AbnormalIdentifyModel/ClueAnalysis/GenerateVerificationTake/Detail?data=${data}`
                                    );
                                }}
                            >
                                <DetailIcon />
                            </a>
                        </Tooltip>
                    );
                },
            },
        ];
    };


    // 查询数据
    const onFinish = (pageIndex, pageSize) => {
        const values = form.getFieldsValue();
        props.dispatch({
            type: 'AbnormalIdentifyModel/GetWaitCheckDatas',
            payload: {
                ...values,
                date: undefined,
                beginTime: values.date ? values.date[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
                endTime: values.date ? values.date[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
                pageIndex: pageIndex,
                pageSize: pageSize
            },
            callback: res => {
                setDataSource(res.Datas);
                setTotal(res.Total);
                // 设置滚动条高度，定位到点击详情的行号
                // let currentForm = warningForm[modelNumber];
                // let el = document.querySelector(`[data-row-key="rowKey"]`);
                // let tableBody = document.querySelector('.ant-table-body');
                // console.log('el', el);
                // if (tableBody) {
                //   el ? (tableBody.scrollTop = currentForm.scrollTop) : (tableBody.scrollTop = 0);
                // }
            },
        });
    };

    const [fileVisible, setFileVisible] = useState(false)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewTitle, setPreviewTitle] = useState()
    const [photoIndex, setPhotoIndex] = useState(0); //预览图片Index
    const [imgUrlList, setImgUrlList] = useState([]);//预览图片列表
  
    const [filesList1, setFilesList1] = useState([])
    const [filesList2, setFilesList2] = useState([])

    const uploadProps = (type)=> {
        const files = type==1?'files1' : 'files2'
        const cuids = form.getFieldValue(files)? form.getFieldValue(files)  : cuid()
        return { //图片上传 
        action: API.UploadApi.UploadPicture,
        headers: { Cookie: null, Authorization: "Bearer " + Cookie.get(cookieName) },
        accept: 'image/*',
        data: {
          FileUuid: cuids,
          FileActualType: '0',
        },
        listType: "picture-card",
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
          if (info.file.status === 'uploading') {
            type==1? setFilesList1(fileList) : setFilesList2(fileList)
          }
          if(info.file.status === 'done'){
            if(info.file?.response?.IsSuccess){
              message.success('上传成功！')
              type==1? setFilesList1(fileList) : setFilesList2(fileList)
              form.setFieldsValue({ [files]:  cuids})
            }else{
              message.error(info.file?.response?.Message)
            }
          }
          if (info.file.status === 'done' || info.file.status === 'removed' || info.file.status === 'error') {
            type==1? setFilesList1(fileList) : setFilesList2(fileList)
            info.file.status === 'error' && message.error(`${info.file.name}${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '上传失败'}`);
          }
        },
        onPreview: async file => { //预览
    
          const imageList = filesList
    
          let imageListIndex = 0;
          imageList.map((item, index) => {
            if (item.uid === file.uid) {
              imageListIndex = index;
            }
          });
          if (imageList && imageList[0]) {
            //拼接放大的图片地址列表
            const imgData = [];
            imageList.map((item, key) => {
              imgData.push(item.url)
            })
            setImgUrlList(imgData)
          }
          setPhotoIndex(imageListIndex)
          setPreviewVisible(true)
          setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
        },
        onRemove: (file) => {
          if (!file.error) {
            dispatch({
              type: "autoForm/deleteAttach",
              payload: {
                Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
              }
            })
          }
    
        },
        fileList: type==1? filesList1 : filesList2
      }};
    return (<div className={styles.verificationTaskDetailWrapper}>
        <BreadcrumbWrapper>
            <Card style={{ paddingBottom: 24 }}>
                <Row align='middle'>
                    <span style={{ fontSize: 18, fontWeight: 'bold' }}><img width='28' height='28' src='/programme.png' style={{ marginRight: 12 }} />方案：{'XXX核查方案'}</span>
                    <Button style={{ marginLeft: 16 }} onClick={() => {
                        history.go(-1);
                    }} ><RollbackOutlined />返回上级</Button>
                </Row>
                <Form style={{ paddingLeft: 40, paddingTop: 12 }}>
                    <Row>

                        <Form.Item label="创建人" style={{ paddingRight: 188 }}>
                        </Form.Item>

                        <Form.Item label="企业" >

                        </Form.Item>

                    </Row>
                    <Row>
                        <Form.Item label="创建时间" style={{ paddingRight: 188 }}>

                        </Form.Item>
                        <Form.Item label="排口">

                        </Form.Item>
                    </Row>
                    <Row>
                        <Form.Item label="是否核查" style={{ paddingRight: 188 }}>

                        </Form.Item>
                        <Form.Item label="场景类型">

                        </Form.Item>
                    </Row>
                    <div style={{ position: 'absolute', top: 80, right: 60, textAlign: 'right' }}>
                        <div>状态</div>
                        <div style={{ fontSize: 18 }}>待核查</div>
                    </div>
                </Form>

            </Card>
            <Tabs>
                <Tabs.TabPane tab={'详情'} key={1}>
                    <Card
                        title={<span style={{ fontWeight: 'bold' }}>线索详情</span>}
                    >
                        <SdlTable
                            rowKey={(record, index) => `${index}`}
                            align="center"
                            columns={getColumns()}
                            dataSource={dataSource}
                            loading={queryLoading}
                            scroll={{ y: 'calc(100vh - 410px)' }}
                            pagination={false}

                        />
                    </Card>
                    <Card
                        title={<span style={{ fontWeight: 'bold' }}>方案及核查信息</span>}
                        style={{ marginTop: 8 }}
                    >
                        <Row>
                            <Col span={6}>
                                <Form.Item label="核查状态" style={{ paddingRight: 188 }}>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="核查结论" >
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="核查人" >
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="核查时间" >
                                </Form.Item>
                            </Col>
                        </Row>
                        <div>
                            <Form.Item label="方案及核查信息" >
                                {`在${111}进行了以下检查：`}
                            </Form.Item>
                            <div style={{ paddingLeft: 111 }}>{`查看${111}企业${1111}排口最近一个月数据，如下图所示：`}</div>
                            <img />
                            <div style={{ paddingLeft: 111 }}>{`发现${111}时 至 ${1111} 时排口最近一个`}</div>
                        </div>
                        <Form name='checkAction' form={form} >
                            <div style={{fontSize:16,fontWeight:'bold',padding:'14px 0 10px 69px'}}>核查动作</div>
                            <div  style={{paddingLeft:111}}>
                            <Form.Item label='1.检查室内管管线气密性'>
                                1.去CEMS小屋内，检查室内管线连接处的气密性
                             </Form.Item>
                             <Row>
                            <Col span={16} style={{paddingRight:8}}>
                            <Form.Item label='填写核查结果' name='aaa' rules={[{ required: true, message: `请输入核查结果!` }]}>
                                <Input.TextArea rows={4} placeholder='请输入' />
                            </Form.Item>
                            </Col>
                            <Col span={8}>
                            <Form.Item name='files1'>
                            <Upload {...uploadProps(1)} style={{ width: '100%' }} >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>上传</div>
                                    </div>
                                </Upload>
                                </Form.Item>
                            </Col>
                            </Row>
                            <Form.Item label='2.检查室外管管线气密性'>
                                2.去CEMS小屋外，检查室外管线连接处的气密性
                             </Form.Item>
                             <Row>
                             <Col span={16} style={{paddingRight:8}}>
                            <Form.Item label='填写核查结果' name='aaa' rules={[{ required: true, message: `请输入核查结果!` }]}>
                                <Input.TextArea rows={4} placeholder='请输入' />
                            </Form.Item>
                            </Col>
                            <Col span={8}>
                            <Form.Item name='files2'>
                            <Upload {...uploadProps(2)} style={{ width: '100%' }} >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>上传</div>
                                    </div>
                                </Upload>
                                </Form.Item>
                            </Col>
                            </Row>
                            </div>
                        </Form>
                        <Row style={{ margin: '24px 0' }} justify='end'>
                            <Space>
                                <Button type='primary' onClick={() => { }} >保存</Button>
                                <Button type='primary' onClick={() => { }} >提交</Button>
                            </Space>
                        </Row>
                    </Card>
                </Tabs.TabPane>

            </Tabs>

        </BreadcrumbWrapper>
    </div>
    );
};

export default connect(dvaPropsData)(Index);
