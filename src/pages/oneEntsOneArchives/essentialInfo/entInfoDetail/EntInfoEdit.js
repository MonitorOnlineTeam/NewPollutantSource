/*
 * @Author: 贾安波
 * @Date: 2021-03-17
 * @LastEditors: 
 * @LastEditTime: 2021-03-17
 * @Description: 公司详情
 */
import React, { Component, Fragment } from 'react'
import { connect } from 'dva';
import { LeftOutlined,EditOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Spin, Row, Col } from 'antd';
import AutoFormEdit from '@/pages/AutoFormManager/AutoFormEdit'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"


@connect(({loading }) => ({

}))
class UserInfoView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        
    }
    render() {
        return (
            <Fragment>
                <BreadcrumbWrapper>
                    <Card  bordered={false} title="详情" extra={
                        <>
                        <Button
                            style={{ float: "right", marginRight: 10 }}
                            onClick={() => {
                                history.go(-1);
                            }}
                        ><LeftOutlined />返回
                            </Button>
                        </>
                    }>
                       <AutoFormEdit
                         configId="AEnterpriseTest"
                         keysParams={{ "dbo.T_Bas_Enterprise.EntCode": this.props.location.query.p}}
                         breadcrumb={false}
                        />

                    </Card>
                </BreadcrumbWrapper>
            </Fragment>
        );
    }
}

export default UserInfoView;
