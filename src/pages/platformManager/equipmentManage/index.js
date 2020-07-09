import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Card, Tag, Modal } from 'antd';
import NavigationTree from '@/components/NavigationTree';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import { connect } from 'dva';
import { router } from 'umi';

@connect()
class EquipmentManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: null,
    };
    this._SELF_ = {
      configId: 'Equipment',
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: this._SELF_.configId,
      },
    });
  }

  render() {
    const { configId } = this._SELF_;
    const { DGIMN } = this.state;
    return (
      <>
        <NavigationTree
          choice={false}
          onItemClick={value => {
            console.log('value=', value);
            if (value && value[0]) {
              this.setState({
                DGIMN: value[0].key,
              });
            }
          }}
        />
        <div id="contentWrapper">
          <BreadcrumbWrapper>
            <Card>
              {DGIMN && (
                <AutoFormTable
                  configId={configId}
                  searchParams={[
                    {
                      Key: 'dbo.T_Bas_Equipment.DGIMN',
                      Value: DGIMN,
                      Where: '$=',
                    },
                  ]}
                  // parentcode="platformconfig"
                  onAdd={() => {
                    router.push(`/platformconfig/equipmentManage/${DGIMN}/${null}`);
                  }}
                  onEdit={record => {
                    router.push(
                      `/platformconfig/equipmentManage/${DGIMN}/${
                        record['dbo.T_Bas_Equipment.ID']
                      }`,
                    );
                  }}
                />
              )}
            </Card>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default EquipmentManage;
