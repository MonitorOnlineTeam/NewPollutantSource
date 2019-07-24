import React, { Component, Fragment } from 'react'
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
import { PageHeaderWrapper } from '@ant-design/pro-layout';

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
                <PageHeaderWrapper title="详情">
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
                </PageHeaderWrapper>
            </Fragment>
        );
    }
}

export default UserInfoView;
