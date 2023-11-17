import React, { PureComponent } from 'react';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import { Card, Divider, Upload, Button, Tooltip, message } from 'antd'
import CustomIcon from '@/components/CustomIcon'
import config from '@/config';
import Cookie from 'js-cookie';
import { connect } from "dva"



@connect()
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      UserID: "",
    };
    this._SELF_ = {
      configId: "QCAnalyzeOperator"
    }
  }

  //上传文件
  upload = (userid) => {
    console.log('this=', this)
    const { dispatch } = this.props;
    const { configId } = this._SELF_;
    const props = {
      name: 'file',
      multiple: false,
      accept: ".jpg,.jpeg,.png,.bmp",
      showUploadList: false,
      data: {
        ssoToken: Cookie.get(config.cookieName),
        UserID: userid
      },
      headers: {
        Authorization: "Bearer " + Cookie.get(config.cookieName)
      },
      action: `/api/rest/PollutantSourceApi/UploadApi/UploadFiles`,
      onChange: (info) => {
        const { status, response } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          if (response.IsSuccess) {
            message.success(`识别成功`);
            dispatch({
              type: 'autoForm/getAutoFormData',
              payload: {
                configId: configId,
              },
            });
          } else {
            message.error(`${response.Message}`);
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} 上传失败!`);
        }
      },
    };
    return (
      <Upload {...props}>
        <Tooltip title="上传照片">
          <a><CustomIcon type="icon-shangchuan" /></a>
        </Tooltip>
      </Upload>
    )
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
                {row["dbo.T_Bas_QCAnalyzeOperator.FaceMark"] === 0 ? <>
                  <Divider type="vertical" />
                  {this.upload(row["dbo.T_Bas_QCAnalyzeOperator.UserID"])}</> : <></>
                }
              </>
            }}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;