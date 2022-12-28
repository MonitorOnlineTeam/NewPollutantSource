/**
 * 功  能：72小时调试检测 生成时间
 * 创建人：jab
 * 创建时间：2022.12.28
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Tabs, Empty, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import Cookie from 'js-cookie';
const namespace = 'hourCommissionTest'




const dvaPropsData = ({ loading, hourCommissionTest, commissionTest, }) => ({
    loading: loading.effects[`${namespace}/usePMReferenceTimes`],

})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        usePMReferenceTimes: (payload,callback) => {
            dispatch({
                type: `${namespace}/usePMReferenceTimes`,
                payload: payload,
                callback:callback,
            })
        },
    }
}


const Index = (props) => {

      const { loading, pointId, pollutantCode, } = props;

    useEffect(() => {
    }, [])

    const generateTimeClick = () => {
        props.usePMReferenceTimes({
            PointCode: pointId,
            pollutantCode: pollutantCode,
            RecordDate: "",
            Flag: ""
        },(data)=>{
            props.generateTimeData(data)
        })
    }

    return (
        <div >

            <Popconfirm placement="right" title={'采样时间是否于颗粒物采样时间相同?'} onConfirm={generateTimeClick}>
                <Button loading={loading}>采样时间</Button>
            </Popconfirm>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);