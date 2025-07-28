import { Form, FormItemProps } from 'antd';
import React from 'react';
const OllamaFlowFormItem = (props: FormItemProps) => {
  const { ...rest } = props;
  return <Form.Item {...rest}></Form.Item>;
};

export default OllamaFlowFormItem;
