import './App.css'
import { Button, Card } from 'sunrise-ui-plus'
import { genRandStr } from "sunrise-utils"
import { TableDemo } from './components/table'
import { Pagination } from './components/customPagination'
import { DataTableDemo } from './components/dataTable'
function App() {
  console.log(genRandStr(100))
  return (
    <div className="container" style={ { display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' } }>
      <h1>Sunrise UI 组件示例</h1>
      { genRandStr(100) }
      <div className="button-section">
        <h2>Button 组件</h2>
        <div style={ { display: "flex", gap: "10px", flexWrap: "wrap" } }>
          <Button variant="default">默认按钮</Button>
          <Button variant="destructive">危险按钮</Button>
          <Button variant="outline">轮廓按钮</Button>
          <Button variant="secondary">次要按钮</Button>
          <Button variant="ghost">幽灵按钮</Button>
          <Button variant="link">链接按钮</Button>
        </div>
        <h3>不同尺寸</h3>
        <div style={ { display: "flex", gap: "10px", alignItems: "center" } }>
          <Button size="sm">小按钮</Button>
          <Button size="default">默认按钮</Button>
          <Button size="lg">大按钮</Button>
          <Button size="icon">🔍</Button>
        </div>
      </div>

      <div className="card-section">
        <h2>Card 组件</h2>
        <Card title="卡片标题">
          <p>这是卡片的内容区域，可以放置任何内容。</p>
        </Card>
      </div>

      <TableDemo></TableDemo>
      <Pagination></Pagination>
      <DataTableDemo></DataTableDemo>
    </div>
  )
}

export default App
