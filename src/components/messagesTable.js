import React from 'react';

import Table from 'antd/lib/table';
import { DeleteOutlined } from '@ant-design/icons';
import 'antd/es/table/style/css.js';

/*
This component is a Table that displays all messages 
and allows to delete them (content | isPrivate | date | delete)
*/
function MessagesTable({
  messages,
  setMessageKeyToRead,
  setMessageKeyToDelete,
  windowHeight,
  isMobile,
}) {
  const tableText = (text, onClick) => (
    <p
      style={{
        overflow: 'hidden',
        marginBottom: 0,
        cursor: onClick ? 'pointer' : 'default',
        fontSize: isMobile ? '2em' : '1em',
        lineHeight: isMobile ? '2em' : '.9em',
        height: isMobile ? '4em' : '1em',
        fontWeight: '300',
      }}
      onClick={onClick}
    >
      {text}
    </p>
  );

  const tableTitle = (text) => (
    <p
      style={{
        fontSize: isMobile ? '2em' : '1em',
        marginBottom: 0,
        fontWeight: '400',
      }}
    >
      {text}
    </p>
  );

  const columns = [
    {
      title: () => tableTitle('message'),
      dataIndex: 'content',
      key: 'content',
      render: (content, message) =>
        tableText(content, () => setMessageKeyToRead(message.key)),
    },
    {
      title: () => tableTitle('private'),
      dataIndex: 'isPrivate',
      key: 'isPrivate',
      width: isMobile ? 120 : 80,
      render: (isPrivate) => (isPrivate ? tableText('yes') : tableText('no')),
    },
    {
      title: () => tableTitle('date'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 170,
      render: (date) => tableText(new Date(date).toLocaleString()),
    },
    {
      title: () => tableTitle('delete'),
      dataIndex: 'delete',
      key: 'delete',
      width: isMobile ? 110 : 80,
      render: (_, message) => (
        <DeleteOutlined
          style={{
            color: '#ff6e14',
            paddingLeft: '17px',
            fontSize: isMobile ? '2em' : 'unset',
          }}
          onClick={() => setMessageKeyToDelete(message.key)}
        />
      ),
    },
  ];

  return (
    <div
      id='table-container'
      style={{
        position: 'absolute',
        width: '90%',
        left: '5%',
        top: '35%',
        fontFamily: 'Roboto',
        backgroundColor: 'yellow',
        fontWeight: 'bold',
      }}
    >
      <Table
        columns={columns}
        dataSource={messages}
        pagination={false}
        fixedHeader={true}
        scroll={{ y: windowHeight * 0.5 }}
        bordered
      />
    </div>
  );
}

export default MessagesTable;
