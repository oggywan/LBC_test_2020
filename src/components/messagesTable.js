import React, { useState, useEffect } from 'react';

import { Table } from 'antd';

import 'antd/es/table/style/css.js';

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
      render: (v) => (
        <p style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{v}</p>
      ),
    },
    {
      title: 'private',
      dataIndex: 'private',
      key: 'private',
      width: 80,
      render: (v) => (v ? <p>yes</p> : <p>no</p>),
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
      render: (v) => <p>{new Date(v).toLocaleString()}</p>,
    },
    {
      title: 'delete',
      dataIndex: 'delete',
      key: 'delete',
      render: (v, record) => (
        <a
          onClick={(e) => {
            e.persist();
            console.log('hello: ', record);
            deleteData(record.key);
          }}
        >
          delete
        </a>
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
      />
    </div>
  );
}

export default MessagesTable;
