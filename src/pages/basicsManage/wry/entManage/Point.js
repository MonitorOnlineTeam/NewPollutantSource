import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import SdlForm from '@/pages/AutoFormManager/SdlForm'
import { Card, Modal, Button, Tooltip, Popconfirm, Divider, Tabs, message } from 'antd'
import { sdlMessage, handleFormData, getRowCuid } from '@/utils/utils';
import { Form } from '@ant-design/compatible';
import { connect } from "dva"
import MonitoringStandard from '@/components/MonitoringStandard';
import { RollbackOutlined } from "@ant-design/icons"
import SiteInfo from "@/components/SiteInfo"
import InstrumentInfo from "./InstrumentInfo"
import { router } from "umi"

const { TabPane } = Tabs;
const CONFIG_ID = "GasOutputNew";
const CONFIG_ID_FORMAT = "GasOutput"

@connect(({ loading, autoForm, common, point, global }) => ({
}))
@Form.create()
class Point extends PureComponent {
  state = {
    modalProps: {},
    activeKey: "1",
    viewVisible: false,
    visible: false,
    searchParams: [{
      Key: 'dbo__T_Cod_MonitorPointBase__BaseCode',
      Value: this.props.match.params.entCode,
      Where: '$=',
    }]
  }

  //  站点信息维护tabchange
  onTabPaneChange = (key) => {
    const { selectedPointCode, FormData } = this.state;
    let modalProps = {};
    if (key !== "1") {
      if (!this.state.selectedPointCode) {
        message.error("请先添加监测点信息！")
        return;
      }
      modalProps = { footer: false }
    }
    this.setState({
      activeKey: key,
      modalProps: modalProps
    })
  }

  // 获取污染物信息
  getWrwInfo = () => {
    const { FormData } = this.state;
    if (FormData)
      return <MonitoringStandard noload DGIMN={FormData["dbo.T_Cod_MonitorPointBase.DGIMN"] || FormData["DGIMN"]}
        pollutantType={FormData["dbo.T_Bas_CommonPoint.PollutantType"] || FormData["PollutantType"]} />
  }

  onSubmitForm = () => {
    const { dispatch, match, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const FormData = handleFormData(values);
        if (!Object.keys(FormData).length) {
          sdlMessage('数据为空', 'error');
          return false;
        }
        if (this.state.isEdit) {
          FormData.PointCode = this.state.keysParams;
        }

        const payload = {
          BaseType: 1,
          TargetId: match.params.entCode,
          Point: FormData,
        };

        console.log("payload=", payload);
        // return;
        dispatch({
          type: !this.state.isEdit ? 'entManage/addPoint' : 'entManage/updatePoint',
          payload: {
            FormData: { ...payload },
          },
          callback: result => {
            if (result.IsSuccess) {
              this.setState({
                selectedPointCode: FormData.DGIMN,
                DGIMN: FormData.DGIMN
              });
              dispatch({
                type: 'autoForm/getAutoFormData',
                payload: {
                  configId: CONFIG_ID,
                  searchParams: this.state.searchParams,
                },
              });
            }
          },
        });
        this.setState({
          FormData: FormData
        })
      }
    });
  }

  render() {
    const { match: { params: { entCode, entName } } } = this.props;
    const { visible, viewVisible, searchParams, activeKey, keysParams, DGIMN, modalProps } = this.state;

    return (
      <BreadcrumbWrapper title="维护排口信息" extraName={entName}>
        <Card title={<>
          {entName}
          <Button type="link" style={{ marginLeft: 10 }} onClick={() => {
            router.push("/basicsManage/wry/entManage")
          }}>
            <RollbackOutlined />
            返回上级
          </Button>
        </>}>
          <SearchWrapper configId={CONFIG_ID} searchParams={searchParams} />
          <AutoFormTable
            getPageConfig
            configId={CONFIG_ID}
            searchParams={searchParams}
            onAdd={() => {
              this.setState({ visible: true, isEdit: false })
            }}
            onView={(record, key) => {
              this.setState({ viewVisible: true, DGIMN: record["dbo.T_Cod_MonitorPointBase.DGIMN"] })
            }}
            onEdit={(row) => {
              this.props.dispatch({
                type: 'autoForm/getFormData',
                payload: {
                  configId: CONFIG_ID_FORMAT,
                  'dbo.T_Bas_CommonPoint.PointCode': row['dbo.T_Bas_CommonPoint.PointCode'],
                },
              });
              this.setState({
                cuid: getRowCuid(row, 'dbo.T_Bas_CommonPoint.Photo'),
                visible: true,
                keysParams: row['dbo.T_Bas_CommonPoint.PointCode'],
                selectedPointCode: row['dbo.T_Bas_CommonPoint.PointCode'],
                isEdit: true,
                FormData: row,
                DGIMN: row["dbo.T_Cod_MonitorPointBase.DGIMN"]
              })
            }}
          />
        </Card>
        <Modal
          width="70%"
          {...modalProps}
          destroyOnClose
          visible={visible}
          onOk={this.onSubmitForm}
          onCancel={() => {
            this.setState({
              visible: false,
              selectedPointCode: undefined,
              keysParams: undefined,
              activeKey: "1",
              FormData: undefined
            })
          }}
        >
          <Tabs activeKey={activeKey} onChange={this.onTabPaneChange}>
            <TabPane tab="添加监测点" key="1">
              <SdlForm
                // corporationCode={this.props.CorporationCode}
                configId={CONFIG_ID_FORMAT}
                onSubmitForm={this.onSubmitForm.bind(this)}
                form={this.props.form}
                // noLoad
                hideBtns
                uid={this.state.cuid}
                isEdit={this.state.isEdit}
                keysParams={{ 'dbo.T_Bas_CommonPoint.PointCode': keysParams }}
              />
            </TabPane>
            {console.log("DGIMN=", DGIMN)}
            <TabPane tab="仪器信息" key="2">
              {
                DGIMN && <InstrumentInfo DGIMN={DGIMN} />
              }
            </TabPane>
            <TabPane tab="污染物信息" key="3">
              {this.getWrwInfo()}
            </TabPane>
          </Tabs>
        </Modal>
        <Modal
          width="80%"
          destroyOnClose
          bodyStyle={{ padding: 0 }}
          visible={viewVisible}
          footer={false}
          onCancel={() => {
            this.setState({
              viewVisible: false,
            })
          }}
        >
          <SiteInfo DGIMN={DGIMN} />
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default Point;