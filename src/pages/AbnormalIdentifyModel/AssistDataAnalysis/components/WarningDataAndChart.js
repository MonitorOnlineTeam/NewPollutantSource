import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Alert, Form, Space, Button, Select, Radio, message, Spin } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { formatPollutantPopover } from '@/utils/utils';
import styles from '../../styles.less';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { RightOutlined } from '@ant-design/icons';
import { getColorByName } from '../../CONST';
import TableText from '@/components/TableText';

const COLOR = '#e6b8b7';
const RenAndGuImage =
  'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTEyLTIyVDEwOjI3OjI0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0xMi0yMlQxMDozMToyNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0xMi0yMlQxMDozMToyNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzQzMjk0MTNBMDcyMTFFRUEzRDhGQ0MzODgzMEQ5OTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzQzMjk0MTRBMDcyMTFFRUEzRDhGQ0MzODgzMEQ5OTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozNDMyOTQxMUEwNzIxMUVFQTNEOEZDQzM4ODMwRDk5NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozNDMyOTQxMkEwNzIxMUVFQTNEOEZDQzM4ODMwRDk5NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhCQbQkAAARaSURBVHjaxJdbbFRFGMf/c7YXSG+g26SYJhbLQ4EmSjDCAw8mRsT4UKz2xTQSmyoY5M2YEutDidiEhGikYhPTKCE+oVYbEhsMvkhoS+lNrqWFIlLXbKm9bLu97Tmf/9mzZ7tnt8uW8tBJfpmdOTPzP99833xnVokIVqMYWKWyesKiFJaghBwjPWSOCJkl3aSeFDtjV1ysCNrXrLNJI7GIPIQQaSBZet5KiAqTQnIlhWA8vST/cYSzyJ8JC3u9IkeOiPT2ikxPiwSDIt3dInV14WeRcd1kzUqFGxJEy8pExsYkaeEzq7zcHptvfDX/o3c72U1eICl3QXFiMbX7iSfq+LIyqOZmQAfQgQNQjY12//nzgM8HVFbabS5gtuyDZf4aHzo6OfSSb0lDevmILHWcqlyiXi/UqVPAzAxw7RowOmrXRDo7gZycaFu/mOe1k1BrCuLX1eG+jXxJri/8lJ8RPyCN7Hb1HDwI5OUBIyNAT0+0lvv3gcOHgdOnISdOAEVFUFu3coVseHY08dUzobI2UtKABAZh+Vph3aHB8/+VcFU/xZ+i5cHY4xSM9a10dblcae3fb9f19fbzoSGxampE/H5JWeYnJNT2ttDnmimS4fhYb/Val8WbNy86iv7Vfg37ubAQitairw9oa+Mhyk+dJNJz4dn5HYwNe3Qri7TH+njqYXPVwADUoUN2Y9cuyN69UNXVqUUXgjZ0t+f5k0Dmk7p3G7e83BHucE3o71/87QTW4KDdvnAB2LTJ9ncKUfPq12Fsy3PgKX7PeVrpCP/gmtTSsvjbCbBAAEwaEAqrixeBiQnbDUsUGb2O0O9vQoJ/wVP6/uLObYjG8M5wmwHD8wFtQm64m75T2sLcXPeKd++GIzmhbYVgDZ2FzIxAhptt8elOpL16A2qtd3F8KIiFlqedVqa2OEA+j7VSqqrCycFVYkVj2ta9Vsjkbaj0bBjP1sHY8hGMjTVu0bCJri9whpMy9VfJ50qZFRUik5PyqCXU8YmYvksJ/db4FedYzTnHCZHI/tj1hmfOQBhIOHqUwXQVMGfCyOQNyIP2pHElY5dpfVZiv++c87PHyVxO0Xn1LfJStMfvh9TWwpw7BnkuJutlrEf6K0yf6XmJAvRvQglNwbz9jdNqjb/6aKe+S6YTJhZ43O35MZiXP+AMM/Hcr9/DiPbHrGrB7GIemHsQnkm+WOrONaSzdXy6l3xP4s2Fudhs38czO+7q92z/FMpbGjnPAZgd78AaPus8foP5etw5TkuV7yPbDqwzEGp6Inmy4LYbz1TBKHgZKrfENjIwAOvfczxm/MrNRq3/kKLHo/YkEc6OZLQtUpQG8/i6x71UVlO0aTnXWx3lr5MJ5Kz4JqljRt8QSuNF46M6vtwiFcg2Wh/h/r1A/iA/k18oeC/ZwLQUC/0mOeoz1rVJRG4SHnL06U8I6aLY7HLeUC3nvxM/ZS+y2kGGyT/kDvmbIuZK/aBW60/b/wIMACWpUylRhOCjAAAAAElFTkSuQmCC';
const GuImage =
  'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTEyLTIyVDEwOjI3OjI0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0xMi0yMlQxMDoyOTo0MiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0xMi0yMlQxMDoyOTo0MiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjZBQjQzQzdBMDcxMTFFRTg3QjlCREFCNEU1RUY0NTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjZBQjQzQzhBMDcxMTFFRTg3QjlCREFCNEU1RUY0NTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNkFCNDNDNUEwNzExMUVFODdCOUJEQUI0RTVFRjQ1MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNkFCNDNDNkEwNzExMUVFODdCOUJEQUI0RTVFRjQ1MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj4G1iwAAAMISURBVHjapJdNSFRRFMfPtRgwMEgTIo3Mpo0z4DLShWALkbYtWmgUCgoStHDhInDpbnCh4kJoMW5aFEYLhZlZSBQYFQjjBy0ESbIMFVHDBued/vfdN713n/Nx3/PAnzfnvnfOb96dc+89I5iZTI2FuIRLHSSvF6A8dAztCeY/FMQkuJwsoiroMfQF4jL6BD2CRKWc9stWgN5xEnIAfYBuhQYjuB060JK2tDAnEsxra8wnJ0qrq/aYvOd59jd0NzAYQXENGokwT0ww5/Nc0uS96Wm2qqsL8D05Y8ZgPByBsho0lXIByaQOTKeZd3ZcP5OxY5z4r9BFU/Bz7/Ty5KTGsccKdnysfC9YGmbHk2OgGFh4lxOWi8DlO9RgD8RiJJaXsXCwcmZn1TO9vSSSSRVQU0M8PExidNRdJj09WGR54tZWopUVObIByG3/aqry+Tf+Q2Giv19Biy3Dw0MbSn19yp+ZId7aUjcRY8cqa8YLXS+7jp1KdqdZVq/PClNtjY2xFY0yz80pX372TjliPbnOVLj/jes0r7nZ/ZzJEA8Oqi8rrwcHJFIp4vl5NaUNmKj6+uKxRLWVpjpScovb3iZqaiKRzZLo7iba37d92t0lHhryTq2yXK5sXj/4r+ZtbGiuaGy0C46iUXews5NocZGoq0vPtLlZOm8R8E/NW1jQ6wEVjUIhjsfVgKz0RIJoZIS4rY1oacl9OJ0unbdIcdVqW2Q8znx6qoolm1UqFNnUFFsDA25BYSOxOjqUjxgZ6+SxoMsmG8jHchuIkSHGkyNtunM91N7av2VWMn3LlHpgChbQ5zPw4IeEfUQGPZ06ip61sRjz+Djz+jpzLsd8dKR+d4x5flOv2sOcx68DNgB+vQrbCFyDdkNC92X8eVqfJyHBT8/VcznwNwGh70waPhPwFWjTEPoDunruLtMDvwflKkDz0H2TfMZgB/6sAviFaa5AYAf+sgT0rWkjHxYsO9D3PugyVBMkT2CwA6+DvjnQX9DNoDnOdJkB/rxV49Io+xIkOKIQ9k+AAQBWk2FlMCnAfgAAAABJRU5ErkJggg==';
const RenImage =
  'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTEyLTIyVDEwOjI3OjI0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0xMi0yMlQxMDoyOTozMSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0xMi0yMlQxMDoyOTozMSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjAxRDlCQjlBMDcxMTFFRUIyNzJFN0UzREE5RDJBMDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjAxRDlCQkFBMDcxMTFFRUIyNzJFN0UzREE5RDJBMDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMDFEOUJCN0EwNzExMUVFQjI3MkU3RTNEQTlEMkEwNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMDFEOUJCOEEwNzExMUVFQjI3MkU3RTNEQTlEMkEwNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjmvGFwAAANUSURBVHjapJddSFRBFMfPnV0FDSQyFVJJjShKJIMK+xKqt3qSIBGlrIewwKCieiiEIqiH7KGHhCgM+6AghcjelKzWiChDyhJJVy3K1bIil9K9d/rP3bu73d3Z3bnbwJ9h75wzvznzcWZW45yTaplrz8lElQ2J2gXp0Az0La1q0k8OipYMDBhDVQsdglYnMH0BNUN3MAj+X2BAl6K6Ca1xEEyvGCjgIymBAd2A6iGUFTbOWkasqJa0vK2kzVtsfuMzXuIT3WR4bxD/ORgynYJ2AP7cERjQUlSeMJSlk6vsNLHiengweU/cALyN9P6TWPnf4ss0tA7wISUwoOmoXkErQ1D3+luk5VYqzTOffEIBTzWRMSt+9kFrAQ9E28mGfyAMFVu37IwUyr8OANAYG0nOJnN2rFIO7ZMNkEVFq6E6GlnT5Zje3fLI/D7S0uZL21jxHtPXKseSglEKofxwIzYSaS45+MdQgi3rCvoGSwkCWqQCjvjnbYm/lp86yPh4GdMkzxtRvoXJwNk2Z+vIyNaXz00QK2ggY7xbDrb7LkgGTlfZufr7FmL5NcSWVJM+0CSP2phL2G80+I8tspnR2P4GbxOf9pCrtIG07BXEcreT3ndOsvnG4/YrA3+xOU/Yp1F/c4X0t43krmgjSssMHrfyE2T4OgG/YIuc+x7H7VcG/mCLzos0zfUgFB0b3hZyV/aYkYYLBuDe3A5QFwW6d1pU3UyhoTFAwyqZSyT5inACWXWeWMneSDRWpLF51k884CctYyEZw9dIf3081NKFzLVNJXM126a3/xSi6QkC40GtAQmoSJnC559yUSWBiHIPehmZ71kK9NYgiqvmRRD/YOOSGLlu2lp52rwiEW2nk9tJJOdHMcYihRbVmcnBPKc4Mtw/Zm6k4LX4LtplI8Aep/exiLyKUi93Ad0Vr5ElcDwo3lIpQr9bTyVyDMZoxdk7kiL4sOVPqUQs4K2oOhxCH0CtyYyYQkfiIh9ThH6G6lVemUnB6ES8narFfktiKs5aHeynVEaoErGAP1NY7ybYdamuB1M1RKeXEqzdfeisk43AHG6c/dDTqG/91gOeO+lIc/LfyUos4pUipl78y/BZz9dRp+fNMdiCZ6AqELsY0F+pHPS/AgwAMutL9VJqW14AAAAASUVORK5CYII=';

let tempSelectedNames = [];

const dvaPropsData = ({ loading, AbnormalIdentifyModel, common }) => ({
  pollutantListByDgimn: common.pollutantListByDgimn,
  allTypeDataList: AbnormalIdentifyModel.allTypeDataList,
  pollutantLoading: loading.effects['common/getPollutantListByDgimn'],
  tableLoading: loading.effects['AbnormalIdentifyModel/GetAllTypeDataListForModel'],
  exportLoading: loading.effects['AbnormalIdentifyModel/ExportHourDataForModel'],
});

const WarningDataAndChart = props => {
  const [form] = Form.useForm();

  const [columns, setColumns] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [legendSelected, setLegendSelected] = useState({});
  const [units, setUnits] = useState({});
  const [showType, setShowType] = useState('chart');

  const {
    dispatch,
    DGIMN,
    pollutantListByDgimn,
    date,
    allTypeDataList,
    pollutantLoading,
    tableLoading,
    exportLoading,
    describe,
    warningDate,
    defaultChartSelected,
  } = props;
  // const [visible, setVisible] = useState([]);

  useEffect(() => {
    if (DGIMN) {
      getPollutantListByDgimn();
    }
  }, [DGIMN]);

  // 根据mn获取污染物
  const getPollutantListByDgimn = () => {
    dispatch({
      type: 'common/getPollutantListByDgimn',
      payload: {
        DGIMNs: DGIMN,
      },
      callback: res => {
        let pollutantCodes = [],
          pollutantNames = [];
        let units = {};

        res.map(item => {
          pollutantCodes.push(item.PollutantCode);
          pollutantNames.push(item.PollutantName);
          units[item.PollutantName] = item.Unit;
        });
        setUnits(units);
        form.setFieldsValue({ pollutantCodes: pollutantCodes });
        setSelectedNames(pollutantNames);
        tempSelectedNames = pollutantNames;
        GetAllTypeDataList();
        getColumns(res);
        // handleLegendSelected();
      },
    }).then(() => {});
  };

  useEffect(() => {
    handleLegendSelected();
  }, [selectedNames]);

  // 处理选中的图例
  const handleLegendSelected = () => {
    let pollutantNames = selectedNames;
    console.log('selectedNames', selectedNames);
    // 处理图例
    let legendSelected = {};
    console.log('pollutantNames', pollutantNames);
    // 默认选中氧含量、烟气湿度、烟气温度、流速
    pollutantNames.map((item, index) => {
      // if (item === '氧含量' || item === '烟气湿度' || item === '烟气温度' || item === '流速') {
      //   legendSelected[item] = true;
      // } else {
      //   legendSelected[item] = false;
      // }
      console.log('defaultChartSelected', defaultChartSelected);
      // 根据不同模型选中污染物
      if (defaultChartSelected.length) {
        if (defaultChartSelected.includes(item)) {
          legendSelected[item] = true;
        } else {
          legendSelected[item] = false;
        }
      }
      // if (index < 1) {
      //   legendSelected[item] = true;
      // } else {
      //   legendSelected[item] = false;
      // }
    });
    setLegendSelected(legendSelected);
  };

  // 获取报警数据
  const GetAllTypeDataList = () => {
    const values = form.getFieldsValue();
    let beginTime = values.time[0].format('YYYY-MM-DD HH:mm:ss');
    let endTime = values.time[1].format('YYYY-MM-DD HH:mm:ss');

    dispatch({
      type: 'AbnormalIdentifyModel/GetAllTypeDataListForModel',
      payload: {
        DGIMNs: DGIMN,
        beginTime: beginTime,
        endTime: endTime,
        pollutantCodes: values.pollutantCodes.toString(),
        isAsc: true,
        IsSupplyData: false,
      },
      callback: () => {},
    }).then(res => {});
  };

  // 导出
  const ExportHourDataForModel = () => {
    const values = form.getFieldsValue();
    let beginTime = values.time[0].format('YYYY-MM-DD HH:mm:ss');
    let endTime = values.time[1].format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'AbnormalIdentifyModel/ExportHourDataForModel',
      payload: {
        DGIMNs: DGIMN,
        beginTime: beginTime,
        endTime: endTime,
        pollutantCodes: values.pollutantCodes.toString(),
        isAsc: true,
        IsSupplyData: false,
      },
    });
  };

  // 获取表头
  const getColumns = pollutantList => {
    let columns = [
      {
        title: '时间',
        dataIndex: 'MonitorTime',
        key: 'MonitorTime',
        fixed: 'left',
        render: (text, record) => {
          let backgroundColor = 'transparent';
          if (record['MonitorTime_Status'] === true) {
            // if (true) {
            backgroundColor = COLOR;
          }
          return (
            <div className={styles.tdBox} style={{ background: backgroundColor }}>
              {text}
            </div>
          );
        },
      },
      {
        title: '数据特征识别',
        key: 'WC',
        children: [
          {
            title: '工况',
            dataIndex: 'ModelWCFlag',
            key: 'ModelWCFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text !== '正常') {
                // if (true) {
                backgroundColor = COLOR;
              }
              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={text || '-'} />
                </div>
              );
            },
          },
          {
            title: '人为干预',
            dataIndex: 'WCArtificialFlag',
            key: 'WCArtificialFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text || record['MonitorTime_Status'] === true) {
                // if (true) {
                backgroundColor = COLOR;
              }
              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={text || '-'} />
                </div>
              );
            },
          },
          {
            title: '故障原因',
            dataIndex: 'WCFaultFlag',
            key: 'WCFaultFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text || record['MonitorTime_Status'] === true) {
                // if (true) {
                backgroundColor = COLOR;
              }
              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={text || '-'} />
                </div>
              );
            },
          },
        ],
      },
      {
        title: '大样本识别',
        key: 'QH',
        children: [
          {
            title: '工况',
            dataIndex: 'ModelQHFlag',
            key: 'ModelQHFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text !== '正常') {
                // if (true) {
                backgroundColor = COLOR;
              }
              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={text || '-'} />
                </div>
              );
            },
          },
          {
            title: '人为干预',
            dataIndex: 'QHArtificialFlag',
            key: 'QHArtificialFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text || record['MonitorTime_Status'] === true) {
                // if (true) {
                backgroundColor = COLOR;
              }
              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={text || '-'} />
                </div>
              );
            },
          },
          {
            title: '故障原因',
            dataIndex: 'QHFaultFlag',
            key: 'QHFaultFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text || record['MonitorTime_Status'] === true) {
                // if (true) {
                backgroundColor = COLOR;
              }
              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={text || '-'} />
                </div>
              );
            },
          },
        ],
      },
    ];
    pollutantList.map(item => {
      // if (
      //   item.PollutantCode === '01' ||
      //   item.PollutantCode === '02' ||
      //   item.PollutantCode === '03'
      // ) {
      columns.push({
        title: (
          <>
            {item.PollutantName}
            <br />({item.Unit})
          </>
        ),
        dataIndex: item.PollutantCode,
        key: item.PollutantCode,
        render: (text, record) => {
          let backgroundColor = 'transparent';
          if (record[item.PollutantCode + '_Status'] === true) {
            // if (true) {
            backgroundColor = COLOR;
          }
          return (
            <div className={styles.tdBox} style={{ background: backgroundColor }}>
              {formatPollutantPopover(text, record[`${item.PollutantCode}_params`])}
            </div>
          );
        },
      });
      // 非折算
      if (item.PollutantCode.indexOf('zs') === -1) {
        columns.push({
          title: (
            <>
              {item.PollutantName}
              <br />
              数据标记
            </>
          ),
          dataIndex: item.PollutantCode + '_Flag',
          key: item.PollutantCode + '_Flag',
          render: (text, record) => {
            let backgroundColor = 'transparent';
            if (record[item.PollutantCode + '_Status'] === true) {
              // if (true) {
              backgroundColor = COLOR;
            }
            return (
              <div className={styles.tdBox} style={{ background: backgroundColor }}>
                {text || '-'}
              </div>
            );
          },
        });
      }
      // }
    });

    setColumns(columns);
  };

  const getOption = () => {
    const values = form.getFieldsValue();
    const { pollutantCodes = [] } = values;
    let series = [];
    let xAxisData = [];
    let yxisData = [];
    let idx = 0;

    if (!pollutantCodes || !pollutantCodes.length) {
      return {};
    }

    pollutantCodes.map((pollutant, index) => {
      let name = selectedNames[index];
      if (legendSelected[name]) {
        idx += 1;
      }
      yxisData.push({
        type: 'value',
        name: name,
        position: idx <= 3 ? 'left' : 'right',
        alignTicks: true,
        offset: idx <= 3 ? (idx - 1) * 60 : (idx - 4) * 60,
        // offset: idx % 3 * 60,
        nameLocation: 'end',
        show: legendSelected[name],
        axisLine: {
          show: true,
        },
      });
      let serieData = [];
      allTypeDataList.map(item => {
        serieData = serieData.concat(item[pollutant]);
      });
      console.log('serieData', serieData);
      series.push({
        type: 'line',
        id: pollutant,
        name: selectedNames[index],
        unit: pollutant.Unit,
        data: serieData,
        yAxisIndex: index,
        label: {
          formatter: pollutant.Unit,
          show: false,
        },
        itemStyle: {
          color: getColorByName[selectedNames[index]],
        },
        symbol: (value, params) => {
          // 污染物flag非正常，显示三角
          console.log('params', params);
          let { dataIndex, seriesId } = params;
          let currentData = allTypeDataList[dataIndex];
          let flag = currentData[seriesId + '_Flag'];

          if (flag === '正常(N)' || flag === '' || flag === '正常(n)') {
            return 'circle';
          } else {
            return 'triangle';
          }
        },
        symbolSize: (value, params) => {
          let { dataIndex, seriesId } = params;
          let currentData = allTypeDataList[dataIndex];
          let flag = currentData[seriesId + '_Flag'];
          if (flag === '正常(N)' || flag === '' || flag === '正常(n)') {
            return 4;
          } else {
            return 20;
          }
        },
        // markPoint: {
        //   data: [
        //     {
        //       name: '人为干预',
        //       xAxis: '2024-01-03 17:00',
        //       yAxis: 125.299,
        //       symbol: RenAndGuImage,
        //       symbolRotate: 22,
        //       symbolSize: 36,
        //       symbolOffset: [0, -28],
        //     },
        //   ],
        // },
      });
    });

    // 异常工况数据
    let markAreaData = [];
    let continuousItem = [];
    // 人为干预和故障数据
    let RenAndGuData = [];
    allTypeDataList.map((item, idx) => {
      // 时间数据
      xAxisData.push(item.MonitorTime);
      // 绘制异常工况
      {
        // 异常工况开始
        if (
          (item.ModelQHFlag !== '正常' || item.ModelWCFlag !== '正常') &&
          !continuousItem.length
        ) {
          continuousItem.push({
            name: '异常工况',
            xAxis: item.MonitorTime,
          });
        }

        // 异常工况结束
        if ((item.ModelQHFlag === '正常' || item.ModelWCFlag === '正常') && continuousItem.length) {
          continuousItem.push({
            name: '异常工况',
            xAxis: item.MonitorTime,
          });

          markAreaData.push(continuousItem);
          continuousItem = [];
        } else if (
          (item.ModelQHFlag !== '正常' || item.ModelWCFlag !== '正常') &&
          idx === allTypeDataList.length - 1
        ) {
          continuousItem.push({
            name: '异常工况',
            xAxis: item.MonitorTime,
          });

          markAreaData.push(continuousItem);
          continuousItem = [];
        }
      }
      // 绘制人为干预、设备故障时间线
      {
        let RenStatus = item.WCArtificialFlag || item.QHArtificialFlag;
        let GuStatus = item.WCFaultFlag || item.QHFaultFlag;

        if (RenStatus && GuStatus) {
          RenAndGuData.push({
            name: '人为干预、设备故障',
            xAxis: item.MonitorTime,
            lineStyle: { color: '#ff5500', type: 'solid', width: 2 },
            label: {
              position: 'end',
              fontSize: 13,
              color: '#ff5500',
              formatter: function(params) {
                return '人为干预\n设备故障';
              },
            },
          });
        } else if (RenStatus) {
          RenAndGuData.push({
            name: '人为干预',
            xAxis: item.MonitorTime,
            lineStyle: { color: '#ff5500', type: 'solid', width: 2 },
            label: {
              position: 'end',
              fontSize: 13,
              color: '#ff5500',
              formatter: function(params) {
                return '人为干预\n设备故障';
              },
            },
          });
        } else if (GuStatus) {
          RenAndGuData.push({
            name: '设备故障',
            xAxis: item.MonitorTime,
            lineStyle: { color: '#ff5500', type: 'solid', width: 2 },
            label: {
              position: 'end',
              fontSize: 13,
              color: '#ff5500',
              formatter: function(params) {
                return '人为干预\n设备故障';
              },
            },
          });
        }
      }
    });
    console.log('RenAndGuData', RenAndGuData);
    console.log('markAreaData', markAreaData);
    let showIndex = yxisData.findIndex(item => item.show === true);
    console.log('showIndex', showIndex);
    if (showIndex > -1) {
      // 绘制异常工况阴影
      series[showIndex].markArea = {
        itemStyle: {
          color: 'rgba(0,0,0, .1)',
        },
        data: markAreaData,
      };

      // 绘制报警时间线
      if (warningDate.length) {
        // 过滤出warningDate中的pollutantCode 如果在legendSelected为true的数据, 报警时间线随着图例联动
        let selectedPollutantCodes = Object.keys(legendSelected).filter(
          code => legendSelected[code],
        );
        console.log('selectedPollutantCodes', selectedPollutantCodes);
        let filteredWarningDate = warningDate.filter(item =>
          selectedPollutantCodes.includes(item.pollutantName),
        );
        let newFilteredWarningDate = filteredWarningDate.length ? filteredWarningDate : warningDate;
        let abnormalMarkLine = newFilteredWarningDate.map(item => {
          let color = filteredWarningDate.length ? getColorByName[item.pollutantName] : '#c23531';
          return {
            name: item.name,
            xAxis: item.date,
            // lineStyle: { color: '#ff0000' },
            lineStyle: { color: color },
            label: {
              position: 'end',
              // padding: [0, -120, 0, 0],
              // fontWeight: 'bold',
              fontSize: 13,
              color: color,
              // width: 20,
              // overflow: 'truncate',
              formatter: function(params) {
                return (
                  item.name
                    .split('')
                    // .reverse()
                    .join('\n')
                );
              },
            },
          };
        });
        series[showIndex].markLine = { data: [...abnormalMarkLine, ...RenAndGuData] };
      } else {
        // 绘制人为干预、设备故障时间线
        series[showIndex].markLine = {
          data: RenAndGuData,
        };
      }
    }
    let option = {
      tooltip: {
        trigger: 'axis',
        extraCssText:
          'background: rgba(255,255,255,.9); border: 1px solid #ddd; padding: 0; font-size: 13px; border-radius: 0;',
        textStyle: 'color: rgba(0,0,0,.5)',
        formatter: function(params, ticket) {
          //x轴名称 params[0]
          let { dataIndex } = params[0];
          let currentData = allTypeDataList[dataIndex];

          //值
          let value = '';
          params.map(item => {
            let dataParams = currentData[item.seriesId + '_params'];
            // 状态：超标、异常
            let status = dataParams ? dataParams.split('§')[0] : '';
            // 标记
            let dataFlag = currentData[item.seriesId + '_Flag'];

            value += `
              <p style="line-height: 20px">
                ${item.marker} ${item.seriesName}： ${item.value || '-'}
                ${units[item.seriesName]}
                ${dataFlag}
                <span style="font-weight: bold; color: ${status === '0' ? '#ff4d4f' : '#faad14'}">${
              status === '0' ? '超标' : status !== '' ? '异常' : ''
            }</span>
              <p>
            `;
          });

          // 工况颜色
          let WorkConColor = currentData.ModelWCFlag === '正常' ? '#52c41a' : '#faad14';
          let WorkConColor2 = currentData.ModelQHFlag === '正常' ? '#52c41a' : '#faad14';

          let content = `
            <div style="background: #eeeeee; padding: 4px 10px; font-size: 14px">${
              currentData.MonitorTime
            }</div>
            <div style="line-height: 20px">
              <div>
                <i style="display: inline-block;width: 2px; height: 16px; margin-right: 8px; background: #3988ff;  vertical-align: middle;"></i>
                <span style="display: inline-block; vertical-align: middle; color: #000">数据特征识别：<span>
              </div>
              <div style="padding: 0 14px">
                <p>工况：<span style="color: ${WorkConColor}; font-weight: bold">${currentData.ModelWCFlag ||
            '-'}</span><p>
                <p>人为干预：${currentData.WCArtificialFlag || '-'}<p>
                <p>故障原因：${currentData.WCFaultFlag || '-'}<p>
              </div>
            </div>
            <div style="line-height: 20px; margin-top: 10px">
              <div>
                <i style="display: inline-block;width: 2px; height: 16px; margin-right: 8px; background: #3988ff;  vertical-align: middle;"></i>
                <span style="display: inline-block; vertical-align: middle; color: #000">大样本识别：<span>
              </div>
              <div style="padding: 0 14px">
                <p>工况：<span style="color: ${WorkConColor2}; font-weight: bold">${currentData.ModelQHFlag ||
            '-'}</span><p>
                <p>人为干预：${currentData.QHArtificialFlag || '-'}<p>
                <p>故障原因：${currentData.QHFaultFlag || '-'}<p>
              </div>
            </div>
            <div style="margin: 8px;background: #f7f7f7; padding: 0 6px;">
              ${value}
            </div>
          `;

          return content;
        },
      },
      legend: {
        data: selectedNames,
        selected: legendSelected,
      },
      grid: {
        left: 100,
        right: 100,
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          dataZoom: { show: true },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
      },
      yAxis: yxisData,
      series: series,
    };
    console.log('option', option);
    return option;
  };

  //
  const onChartLegendChange = (value, param) => {
    let name = value.name;
    if (legendSelected[name] === true && value.selected[name] === false) {
      // 反选
      setLegendSelected(value.selected);
    } else {
      if (_.values(legendSelected).filter(item => item === true).length >= 6) {
        message.error('最多选择6个显示');
        value.selected[name] = false;
        setLegendSelected({
          ...value.selected,
        });
      } else {
        setLegendSelected({
          ...value.selected,
        });
      }
    }
  };

  const onEvents = {
    legendselectchanged: onChartLegendChange,
  };

  // const onCancel = () => {
  //   setVisible(false);
  // };
  console.log('legendSelected', legendSelected);
  return (
    <>
      {describe && (
        <Alert
          message={describe.replace(',下图为模型判断的过程', '。')}
          type="info"
          showIcon
          style={{ marginBottom: 10 }}
        />
      )}
      <Form
        form={form}
        layout="inline"
        initialValues={{
          time: date,
          pollutantCodes: [],
        }}
        autoComplete="off"
      >
        <Form.Item name="pollutantCodes">
          <Select
            mode="multiple"
            // allowClear
            maxTagCount={3}
            maxTagTextLength={5}
            maxTagPlaceholder="..."
            style={{ width: 350 }}
            placeholder="请选择污染物"
            onChange={(value, option) => {
              tempSelectedNames = option.map(item => item.children);
              // setSelectedNames(option.map(item => item.children));
            }}
          >
            {pollutantListByDgimn.map(item => {
              return (
                <Option value={item.PollutantCode} key={item.PollutantCode} data-unit={item.Unit}>
                  {item.PollutantName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="time">
          <RangePicker_
            style={{ width: 260 }}
            dataType={'Day'}
            format={'YYYY-MM-DD'}
            allowClear={false}
          />
        </Form.Item>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              if (!tempSelectedNames.length) {
                message.error('请选择污染物！');
                return;
              }
              setSelectedNames(tempSelectedNames);
              GetAllTypeDataList();
            }}
            loading={tableLoading}
          >
            查询
          </Button>
          <Button type="primary" onClick={ExportHourDataForModel} loading={exportLoading}>
            导出
          </Button>
        </Space>
        <Spin spinning={tableLoading}>
          <Radio.Group
            defaultValue={showType}
            optionType="button"
            buttonStyle="solid"
            style={{ marginLeft: 20 }}
            onChange={e => {
              setShowType(e.target.value);
            }}
          >
            <Radio.Button value={'data'}>数据</Radio.Button>
            <Radio.Button value={'chart'}>图表</Radio.Button>
          </Radio.Group>
        </Spin>
      </Form>
      {showType === 'data' ? (
        <SdlTable
          style={{ marginTop: 10 }}
          rowKey="MonitorTime"
          className={styles.WarningDataTable}
          columns={columns}
          dataSource={allTypeDataList}
          align="center"
          loading={tableLoading}
          scroll={{ y: 'calc(100vh - 390px)' }}
        />
      ) : tableLoading == false && pollutantLoading === false ? (
        // false ? (
        <ReactEcharts
          theme="light"
          option={getOption()}
          lazyUpdate
          notMerge
          id="rightLine"
          onEvents={onEvents}
          style={{ marginTop: 34, width: '100%', height: 'calc(100vh - 304px)' }}
        />
      ) : (
        <div className="example">
          <Spin tip="Loading..." />
        </div>
      )}
    </>
  );
};

WarningDataAndChart.defaultProps = {
  defaultChartSelected: [],
  warningDate: [],
};

export default connect(dvaPropsData)(WarningDataAndChart);
