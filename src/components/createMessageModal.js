import React, { useState } from 'react';

import { Modal, Form, Input, Checkbox } from 'antd';
const { TextArea } = Input;
const { Item } = Form;

import 'antd/es/form/style/css.js';
import 'antd/es/input/style/css.js';
import 'antd/es/checkbox/style/css.js';
import 'antd/es/modal/style/css.js';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

/*
  This component is a modal that allows the user to enter their new message
*/
function CreateMessageModal({ setIsCreatingMessage, addMessageToDB }) {
  // content of the message
  const [content, setContent] = useState('');
  // Boolean: whether the message is private or no
  const [isPrivate, setIsPrivate] = useState(true);

  return (
    <Modal
      title='Write a new message'
      visible={true}
      onOk={(_) => addMessageToDB({ content, isPrivate })}
      onCancel={(_) => setIsCreatingMessage(false)}
    >
      <Form {...layout}>
        <Item label='Message' rows={4} rules={[{ required: true }]}>
          <TextArea onChange={(e) => setContent(e.target.value)} />
        </Item>
        <Item label='Private'>
          <Checkbox
            onChange={() => setIsPrivate(!isPrivate)}
            checked={isPrivate}
          />
        </Item>
      </Form>
    </Modal>
  );
}

export default CreateMessageModal;
