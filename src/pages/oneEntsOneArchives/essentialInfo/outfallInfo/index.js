/*
 * @Author: 贾安波
 * @Date: 2021-03-22
 * @LastEditors: 
 * @LastEditTime: 2021-03-22
 * @Description: 排污口信息管理
 */
import React, { Component, Fragment } from 'react'
import { connect } from 'dva';
import { LeftOutlined,EditOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Spin, Row, Col } from 'antd';
import AutoFormViewItems from '@/pages/AutoFormManager/AutoFormViewItems'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import router from 'umi/router';
import ContentPages from './point'
// import ContentPages from '@/pages/platformManager/point'
@connect(({loading }) => ({

}))
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entCode:''  
        };
    }

    componentWillMount() {
     
    }
    render() {
            const entCode = sessionStorage.getItem('oneEntCode')
            const entName = sessionStorage.getItem('oneEntName')
        return (
            <Fragment> 
                <ContentPages  location= { {query:{tabName:'排污口信息管理'}} }  match= { {params:{targetName:entName, configId:'AEnterpriseTest', pollutantTypes:'1,2,5,6,12',targetId:entCode,targetType:'1'}} }/>
            </Fragment>
        );
    }
}

export default Index;
