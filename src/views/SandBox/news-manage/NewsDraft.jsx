import React from 'react'
import { Table, Button, Modal,notification } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { DeleteOutlined, EditOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'

const { confirm } = Modal;

export default function NewsDraft() {

  const navigate = useNavigate()

  const [dataSource, setDataSource] = useState([])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger icon={<DeleteOutlined />} shape='circle' onClick={confirmMethod(item)} />

          <Button shape="circle" icon={<EditOutlined />} onClick={()=>{
            navigate(`/news-manage/update/${item.id}`)
          }}/>

          <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>handleCheck(item.id)}/>
        </div>
      },
    }
  ];

  const handleCheck = (id) => {
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then(res=>{
      navigate('/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到审核列表中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }

  const confirmMethod = (item) => {
    return () => {
      confirm({
        title: '您确定要删除此条新闻吗?',
        icon: <ExclamationCircleOutlined />,
        content: '',
        onOk() {
          deleteMethod(item)
        },
        onCancel() {
        },
      });
    }
  }
  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }

  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username])

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} />;
    </div>
  )
}
