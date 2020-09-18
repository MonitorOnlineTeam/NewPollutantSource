import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import SdlForm from '@/pages/AutoFormManager/SdlForm'
import { Card, Modal, Button, Tooltip, Popconfirm, Divider } from 'antd'
import { Form } from '@ant-design/compatible';
import { connect } from 'dva';
import cuid from 'cuid'
import { handleFormData } from '@/utils/utils'
import Cookie from 'js-cookie';
import moment from 'moment'
import { ProfileOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons'

const CONFIG_ID = "KBMManger"

@connect()
@Form.create()
class index extends PureComponent {
  state = {
    visible: false,
    cuid: cuid(),
  }

  onSubmitForm = () => {
    const { form, dispatch } = this.props;
    const { cuid } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const userCookie = Cookie.get('currentUser');
        const user = JSON.parse(userCookie);
        let formData = handleFormData(values, cuid)
        dispatch({
          type: 'autoForm/add',
          payload: {
            configId: CONFIG_ID,
            FormData: {
              "CreateUserID": user.User_ID,
              CreateDate: moment().format('YYYY-MM-DD HH:mm:ss'),
              Views: 0,
              Downloads: 0,
              ...formData,
            },
            callback: (res) => {
              this.setState({ visible: false })
            }
          }
        });
      }
    });
  }

  render() {
    const { visible } = this.state;
    const { form } = this.props;
    return (
      <BreadcrumbWrapper>
        <Card>
          <SearchWrapper configId={CONFIG_ID} />
          <AutoFormTable
            getPageConfig
            configId={CONFIG_ID}
            onAdd={() => {
              this.setState({ visible: true })
            }}
            appendHandleRows={(row) => {
              return (
                <>
                  <Divider type="vertical" />
                  <Tooltip title="查看">
                    <a href="#"><SearchOutlined style={{ fontSize: 16 }} /></a>
                  </Tooltip>
                  <Divider type="vertical" />
                  <Tooltip title="下载">
                    <a href="#"><DownloadOutlined style={{ fontSize: 16 }} /></a>
                  </Tooltip>
                </>
              )
            }}
          />
        </Card>
        <Modal
          title="添加知识库"
          visible={visible}
          destroyOnClose
          bodyStyle={{ padding: 0 }}
          onOk={this.onSubmitForm}
          onCancel={() => { this.setState({ visible: false }) }}
        >
          <SdlForm
            configId={CONFIG_ID}
            colSpan={24}
            hideBtns
            form={form}
          >
          </SdlForm>
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default index;