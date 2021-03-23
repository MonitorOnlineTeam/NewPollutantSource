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
import { Input, Button, Card, Spin, Row, Col,Carousel,Upload,Modal  } from 'antd';
import AutoFormViewItems from '@/pages/AutoFormManager/AutoFormViewItems'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import router from 'umi/router';
import styles from '../../entList/style.less'
@connect(({loading }) => ({

}))
class UserInfoView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entCode:'',
            previewVisible:false,
            previewImage:'',
            fileList: [
                {
                  uid: '-1',
                  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
                {
                  uid: '-2',
                  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
                {
                  uid: '-3',
                  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
                {
                  uid: '-4',
                  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
              ]
            
        };
    }

    componentWillMount() {
 
        this.setState({
            entCode:sessionStorage.getItem('oneEntCode')
        })
 
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
  
      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
      });
    };
    render() {
        const { entCode,fileList,previewVisible,previewImage } = this.state;
        return (
            <Fragment>
                <BreadcrumbWrapper>
                    <Card className='entInfoDetail' bordered={false} title="详情" extra={
                        <>
                        <Button
                            style={{ float: "right", marginRight: 10 }}
                            onClick={() => {
                                // history.go(-1);
                                router.push('/oneEntsOneArchives/entList')

                            }}
                        ><LeftOutlined />返回
                            </Button>

                            
                           <Button
                            // ghost
                            style={{ float: "right", marginRight: 10 }}
                            type="primary"
                            onClick={() => {
                                router.push('/oneEntsOneArchives/essentialInfo/entInfoDetail/EntInfoEdit?p='+ entCode)
                            }}
                        ><EditOutlined />编辑
                            </Button>
                        </>
                    }>
                           <Form.Item label="企业照片"  >
                                  <Upload
                                   listType="picture-card"
                                   fileList={fileList}
                                   showUploadList={{showRemoveIcon:false}}
                                   onPreview={this.handlePreview}
                                   onRemove={()=>{return false}}
                                      />
                           </Form.Item>
                           <Modal
                             visible={previewVisible}
                             title={'图片预览'}
                             footer={null}
                             onCancel={this.handleCancel}
                           >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                           </Modal>
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
