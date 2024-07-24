import React from 'react'
import Header from '../components/Header'
import Filters from '../components/Filters'
import useTemplate from '../hooks/useTemplate'
import { AnimatePresence } from 'framer-motion'
import { TemplateDesignPin } from '../components'

const HomeScreen = () => {
  const { isLoadingTemplates, templates, isError } = useTemplate()
  console.log(templates);
  return (
    <div>
      {/* header */}
      <Header />
      <div className=" w-full px-4 py-6 flex-col flex items-center justify-center">
        {/* filter section */}
        <Filters />

        {/* resume list */}
        {isError ? <React.Fragment>
          <p className=' text-lg text-gray-700'>
            Somthing went worng.. try agen later
          </p>
        </React.Fragment> :
          <React.Fragment>
            <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
              <RenderTemplate templates={templates} />
            </div>
          </React.Fragment>}
      </div>
    </div>
  )
}

const RenderTemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates?.length > 0 ? <React.Fragment>
        <AnimatePresence>
          {templates && templates?.map((item, index) => (
            <TemplateDesignPin item={item} index={index} key={item?.id} />
          ))}
        </AnimatePresence>
      </React.Fragment> : <React.Fragment>No Data Found</React.Fragment>}
    </React.Fragment>
  )
}

export default HomeScreen