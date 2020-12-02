import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import SdlForm from '@/pages/AutoFormManager/SdlForm'
import { Card, Modal, Button, Tooltip, Popconfirm, Divider, message } from 'antd'
import { Form } from '@ant-design/compatible';
import { connect } from 'dva';
import cuid from 'cuid'
import { handleFormData } from '@/utils/utils'
import Cookie from 'js-cookie';
import moment from 'moment'
import { ProfileOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons'
import OpenFileModal from '../OpenFileModal'

const CONFIG_ID = "KBMManger"

@connect(({ KBS, loading }) => ({
  viewFileModalVisible: KBS.viewFileModalVisible,
}))
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


  onOpenViewFileModal = () => {
    // this.props.dispatch({
    //   type: "KBS/updateState",
    //   payload: {
    //     viewFileModalVisible: true
    //   }
    // })
    this.setState({
      openFileVisible: true
    })
  }

  updViewForKBM = (id, type) => {
    this.props.dispatch({
      type: "KBS/updViewForKBM",
      payload: {
        ID: id,
        Type: type
      },
      callback: () => {
        this.reloadTable()
      }
    })
  }

  reloadTable = () => {
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: CONFIG_ID,
        searchParams: this.state.searchParams,
      },
    })
  }

  onViewFile = (data) => {
    let file = data["dbo.T_Bas_Repository.Attachment"]
    if (file) {
      let fileName = file.split("|")[0];
      if (fileName) {
        let suffix = fileName.split(".")[1];
        this.setState({
          fileType: suffix,
          filePath: fileName
        }, () => {
          this.onOpenViewFileModal()
        })
        let id = data["dbo.T_Bas_Repository.ID"];
        this.updViewForKBM(id, "view")
      } else {
        message.error("文件不存在！")
      }
    } else {
      message.error("文件不存在！")
    }
  }

  onDownload = (data) => {
    let file = data["dbo.T_Bas_Repository.Attachment"]
    if (file) {
      let fileName = file.split("|")[0];
      if (fileName) {
        let suffix = fileName.split(".")[1];
        let id = data["dbo.T_Bas_Repository.ID"];
        this.updViewForKBM(id, "down")
        window.open(`/upload/${fileName}`);
      } else {
        message.error("文件不存在！")
      }
    } else {
      message.error("文件不存在！")
    }
  }

  render() {
    const { visible, fileType, filePath, openFileVisible } = this.state;
    const { form, viewFileModalVisible } = this.props;
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
                    <a onClick={() => this.onViewFile(row)}><SearchOutlined style={{ fontSize: 16 }} /></a>
                  </Tooltip>
                  <Divider type="vertical" />
                  <Tooltip title="下载">
                    <a onClick={() => this.onDownload(row)}><DownloadOutlined style={{ fontSize: 16 }} /></a>
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
        {openFileVisible && <OpenFileModal fileType={fileType} filePath={filePath} onClose={() => {
          this.setState({
            openFileVisible: false
          })
        }} />}
      </BreadcrumbWrapper>
    );
  }
}

export default index;