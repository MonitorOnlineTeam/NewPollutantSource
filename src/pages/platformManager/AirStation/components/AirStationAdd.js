import React, { Component } from 'react';
import { Input, Select, InputNumber, Form, Button, Upload, DatePicker, Row, Col, message, Popover, Icon, Radio, Tabs, Divider, Card } from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import moment from 'moment';
import SdlForm from './SdlForm'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { handleFormData } from '@/utils/utils';
import { router } from 'umi';
const Option = Select.Option;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const ButtonGroup = Button.Group;
@connect(({ surfaceWater, loading }) => ({
    rowmodel: surfaceWater.rowmodel,
}))

// @connect()

/**
 * 功  能：添加空气站点位信息
 * 创建人：dongxiaoyun
 * 创建时间：2020.8.17
 */
@Form.create()
export default class AirStationAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabKey: '1',
        };
    }
    componentWillMount() {
        const { dispatch, row } = this.props;
        dispatch({
            type: 'BaseSetting/GetMonitorPointTypeList',
            payload: {
            },
        });
    }
    //添加
    onSubmitForm = () => {
        let { form, dispatch } = this.props;
        const { configId } = this.props.match.params;
        form.validateFields((err, values) => {
            if (!err) {
                const formData = handleFormData(values);
                dispatch({
                    type: 'surfaceWater/AddPoint',
                    payload: {
                        PointName: formData.PointName,
                        DGIMN: formData.DGIMN,
                        Longitude: formData.Longitude,
                        Latitude: formData.Latitude,
                        RegionCode: formData.RegionCode,
                        UpdateDate: formData.UpdateDate,
                        Col1: formData.Col1,
                        PollutantType: 27,
                        callback: result => {
                            if (result.Datas === 1) {
                                dispatch({
                                    type: 'autoForm/getAutoFormData',
                                    payload: {
                                        configId,
                                    },
                                })
                                message.success("添加成功!")
                                router.push(`/basicInfo/AirStation/AirStation`)
                            }
                            else if (result.Datas === 2) {
                                message.error("添加重复,请检查编号!");
                            }
                            else {
                                message.error("添加失败!");
                            }
                        },
                    },
                });
            }
        });
    }
    //修改
    onUpdateForm = () => {
        let { form, dispatch, rowmodel } = this.props;
        const { configId } = this.props.match.params;
        form.validateFields((err, values) => {
            if (!err) {
                const formData = handleFormData(values);
                dispatch({
                    type: 'surfaceWater/UpdatePoint',
                    payload: {
                        PointCode: rowmodel['dbo.T_Bas_CommonPoint.PointCode'],
                        PointName: formData.PointName,
                        DGIMN: formData.DGIMN,
                        SurfaceWaterLevel: formData.SurfaceWaterLevel,
                        Longitude: formData.Longitude,
                        Latitude: formData.Latitude,
                        RegionCode: formData.RegionCode,
                        UpdateDate: formData.UpdateDate,
                        PollutantType: 27,
                        Col1: formData.Col1,
                        callback: result => {
                            if (result.Datas === 1) {
                                dispatch({
                                    type: 'autoForm/getAutoFormData',
                                    payload: {
                                        configId,
                                    },
                                })
                                message.success("修改成功!")
                                router.push(`/basicInfo/AirStation/AirStation`)
                            }
                            else if (result.Datas === 2) {
                                message.error("修改重复,请检查编号!");
                            }
                            else {
                                message.error("修改失败!");
                            }
                        },
                    },
                });
            }
        });
    }
    render() {
        const { configId } = this.props.match.params;
        const { rowmodel } = this.props;
        const keysParams = {
            'dbo.T_Bas_CommonPoint.PointCode': rowmodel ? rowmodel['dbo.T_Bas_CommonPoint.PointCode'] : ''
        };
        debugger
        return (
            <BreadcrumbWrapper title={(rowmodel && rowmodel != 'null') ? '编辑水站信息' : '添加水站信息'}>
                <Card>
                    <Tabs activeKey={this.state.tabKey}>
                        <TabPane tab="基本信息" key="1">
                            {rowmodel && rowmodel != 'null' ?
                                <SdlForm configId={configId} form={this.props.form} hideBtns isEdit keysParams={keysParams} noLoad />
                                :
                                // onSubmitForm={this.onSubmitForm}
                                <SdlForm configId={configId} form={this.props.form} hideBtns noLoad />
                            }
                            {
                                rowmodel && rowmodel != 'null' ?
                                    <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                                        <ButtonGroup>
                                            <Button type="primary"
                                                onClick={this.onUpdateForm}
                                            >
                                                <Icon type="left" />
                                                保存
                                            </Button>
                                            <Button onClick={() => {
                                                router.push(`/basicInfo/AirStation/'${configId}'`)
                                            }}>
                                                返回
                                             <Icon type="right" />
                                            </Button>
                                        </ButtonGroup>
                                    </Divider> :
                                    <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                                        <ButtonGroup>
                                            <Button type="primary"
                                                onClick={this.onSubmitForm}
                                            >
                                                <Icon type="left" />
                                                保存
                                            </Button>
                                            <Button onClick={() => {
                                                router.push(`/basicInfo/AirStation/${configId}`)
                                            }}>
                                                返回
                                            <Icon type="right" />
                                            </Button>
                                        </ButtonGroup>
                                    </Divider>
                            }
                        </TabPane>
                        <TabPane tab="污染物信息" key="2">
                        </TabPane>
                    </Tabs>
                </Card>


            </BreadcrumbWrapper>

        );
    }
}
