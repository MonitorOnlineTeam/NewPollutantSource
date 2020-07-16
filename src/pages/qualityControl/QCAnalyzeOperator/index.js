import React, { PureComponent } from 'react';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import { Card, Divider } from 'antd'

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      configId: "QCAnalyzeOperator"
    }
  }

  render() {
    const { configId } = this._SELF_;
    return (
      <BreadcrumbWrapper>
        <Card>
          <SearchWrapper configId={configId} />
          <AutoFormTable
            configId={configId}
            getPageConfig
            parentcode="qualityControl/qcaManager"
            appendHandleRows={row => {
              return <>
                <Divider type="vertical" />
              </>
            }}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;