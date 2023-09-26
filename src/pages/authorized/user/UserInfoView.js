/*
 * @Author: lzp
 * @Date: 2019-07-16 09:42:48
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 10:56:46
 * @Description: 用户详情
 */
import React, { Component, Fragment } from 'react'
import { connect } from 'dva';
import { LeftOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Spin, Row, Col } from 'antd';
import AutoFormViewItems from '@/pages/AutoFormManager/AutoFormViewItems'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"

@connect(({ userinfo, loading,global }) => ({
    UserRolesName: userinfo.UserRolesName,
    UserDepName: userinfo.UserDepName,
    userGoDetail:global.userGoDetail,
}))
class UserInfoView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'userinfo/getrolebyuserid',
            payload: {
                User_ID: this.props.match.params.userid,
            }
        })
        this.props.dispatch({
            type: 'userinfo/getdepbyuserid',
            payload: {
                User_ID: this.props.match.params.userid,
            }
        })
        this.props.dispatch({
            type: 'global/updateState',
            payload: {userGoDetail:true},
        })
    }
    render() {
        return (
            <Fragment>
                <BreadcrumbWrapper title="详情">
                    <Card bordered={false} title="详情" extra={
                        <Button
                            style={{ float: "right", marginRight: 10 }}
                            onClick={() => {
                                history.go(-1);
                            }}
                        ><LeftOutlined />返回
                            </Button>
                    }>
                        <AutoFormViewItems
                            configId="UserInfoAdd"
                            keysParams={{ "dbo.Base_UserInfo.User_ID": this.props.match.params.userid }}
                            appendDataSource={[
                                { label: "角色", value: this.props.UserRolesName },
                                { label: "部门", value: this.props.UserDepName }
                            ]}
                        />
                    </Card>
                </BreadcrumbWrapper>
            </Fragment>
        );
    }
}

export default UserInfoView;
