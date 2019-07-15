import React, { Component,Fragment } from 'react'
import { connect } from 'dva';
import {
    Form,
    Input,
    Button,
    Icon,
    Card,
    Spin,
    Row,
    Col,
  } from 'antd';
import AutoFormViewItems from '@/components/AutoForm/AutoFormViewItems'
import MonitorContent from '@/components/MonitorContent';
@connect(({ userinfo, loading }) => ({
    UserRolesName: userinfo.UserRolesName,
    UserDepName: userinfo.UserDepName
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
    }
    render() {
        return (
            <Fragment>
                {
                    <MonitorContent breadCrumbList={
                        [
                            { Name: '首页', Url: '/' },
                            { Name: '权限管理', Url: '' },
                            { Name: '用户管理', Url: '/rolesmanager/userinfoindex/UserInfo' },
                            { Name: '详情', Url: '' }
                        ]
                    }
                    >
                        <Card bordered={false} title="详情" extra={
                            <Button
                                style={{ float: "right", marginRight: 10 }}
                                onClick={() => {
                                    history.go(-1);
                                }}
                            ><Icon type="left" />返回
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
                    </MonitorContent>
                }
                
            </Fragment>
        );
    }
}

export default UserInfoView;