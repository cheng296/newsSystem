import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function RoleList() {

  const [dataSource, setDatasource] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rightList, setRightLIst] = useState([])
  const [currentID,setCurrentID] = useState()
  const [currentRights,setCurrentRights] = useState([])

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
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={confirmMethod(item)} />

          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
            setIsModalOpen(true)
            setCurrentRights(item.rights)
            setCurrentID(item.id)
          }} />
        </div>
      }
    },
  ];

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
    setDatasource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/roles/${item.id}`)
  }

  useEffect(() => {
    axios.get('http://localhost:5000/roles').then((res) => {
      setDatasource(res.data)

    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
      setRightLIst(res.data)
    })
  }, [])

  const handleOk = () => {
    setIsModalOpen(false);

    //同步datasource
    setDatasource(dataSource.map((item)=>{
      if(item.id===currentID){
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))

    axios.patch(`http://localhost:5000/roles/${currentID}`,{
      rights:currentRights
    })
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onCheck = (checkedKeys) => {
    setCurrentRights(checkedKeys.checked)
  };

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />;

      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRights}
          treeData={rightList}
          onCheck={onCheck}
          checkStrictly={true}
        />
      </Modal>
    </div>
  )
}
