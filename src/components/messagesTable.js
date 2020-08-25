import React, { useState, useEffect } from 'react';

import Table from 'antd/lib/table';
import { DeleteOutlined } from '@ant-design/icons';
import 'antd/es/table/style/css.js';

const tableText = (v, onClick) => (
  <p
    style={{
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      marginBottom: 0,
      cursor: onClick ? 'pointer' : 'default',
    }}
    onClick={onClick}
  >
    {v}
  </p>
);

/*
  This component is a Table that displays all messages 
  and allows to delete them (content | isPrivate | date | delete)
*/
function MessagesTable({
  messages,
  setMessageKeyToRead,
  setMessageKeyToDelete,
}) {
  // height of the display window
  const [windowHeight, setWindowHeight] = useState(120);

  const columns = [
    {
      title: 'message',
      dataIndex: 'content',
      key: 'content',
      render: (content, message) =>
        tableText(content, () => setMessageKeyToRead(message.key)),
    },
    {
      title: 'private',
      dataIndex: 'isPrivate',
      key: 'isPrivate',
      width: 80,
      render: (isPrivate) => (isPrivate ? tableText('yes') : tableText('no')),
    },
    {
      title: 'date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 170,
      render: (date) => tableText(new Date(date).toLocaleString()),
    },
    {
      title: 'delete',
      dataIndex: 'delete',
      key: 'delete',
      width: 80,
      render: (_, message) => (
        <DeleteOutlined
          style={{ color: '#eb2f96', paddingLeft: '17px' }}
          onClick={() => setMessageKeyToDelete(message.key)}
        />
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
