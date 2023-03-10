import React, { memo, useState, useEffect } from 'react'
import { momentFormat } from '@/utils'
import SvgIcon from '@/components/SvgIcon'
import './index.less'

const FORMAT = 'YYYY/MM/DD HH:mm:SS'

function index() {
  const [time, setTime] = useState<any>(+new Date())

  useEffect(() => {
    const t = setInterval(() => {
      setTime(+new Date())
    }, 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="data-header">
      <div className="time">
        <span className="timeIcon">
          <SvgIcon name="xianxingdaoyu" />
        </span>
        {momentFormat(time).format(FORMAT)}
      </div>
      <div className="title">平台实时数据看板</div>
      <div className="desc">
        {/* <SvgIcon icon="icon-shezhi" className="setIcon" /> */}
        统计维度：昨天
      </div>
    </div>
  )
}

export default memo(index)
