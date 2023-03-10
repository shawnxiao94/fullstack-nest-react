import React from 'react'
import ReactParticleLine from 'react-particle-line'
import DataHeader from './components/DataHeader'
import Equipment from './components/Equipment'
import './index.less'

function index() {
  return (
    <ReactParticleLine>
      <div className="data-header-homeBox">
        <div className="header">
          <DataHeader />
        </div>
        <div className="topLeft">
          <Equipment />
        </div>
      </div>
    </ReactParticleLine>
  )
}

export default index
