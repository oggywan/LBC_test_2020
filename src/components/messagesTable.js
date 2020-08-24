import React, { useState, useEffect } from 'react';

import { Table } from 'antd';

import 'antd/es/table/style/css.js';

const tableText = (v) => (
  <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', marginBottom: 0 }}>
    {v}
  </p>
);

/*
  This component is a Table that displays all messages 
  and allows to delete them (content | private | date | delete)
*/
function MessagesTable({ messages, deleteMessage }) {
  // height of the display window
  const [windowHeight, setWindowHeight] = useState(120);

  const columns = [
    {
      title: 'message',
      dataIndex: 'content',
      key: 'content',
      render: (v) => tableText(v),
    },
    {
      title: 'private',
      dataIndex: 'private',
      key: 'private',
      width: 80,
      render: (v) => (v ? tableText('yes') : tableText('no')),
    },
    {
      title: 'date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 170,
      render: (v) => tableText(new Date(v).toLocaleString()),
    },
    {
      title: 'delete',
      dataIndex: 'delete',
      key: 'delete',
      width: 80,
      render: (_, record) => (
        <a onClick={() => deleteMessage(record.key)}>delete</a>
      ),
    },
  ];

  // set the window height and listen to any window resize
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    window.addEventListener('resize', () =>
      setWindowHeight(window.innerHeight)
    );
    return () =>
      window.removeEventListener('resize', () =>
        setWindowHeight(window.innerHeight)
      );
  }, [setWindowHeight]);

  return (
    <div
      id='table-container'
      style={{
        position: 'absolute',
        width: '90%',
        left: '5%',
        top: '30%',
        fontFamily: 'Playfair Display',
        backgroundColor: 'yellow',
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
