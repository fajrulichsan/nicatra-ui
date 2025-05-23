import React from 'react'
import CmsTemplate from '../components/CmsTemplate'

const Dashboard = () => {
  return (
    <CmsTemplate>
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-4 text-gray-600">Welcome to the Dashboard!</p>
        </div>
    </CmsTemplate>
  )
}

export default Dashboard