import React, { PureComponent } from 'react';


import { UploadOutlined } from '@ant-design/icons';


import { Upload, Button } from 'antd';

class MyUpload extends React.Component {
  state = {
    fileList: [],
  };

  handleChange = info => {
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    this.setState({ fileList });
  };

  render() {
    const props = {
      // action: 'http://www.mocky.io/v2/5cede1ac3000004b0c6e97ca',
      // action: 'http://172.16.9.52:8096/rest/PollutantSourceApi/UploadApi/UploadFiles',
      action: 'http://172.16.9.52:8096/rest/PollutantSourceApi/AutoFormDataApi/ImportDataExcel',
      onChange: this.handleChange,
      multiple: true, 
      data: {
        // FileUuid: '12345',
        // FileActualType: "1"
        ConfigID: "TestCommonPoint",
        
      }
    };
    return (
      <Upload {...props} fileList={this.state.fileList}>
        <Button>
          <UploadOutlined /> Upload
        </Button>
      </Upload>
    );
  }
}

export default MyUpload
