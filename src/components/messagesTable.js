import React, { useState, useEffect } from 'react';

import { Table } from 'antd';

import 'antd/es/table/style/css.js';

const tableText = (v) => (
  <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', marginBottom: 0 }}>
    {v}
  </p>
);

function MessagesTable({ messages, deleteData }) {
  const columns = [
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
    },
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
      title: 'username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (v) => tableText(new Date(v).toLocaleString()),
    },
    {
      title: 'delete',
      dataIndex: 'delete',
      key: 'delete',
      width: 80,
      render: (_, record) => (
        <a onClick={() => deleteData(record.key)}>delete</a>
      ),
    },
  ];

  const [height, setHeight] = useState(120);

  const resetHeight = () => setHeight(window.innerHeight);

  useEffect(() => {
    resetHeight();
    window.addEventListener('resize', resetHeight);
    return () => window.removeEventListener('resize', resetHeight);
  }, []);

  return (
    <div
      id='table-container'
      style={{
        position: 'absolute',
        width: '90%',
        left: '5%',
        top: '20%',
        fontFamily: 'Playfair Display',
        backgroundColor: 'yellow',
      }}
    >
      <Table
        columns={columns}
        dataSource={messages}
        pagination={false}
        fixedHeader={true}
        scroll={{ y: height * 0.6 }}
        bordered
      />
    </div>
  );
}

export default MessagesTable;
