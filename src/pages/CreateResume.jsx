import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { TemplatesData } from '../utils/helpers/helpers'

const CreateResume = () => {
  return (
    <div className=' w-full flex flex-col items-center justify-center py-2 md:py-5'>
      <Routes>
        {TemplatesData?.map((template, index) => (
          <Route key={template?.id} path={`/${template?.name}`} Component={template?.component} />
        ))}
      </Routes>
    </div>
  )
}

export default CreateResume