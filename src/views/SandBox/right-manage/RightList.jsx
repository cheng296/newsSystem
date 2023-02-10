import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal,Popover, Switch  } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'

const { confirm } = Modal;
// dataSource = [
//   {
//     key: '1',
//     name: '胡彦斌',
//     age: 32,
//     address: '西湖区湖底公园1号',
//   },
//   {
//     key: '2',
//     name: '胡彦祖',
//     age: 42,
//     address: '西湖区湖底公园1号',
//   },
// ];


export default function RightList() {

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
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => {
        return <Tag color="gold">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" danger shape="circle" icon={<DeleteOutlined onClick={confirmMethod(item)} />} />

          <Popover content={<div style={{textAlign:'center'}}>
            <Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch>
          </div>} title="配置项" trigger={item.pagepermisson===undefined?'':"click"}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} 
            disabled={item.pagepermisson===undefined} />
          </Popover>
        </div>
      }
    }
  ];

  const [dataSource, setDatasource] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
      res.data.map((item) => {
        if (item.children.length === 0) item.children = ''
        return item
      })
      setDatasource(res.data)
    })
  }, [])

  const confirmMethod = (item) => {
    return () => {
      confirm({
        title: '您确定要删除此项权限吗?',
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
     if (item.grade === 1) {
      setDatasource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    }
    else {
      let list = dataSource.filter(data=>data.id===item.rightId)
      list[0].children = list[0].children.filter(data=>data.id!==item.id)
      setDatasource([...dataSource])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }

  const switchMethod = (item) => {

    item.pagepermisson = item.pagepermisson===1?0:1

    setDatasource([...dataSource])

    if(item.grade===1){
      axios.patch(`http://localhost:5000/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
    else{
      axios.patch(`http://localhost:5000/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    } 
}


  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 6
        }}
      />;

    </div>
  )
}
