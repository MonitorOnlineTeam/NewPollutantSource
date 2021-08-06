import React, { Component, Fragment } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Spin, Modal, Button, Divider, Tooltip, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import SdlTable from '../../../AutoFormManager/AutoFormTable';
import SearchWrapper from '../../../AutoFormManager/SearchWrapper';
import SdlForm from '@/pages/AutoFormManager/SdlForm'
import { getRowCuid,handleFormData } from '@/utils/utils';
import {
  DelIcon,EditIcon
} from '@/utils/icon';
import { getAttachmentDataSource } from '@/pages/AutoFormManager/utils'

@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
    btnloading: loading.effects['operationsysmanage/addoutputstop'],
    btnloading1: loading.effects['operationsysmanage/editoutputstop'],
}))
@Form.create()
 class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DataWhere: [],
            visible: false,
            ID: '',
            Evisible:false,
        };
    }

    componentDidMount() {
      const {
        configId,
      } = this.props;
      this.reloadPage(configId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.DGIMN !== this.props.DGIMN) {
            {
               const { dispatch, configId } = this.props;
               const DataWhere = [{
                     Key: '[dbo]__[T_Bas_OutputStop]__DGIMN',
                     Value: nextProps.DGIMN,
                     Where: '$=',
                   },
                 ];
                 this.setState({
                     DataWhere,
                 }, () => {
                    //  dispatch({
                    //    type: 'autoForm/getAutoFormData',
                    //    payload: {
                    //     configId,
                    //     searchParams: this.state.DataWhere,
                    //    },
                    //  })
                 })
            }
        }
    }

    reloadPage = () => {
        const { dispatch, configId, DGIMN } = this.props;
        const DataWhere = [{
          Key: '[dbo]__[T_Bas_OutputStop]__DGIMN',
          Value: DGIMN,
          Where: '$=',
        },
      ];

        this.setState({
          DataWhere,
      }, () => {
        dispatch({
          type: 'autoForm/getPageConfig',
          payload: {
              configId,
          },
      })
      })
    }

    /** 逻辑删除 */
    delete=ID => {
        const { dispatch, configId } = this.props;
        dispatch({
            type: 'operationsysmanage/deleteoutputstop',
            payload: {
                configId,
                ID,
                searchParams: this.state.DataWhere,
            },
        });
    }

    /** 保存 */
    handleOk = e => {
      const {
        dispatch,
        form,
        DGIMN,
        configId,
      } = this.props;
      form.validateFields((err, values) => {
        if (!err) {
          const formData = handleFormData(values);
          formData.DGIMN = DGIMN;
          dispatch({
            type: 'operationsysmanage/addoutputstop',
            payload: {
              FormData: formData,
              callback: result => {
                  if (result.IsSuccess) {
                      this.setState({
                          visible: false,
                      }, () => {
                          dispatch({
                            type: 'autoForm/getAutoFormData',
                            payload: {
                              configId,
                              searchParams: this.state.DataWhere,
                            },
                          })
                      })
                  } else {
                    message.error(result.Message, 3);
                  }
              },
            },
          });
        } else {
            console.log('err', err);
        }
      });
    };
    SaveOk = e => {
      const {
        dispatch,
        form,
        DGIMN,
        configId,
      } = this.props;
      form.validateFields((err, values) => {
        if (!err) {
          const formData = handleFormData(values);
          formData.DGIMN = DGIMN;
          formData.OutputStopID=this.state.ID;
          console.log("formData",formData);
          dispatch({
            type: 'operationsysmanage/editoutputstop',
            payload: {
              FormData: formData,
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
                  } else {
                    message.error(result.Message, 3);
                  }
              },
            },
          });
        } else {
            console.log('err', err);
        }
      });
    };


    render() {
        console.log('this.props', this.props);
        const { configId, btnloading, btnloading1 } = this.props;
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
            <div>
                <Card>
                    <SearchWrapper
                        onSubmitForm={form => this.loadReportList(form)}
                        configId={configId}
                        searchParams={this.state.DataWhere}
                    ></SearchWrapper>
                    {DataWhere[0]&&<SdlTable
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
                                <Tooltip title="删除">
                                <Popconfirm
                                    title="确认要删除吗?"
                                    onConfirm={() => {
                                    this.delete(
                                        row['dbo.T_Bas_OutputStop.OutputStopID'],
                                    );
                                    }}
                                    onCancel={this.cancel}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <a href="#"><DelIcon /></a>
                                </Popconfirm>
                                </Tooltip>
                                <Divider type="vertical" />
                                  <Tooltip title="编辑">
                                   <a onClick={()=>{
                                      const cuid = getRowCuid(row, "dbo.T_Bas_OutputStop.Attachment")
                                      this.setState({
                                        Evisible: true,
                                        cuid:cuid,
                                        ID:row['dbo.T_Bas_OutputStop.OutputStopID'],
                                    })
                                   }}><EditIcon/></a>
                                  </Tooltip>
                            </Fragment>}
                        {...this.props}
                    >
                    </SdlTable>}
                    <Modal
                          title="添加"
                          visible={this.state.visible}
                          destroyOnClose // 清除上次数据
                          onOk={this.handleOk}
                          confirmLoading={btnloading}
                          okText="保存"
                          cancelText="关闭"
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
                          confirmLoading={btnloading1}
                          okText="保存"
                          cancelText="关闭"
                          onCancel={() => {
                            this.setState({
                              Evisible: false,
                            });
                          }}
                          width="50%"
                        >
                          <SdlForm configId={configId} form={this.props.form} isEdit hideBtns noLoad uid={ this.state.cuid } keysParams={{'dbo.T_Bas_OutputStop.OutputStopID':this.state.ID}}/>
                    </Modal>
                </Card>
            </div>
        );
    }
}
export default Index;
