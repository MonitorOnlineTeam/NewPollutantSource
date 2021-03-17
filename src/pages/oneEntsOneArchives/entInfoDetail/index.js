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
import AutoFormViewItems from '@/pages/AutoFormManager/AutoFormViewItems'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import router from 'umi/router';
@connect(({loading }) => ({

}))
class UserInfoView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entCode:''  
        };
    }

    componentWillMount() {
        this.setState({
            entCode:this.props.location.query.p
        })
 
    }
    render() {
        const { entCode } = this.state;
        return (
            <Fragment>
                <BreadcrumbWrapper>
                    <Card bordered={false} title="详情" extra={
                        <>
                        <Button
                            style={{ float: "right", marginRight: 10 }}
                            onClick={() => {
                                history.go(-1);
                            }}
                        ><LeftOutlined />返回
                            </Button>

                            
                           <Button
                            // ghost
                            style={{ float: "right", marginRight: 10 }}
                            type="primary"
                            onClick={() => {
                                router.push('/oneEntsOneArchives/entInfoDetail/entInfoEdit?p='+ entCode)
                            }}
                        ><EditOutlined />编辑
                            </Button>
                        </>
                    }>
                         <AutoFormViewItems
                            configId="AEnterpriseTest"
                            keysParams={{ "dbo.T_Bas_Enterprise.EntCode": entCode }}
                        /> 
                    </Card>
                </BreadcrumbWrapper>
            </Fragment>
        );
    }
}

export default UserInfoView;
