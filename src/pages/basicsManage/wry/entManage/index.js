import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import { Card, Modal, Button, Tooltip, Popconfirm, Divider } from 'antd'
import { EnvironmentOutlined } from "@ant-design/icons"
import { router } from 'umi'

const CONFIG_ID = "AEnterpriseTest";

class index extends PureComponent {
  state = {}
  render() {
    return (
      <BreadcrumbWrapper>
        <Card>
          <SearchWrapper configId={CONFIG_ID} />
          <AutoFormTable
            getPageConfig
            configId={CONFIG_ID}
            parentcode={"basicsManage/wry/entManage"}
            appendHandleRows={(row) => {
              return (
                <>
                  <Divider type="vertical" />
                  <Tooltip title="维护排口信息">
                    <a onClick={() => {
                      router.push(`/basicsManage/wry/entManage/point/${row["dbo.T_Bas_Enterprise.EntCode"]}/${row["dbo.T_Bas_Enterprise.EntName"]}`)
                    }}><EnvironmentOutlined style={{ fontSize: 16 }} /></a>
                  </Tooltip>
                </>
              )
            }}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;