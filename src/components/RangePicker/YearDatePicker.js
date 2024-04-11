import { DatePicker, Space, Tag } from 'antd';
import React, { useRef } from 'react';
import moment from 'moment';

const Index = (props) => {

    const datePickerRef = useRef(null);
    const handleQuickSelect = (years) => {
        closeDatePicker()
        setTimeout(() => {
            const date = moment().subtract(years, 'years');
            props.onChange(date)
        },200)
    };
    const closeDatePicker = () => { //关闭选择框
        if (datePickerRef.current) {
            datePickerRef.current.blur(); // 或者调用 close 方法
        }
    };
    const tagSty = { cursor: 'pointer' }
    const datePickerFooter = (
        <Space>
            <Tag style={tagSty} color="processing" onClick={() => handleQuickSelect(0)}>今年</Tag>
            <Tag style={tagSty} color="processing" onClick={() => handleQuickSelect(1)}>去年</Tag>
            <Tag style={tagSty} color="processing" onClick={() => handleQuickSelect(2)}>前年</Tag>
        </Space>
    );
    const disabledDate = current => {
        return current && current > moment().endOf('day');
    };
    return <DatePicker
        picker="year"
        ref={datePickerRef}
        allowClear={false}
        disabledDate={disabledDate}
        renderExtraFooter={() => datePickerFooter}
        {...props}
    />
}
export default Index;