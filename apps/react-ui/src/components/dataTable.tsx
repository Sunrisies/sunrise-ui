import React, { useState } from 'react'
import { DataTable, type Column } from 'sunrise-ui-plus'

// 定义数据类型
interface DataType {
  id: number
  name: string
  age: number
  address: string
  tags: string[]
  status: 'active' | 'inactive' | 'pending'
}

// 生成模拟数据
const generateData = (count: number): DataType[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    age: Math.floor(Math.random() * 40) + 18,
    address: `地址 ${i + 1}, 城市 ${Math.floor(Math.random() * 10) + 1}`,
    tags: ['标签1', '标签2', '标签3'].slice(0, Math.floor(Math.random() * 3) + 1),
    status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as DataType['status'],
  }))
}

export function DataTableDemo() {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  const data = generateData(23) // 生成23条数据

  // 列定义
  const columns: Column<DataType>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{ text }</strong>,
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      width: 100,
      align: "center",
      render: (age) => `${age}岁`,
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <div className="flex gap-1 flex-wrap">
          { tags.map((tag, index) => (
            <span key={ index } className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              { tag }
            </span>
          )) }
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => {
        const statusMap = {
          active: { text: "活跃", color: "bg-green-100 text-green-800" },
          inactive: { text: "非活跃", color: "bg-gray-100 text-gray-800" },
          pending: { text: "待定", color: "bg-yellow-100 text-yellow-800" },
        }
        const { text, color } = statusMap[status]
        return <span className={ `text-xs px-2 py-1 rounded ${color}` }>{ text }</span>
      },
    },
  ]

  // 自定义行样式
  const handleRow = (record: DataType) => ({
    style: { cursor: 'pointer' },
    onClick: () => alert(`点击了: ${record.name}`),
  })

  return (
    <div className="data-table-demo">
      <h2>DataTable 组件示例</h2>
      <DataTable
        dataSource={ data }
        columns={ columns }
        rowKey="id"
        onRow={ handleRow }
        pagination={ {
          current: currentPage,
          pageSize,
          total: data.length,
          onChange: (page) => setCurrentPage(page),
          showTotal: true,
        } }
      />
    </div>
  )
}
