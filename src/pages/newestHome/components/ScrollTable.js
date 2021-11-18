import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Input, InputNumber, Popconfirm } from 'antd';
import styles from './styles/scrollTable.less';


@Form.create()
export default class Index extends Component  {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        
        const { data } = this.props;
        //文字无缝滚动
        this.industryNews = data.length>7&&setInterval(this.taskIndustryNews, 50);
    }
    taskIndustryNews = () => {


        if(this.refs.newDiv){
            if (this.refs.copyDivUI.offsetHeight - this.refs.newDiv.scrollTop <= 0) {
                this.refs.newDiv.scrollTop -= this.refs.copyDivUI.offsetHeight; 
            }
            
            else {
                this.refs.newDiv.scrollTop += 1;
            }
        }

    }


    handleIndustryNewsEnter = () => {
        clearInterval(this.industryNews);
    }
    handleIndustryNewsLeave = () => {
        const { data } = this.props;
        this.industryNews =   data.length>7&&setInterval(this.taskIndustryNews, 50);
    }
    componentWillUnmount = () => {
        clearInterval(this.industryNews);
    }


    render() {
          const { column,type } = this.props;

         let lengths = column&&column.length;

        return (<div className={styles.scrollTable}>
            <div className='table'>
                <div className='table-title'>
                    {
                        column&&column.length>0?
                        column.map(item=>{
                        return <span className='table-text2' style={{width: type=='airStatistics'? '20%' : '25%'}}>{item}</span>
                        })
                        :
                        null
                    }
                </div>
                <div
                    ref='newDiv'
                    className='table-body'
                    onMouseEnter={this.handleIndustryNewsEnter.bind(this)}
                    onMouseLeave={this.handleIndustryNewsLeave.bind(this)}
                >
                    <ul ref='newDivUI' id='newUl'>
                        {this.props.data && this.props.data.length > 0
                            ?
                            this.props.data.map(this.tableBody)
                            : <div   className='noData'> 
                               <div style={{paddingTop:40}}> <img alt="暂无数据" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA2NCA0MSIgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"></img></div>
                                <span>暂无数据</span>
                                </div>

                        }

                    </ul>

                    <ul ref='copyDivUI' id='copyUl'> 
                    {this.props.data && this.props.data.length>5
                            ?
                            this.props.data.map(this.tableBody)
                            : null

                        }
                    </ul>
                </div>
            </div>
            </div>
        );
    }

    tableBody = (item, index) => {
        const { type } = this.props;


 
        return (
            <li key={index}>
                <span className='table-text2' style={{width:  '37px'}}>
                   <span className='sort'style={index%2!=0?{background:'none'}:{}} >{item.sort}</span>
                </span>
                <span title={item.name} className='table-text2 textOverflow' style={{width: 'calc(70% - 31px)',textAlign:'center'}}>
                  {item.name}
                </span>
                <span title={item.roat} className='table-text2 textOverflow' style={{width: '35%',textAlign:'center'}}>
                  {item.roat}
                 </span>

            </li>

        );
    }


}
