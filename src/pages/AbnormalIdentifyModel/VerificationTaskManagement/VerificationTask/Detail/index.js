/*
 * @Author: jab
 * @Date: 2024-01-29
 * @Description：待核查任务 已核查任务
 */

import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Select, Badge, Tooltip, Input, Radio, Modal, Row, message, Popover, Table, Collapse, Cascader, Upload, Col, Tabs, Skeleton, Tag } from 'antd';
import styles from '../../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { cookieName, uploadPrefix } from '@/config'
import cuid from 'cuid'
import ImageView from '@/components/ImageView';
import CustomUpload from './CustomUpload';

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
    queryLoading: loading.effects['AbnormalIdentifyModel/GetCheckedView'],
    saveLoading: loading.effects['AbnormalIdentifyModel/UpdatePlanItem'],
    preTakeFlagDatasLoading: loading.effects['AbnormalIdentifyModel/GetPreTakeFlagDatas'],
    checkConfirmLoading: loading.effects['AbnormalIdentifyModel/CheckConfirm'],
});

const Index = props => {
    const [form] = Form.useForm();
    const [form2] = Form.useForm();


    const {
        dispatch,
        queryLoading,
        verificationTaskData,
        history,
        history: { location: { query: { id, type } } },
        saveLoading,
        preTakeFlagDatasLoading,
        checkConfirmLoading,
    } = props;
    const [dataSource, setDataSource] = useState([]);
    const [preTakeFlagDatas, setPreTakeFlagDatas] = useState([]) //专家意见

    useEffect(() => {
        initData();
        props.dispatch({
            type: 'AbnormalIdentifyModel/updateState',
            payload: { verificationTaskData: { ...verificationTaskData, type: 2 } },
        });
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
                    return index + 1;
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
                title: '发现线索时间',
                dataIndex: 'WarningTime',
                key: 'WarningTime',
                width: 180,
                ellipsis: true,
                sorter: (a, b) => moment(a.WarningTime).valueOf() - moment(b.WarningTime).valueOf(),
            },
            {
                title: '场景类别',
                dataIndex: 'WarningTypeName',
                key: 'WarningTypeName',
                width: 180,
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
                title: '核实结果',
                dataIndex: 'CheckedResult',
                key: 'CheckedResult',
                width: 120,
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
                                    router.push(
                                        `/AbnormalIdentifyModel/CluesList/CluesDetails/${record.ModelCheckedGuid}`,
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
    const initData = () => {
        const values = form.getFieldsValue();
        props.dispatch({
            type: 'AbnormalIdentifyModel/GetCheckedView',
            payload: {
                id: id
            },
            callback: res => {
                setDataSource(res);
                if(type==1){ //待核查
                    res?.Plan?.PlanItem.map(item => {
                        form.setFieldsValue({
                            [`reContent_${item.ID}`] : item.ReContent,
                            [`reAttachment_${item.ID}`] : item.ReAttachment?.AttachID,
                        })
                    })
                }
                if(type==2){//待确认
                dispatch({
                    type: 'AbnormalIdentifyModel/GetPreTakeFlagDatas',
                    payload: {},
                    callback: res => {
                        setPreTakeFlagDatas(res);
                    }
                });
             }
            },
        });
    };

    const save = async (type) => {
        const values = await form.validateFields();
        const parData = {
            stype: type,
            modelCheckedGuid: id,
            planItems: dataSource?.Plan?.PlanItem.map(item => {
                return {
                    modelPlanItemGuid: item.ID,
                    reContent: values[`reContent_${item.ID}`] ? values[`reContent_${item.ID}`] : '',
                    reAttachment: values[`reAttachment_${item.ID}`] ? values[`reAttachment_${item.ID}`] : '',
                }
            })
        }
        props.dispatch({
            type: 'AbnormalIdentifyModel/UpdatePlanItem',
            payload: {
                ...parData,
            },
            callback: res => {
                history.go(-1);
            },
        });
    }
    const [checkVisible, setCheckVisible] = useState(false)
    const checkOk = async () => {
        const values = await form2.validateFields();
        props.dispatch({
            type: 'AbnormalIdentifyModel/CheckConfirm',
            payload: {
                modelCheckedGuid: id,
                ...values,
                flag: values.flag?.length ? values.flag[values.flag.length - 1] : undefined,
            },
            callback: res => {
                setCheckVisible(false)
                history.go(-1);
                //router.push('/AbnormalIdentifyModel/VerificationTaskManagement/AlreadyVerifiedTask')
            },
        });
    }
    const SeeUploadComponents = ({ item }) => {
        return <div>
            <Upload {...seeUploadProps(item ? item : [])} style={{ width: '100%' }} />
        </div>
    }
    const [previewVisible, setPreviewVisible] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0); //预览图片Index
    const [imgUrlList, setImgUrlList] = useState([]);//预览图片列表
    //返回的核查动作图片
    const seeUploadProps = (imgList) => {
        const imgLists = imgList.map(item => {
            return {
                uid: cuid(),
                status: 'done',
                url: `/${item}`,
            }
        })
        return {
            listType: "picture-card",
            showUploadList: { showPreviewIcon: true, showRemoveIcon: false },
            onPreview: file => { //预览
                const imageList = imgLists
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
            },
            fileList: imgLists
        }
    };
    const handleFileChange = (key, fileResponse) => {
        // 更新表单域的值
        form.setFieldsValue({ [key]: fileResponse });
    };
    const checkStatus = {
        核查完成: <Tag color="success">核查完成</Tag>,
        待确认: <Tag color="processing">待确认</Tag>,
        待核查: <Tag color="error">待核查</Tag>,
    }
    const isRectificationRecord = dataSource?.checkInfo?.IsRectificationRecord == 1; //需要现场核查
    return (<div className={styles.verificationTaskDetailWrapper}>
        <BreadcrumbWrapper>
            <Card style={{ paddingBottom: 24 }}>
                {queryLoading ? <Skeleton avatar paragraph={{ rows: 4 }} />
                    :
                    <>
                        <Row align='middle'>
                            <span style={{ fontSize: 18, fontWeight: 'bold' }}><img width='28' height='28' src='/programme.png' style={{ marginRight: isRectificationRecord == 1 ? 12 : 0 }} />{isRectificationRecord == 1 && <>方案：{dataSource?.Plan?.PlanName}</>}</span>
                            <Button style={{ marginLeft: 16 }} onClick={() => {
                                history.go(-1);
                            }} ><RollbackOutlined />返回上级</Button>
                        </Row>
                        <Form style={{ paddingLeft: 40, paddingTop: 12 }}>
                            <Row>

                                <Form.Item label="创建人" style={{ width: 300, paddingRight: 16 }}>
                                    {dataSource?.checkInfo?.CreateUserName}
                                </Form.Item>

                                <Form.Item label="企业" >
                                    {dataSource?.checkInfo?.EntName}
                                </Form.Item>

                            </Row>
                            <Row>
                                <Form.Item label="创建时间" style={{ width: 300, paddingRight: 16 }}>
                                    {dataSource?.checkInfo?.CreateTime}
                                </Form.Item>
                                <Form.Item label="排口">
                                    {dataSource?.checkInfo?.PointName}
                                </Form.Item>
                            </Row>
                            <Row>
                                <Form.Item label="是否核查" style={{ width: 300, paddingRight: 16 }}>
                                    {dataSource?.checkInfo?.IsRectificationRecordName}
                                </Form.Item>
                                <Form.Item label="场景类型">
                                    {dataSource?.checkInfo?.WarningTypeName}
                                </Form.Item>
                            </Row>
                            <div style={{ position: 'absolute', top: 80, right: 60, textAlign: 'right' }}>
                                <div>状态</div>
                                <div style={{ fontSize: 18 }}>{dataSource?.checkInfo?.StatusName}</div>
                            </div>
                        </Form>
                    </>
                }
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
                            dataSource={dataSource?.finalResult}
                            loading={queryLoading}
                            scroll={{ y: 240 }}
                            pagination={false}

                        />
                    </Card>
                    <Card
                        title={<span style={{ fontWeight: 'bold' }}>方案及核查信息</span>}
                        style={{ marginTop: 8 }}
                    >
                        {queryLoading ? <Skeleton paragraph={{ rows: 4 }} />
                            :
                            <>
                                <Row>
                                    <Col span={6}>
                                        <Form.Item label="核查状态">
                                            {checkStatus[dataSource?.checkInfo?.StatusName]}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item className='checkedDesLabel' label="核查结论" >
                                            {dataSource?.checkInfo?.CheckedDes  || '-'}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item label="核查人" >
                                            {dataSource?.checkInfo?.CheckUserName  || '-'}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item label="核查时间" >
                                            {dataSource?.checkInfo?.CheckedTime  || '-'}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {isRectificationRecord == 1 ? <> <Form.Item label="方案及核查信息" className='programmeLabel' >
                                    <div dangerouslySetInnerHTML={{ __html: dataSource?.Plan?.ContentBody }}></div>
                                </Form.Item>
                                    <Form name='checkAction' form={form} layout='vertical'>
                                        <div style={{ fontSize: 16, fontWeight: 'bold', padding: '12px 0 10px 69px' }}>核查动作</div>
                                        <div style={{ paddingLeft: 112 }}>
                                            {dataSource?.Plan?.PlanItem.map((item, index) => {
                                                const cuids = item.ReAttachment?.AttachID ? item.ReAttachment.AttachID : cuid();
                                                const fileList = item.ReAttachment?.ImgList?.map(item => {
                                                    return {
                                                        uid: cuids,
                                                        status: 'done',
                                                        url: `/${item}`,
                                                    }
                                                })
                                                return <div style={{ paddingBottom: 12 }}>
                                                    <Form.Item label={`${index + 1}.${item.QTitle}`}>
                                                        {item.QContent}
                                                    </Form.Item>
                                                    {item.QAttachment?.ImgList?.[0] && <div>
                                                        <SeeUploadComponents item={item.QAttachment?.ImgList} />
                                                    </div>}
                                                    <Row>
                                                        <Col span={type == 1 ? 16 : 12} style={{ paddingRight: 8 }}>
                                                            <Form.Item label='填写核查结果' name={`reContent_${item.ID}`} rules={[{ required: type == 1 ? true : false, message: `请输入核查结果!` }]}>
                                                                {type == 1 ? <Input.TextArea rows={4} placeholder='请输入' /> : item.ReContent}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={type == 1 ? 8 : 12}>
                                                            <div style={{ marginTop: 30 }}>
                                                                {type == 1 ?
                                                                    <CustomUpload fileListData={fileList} key={index} name={`reAttachment_${item.ID}`} uid={cuids} onFileChange={(k, res) => handleFileChange(k, res)} />
                                                                    :
                                                                    <SeeUploadComponents item={item.ReAttachment?.ImgList} />
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            })
                                            }

                                        </div>

                                    </Form>
                                </>
                                    :
                                    <>
                                    <Form.Item label="核查结果与线索是否符合"  >
                                     {dataSource?.checkInfo?.CheckResult}
                                   </Form.Item>
                                    <Form.Item label="核查原因" className='programmeLabel2' >
                                        <div dangerouslySetInnerHTML={{ __html: dataSource?.checkInfo?.UntruthReason }}></div>
                                    </Form.Item>
                                  </>

                                }
                                {(type == 1 || type == 2) && <Row style={{ margin: '12px 0 24px 0' }} justify='end'>
                                    {type == 1 ?
                                        <Space>
                                            <Button type='primary' loading={saveLoading} onClick={() => { save(1) }} >保存</Button>
                                            <Button type='primary' loading={saveLoading} onClick={() => { save(2) }} >提交</Button>
                                        </Space>
                                        :
                                        <Button type='primary' loading={saveLoading} onClick={() => { setCheckVisible(true); form2.resetFields() }} >核查</Button>

                                    }

                                </Row>}
                            </>
                        }
                    </Card>
                </Tabs.TabPane>

            </Tabs>
            <Modal title="核实" confirmLoading={checkConfirmLoading} visible={checkVisible} onCancel={() => { setCheckVisible(false); form2.resetFields() }} onOk={checkOk}>
                <Form name='check' form={form2} >
                    <Form.Item name='checkedResult' label="与线索是否符合" rules={[{ required: true, message: '请选择与线索是否符合!' }]}>
                        <Radio.Group>
                            <Radio value={1}>符合</Radio>
                            <Radio value={2}>部分符合</Radio>
                            <Radio value={3}>不符合</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Spin spinning={!!preTakeFlagDatasLoading} size="small" style={{ width: '100%', top: -12 }}>
                        <Form.Item name='flag' label="专家意见" rules={[{ required: true, message: '请选择标记!' }]}>
                            <Cascader showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} fieldNames={{ label: 'FlagName', value: 'FlagCode', children: 'ChildrenFlags' }} options={preTakeFlagDatas} placeholder="请选择标记" />
                        </Form.Item>
                    </Spin>
                    <Form.Item label="核查结论" name='checkedDes' rules={[{ required: true, message: '请输入核查结论!' }]}>
                        <Input.TextArea placeholder='请输入' />
                    </Form.Item>
                </Form>
            </Modal>
            <ImageView
                isOpen={previewVisible}
                images={imgUrlList?.length ? imgUrlList : []}
                imageIndex={photoIndex}
                onCloseRequest={() => {
                    setPreviewVisible(false);
                }}
            />
        </BreadcrumbWrapper>
    </div>
    );
};

export default connect(dvaPropsData)(Index);
