import React, { Component, Fragment } from 'react';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Spin, Modal, Button, Divider, Tooltip, Popconfirm } from 'antd';
import { connect } from 'dva';
import cuid from 'cuid';
import SdlTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import SdlForm from '@/pages/AutoFormManager/SdlForm'
import { handleFormData } from '@/utils/utils';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import {
  DelIcon, EditIcon,
} from '@/utils/icon';
/**
 * 排污许可证页面
 * xpy
 * 2019-10-10
 */
@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
    btnisloading: loading.effects['autoForm/add'],
    btnisloading1: loading.effects['autoForm/saveEdit'],

}))
@Form.create()
 class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DataWhere: [],
            visible: false,
            Evisible: false,
            keysParams: null,
            AttachmentID: '',
            ID: '',
        };
    }

    /** 初始化加载 */
    componentDidMount() {
      const {
        configId, EntCode,
      } = this.props.match.params;
    const DataWhere = [{
         Key: '[dbo]__[T_Bas_PDPermit]__EntCode',
         Value: EntCode,
         Where: '$=',
       }];
       this.setState({
         DataWhere,
       }, () => {
         this.reloadPage(configId);
       })
    }

    /** 加载autoform */
    reloadPage = configId => {
        const { dispatch } = this.props;
        dispatch({
            type: 'autoForm/updateState',
            payload: {
                routerConfig: configId,
            },
        });
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId,
            },
        })
    }


    /** 添加 */
    handleOk = e => {
      const {
        dispatch,
        form,
      } = this.props;
      const { configId, EntCode } = this.props.match.params;
      const {
        DataWhere,
      } = this.state;
      form.validateFields((err, values) => {
        if (!err) {
          const formData = handleFormData(values);
          formData.EntCode = EntCode;
          dispatch({
            type: 'autoForm/add',
            payload: {
              configId,
              FormData: formData,
              searchParams: DataWhere,
              callback: result => {
                if (result.IsSuccess) {
                  this.setState({
                    visible: false,
                  })
                }
              },
            },
          });
        }
      });
    };

    /** 编辑 */
    SaveOk = e => {
      const {
        dispatch,
        form,
      } = this.props;
      const { configId, EntCode } = this.props.match.params;
      const {
        DataWhere,
      } = this.state;
      form.validateFields((err, values) => {
        if (!err) {
          const formData = handleFormData(values);
          formData.EntCode = EntCode;
          dispatch({
            type: 'autoForm/saveEdit',
            payload: {
              configId,
              FormData: {
                ...formData,
                ID: this.state.ID,
              },
              callback: result => {
                if (result.IsSuccess) {
                  this.setState({
                    Evisible: false,
                  }, () => {
                    dispatch({
                      type: 'autoForm/getAutoFormData',
                      payload: {
                        configId,
                        searchParams: this.state.DataWhere,
                      },
                    })
                  })
                }
              },
            },
          });
        }
      });
    };

    render() {
        console.log('this.props', this.props);
        const { btnisloading, btnisloading1 } = this.props;
        const { configId, EntName } = this.props.match.params;
        const { DataWhere } = this.state;
        if (this.props.loading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                size="large"
            />);
        }
        return (
          <BreadcrumbWrapper title="排污许可证维护">
              <Card title={
        <span>
          {EntName}
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => {
              history.go(-1);
            }}
            type="link"
            size="small"
          >
            <RollbackOutlined />
            返回上级
          </Button>
        </span>
      }>
                  <SearchWrapper
                      onSubmitForm={form => this.loadReportList(form)}
                      configId={configId}
                  ></SearchWrapper>
                  <SdlTable
                      style={{ marginTop: 10 }}
                      configId={configId}
                      parentcode="ddd"
                      searchParams={DataWhere}
                      appendHandleButtons={(selectedRowKeys, selectedRows) => <Fragment>
                          <Button icon={<PlusOutlined />} type="primary" onClick={() => {
                              this.setState({
                                  visible: true,
                              })
                          }}>添加</Button>
                        </Fragment>}
                         appendHandleRows={row => <Fragment>
                               <Divider type="vertical" />
                               <Tooltip title="编辑">
                                  <a onClick={() => {
                                      const keysParams = {
                                        'dbo.T_Bas_PDPermit.EPID': row['dbo.T_Bas_PDPermit.EPID'],
                                      };
                                      const arr = row['dbo.T_Bas_PDPermit.AttachmentID'] ? row['dbo.T_Bas_PDPermit.AttachmentID'].split('|') : [];

                                      this.setState({
                                        keysParams,
                                        AttachmentID: arr.length > 0 ? arr[arr.length - 2] : '',
                                        ID: row['dbo.T_Bas_PDPermit.EPID'],
                                      }, () => {
                                        this.setState({
                                          Evisible: true,
                                        })
                                      })
                                  }}><EditIcon/></a>
                              </Tooltip>
                          </Fragment>}
                      parentcode = "platformconfig"
                      {...this.props}
                  >
                  </SdlTable>
                  <Modal
                        title="添加"
                        visible={this.state.visible}
                        destroyOnClose // 清除上次数据
                        onOk={this.handleOk}
                        okText="保存"
                        cancelText="关闭"
                        confirmLoading={btnisloading}
                        onCancel={() => {
                          this.setState({
                            visible: false,
                          });
                        }}
                        width="50%"
                      >
                        <SdlForm configId={configId} form={this.props.form} hideBtns noLoad />
                  </Modal>
                   <Modal
                        title="编辑"
                        visible={this.state.Evisible}
                        destroyOnClose // 清除上次数据
                          onOk={this.SaveOk}
                          confirmLoading={btnisloading1}
                        okText="保存"
                        cancelText="关闭"
                        onCancel={() => {
                          this.setState({
                            Evisible: false,
                          });
                        }}
                        width="50%"
                      >
                        <SdlForm configId={configId} onSubmitForm={this.onSubmitForm} form={this.props.form} hideBtns isEdit keysParams={this.state.keysParams} noLoad uid={this.state.AttachmentID}/>
                  </Modal>
              </Card>
          </BreadcrumbWrapper>
        );
    }
}
export default Index;
