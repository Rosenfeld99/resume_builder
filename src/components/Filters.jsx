import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { MdLayersClear } from 'react-icons/md'
import { slideUpDownWithScale } from '../animations'
import { FiltersData } from '../utils/helpers/helpers'
import useTemplate from '../hooks/useTemplate'

const Filters = () => {
    const [isClearHover, setIsClearHover] = useState(false)
    const { currentTag, setCurrentTag } = useTemplate()

    return (
        <div className='w-full flex items-center justify-start py-4 pl-4 md:pl-10 lg:pl-0'>
            <div onClick={() => setCurrentTag(null)} className=" border border-gray-300 rounded-md bg-gray-200 relative px-3 py-2 mr-2 cursor-pointer group hover:shadow-md "
                onMouseEnter={() => setIsClearHover(true)}
                onMouseLeave={() => setIsClearHover(false)}
            >
                <MdLayersClear className=' text-xl' />
                <AnimatePresence>
                    {isClearHover && <motion.div
                        {...slideUpDownWithScale}
                        className=" absolute -top-8 -left-2 bg-white shadow-md rounded-md px-2 py-1"
                    >
                        <p className=' whitespace-nowrap text-sm'>Clear all</p>

                    </motion.div>}
                </AnimatePresence>
            </div>

            {/* render tags */}

            <div className=" w-full flex items-center justify-start overflow-x-scroll gap-6 scrollbar-none">
                {FiltersData && FiltersData?.map((item, index) => (
                    <div onClick={() => setCurrentTag(item?.value)} key={item?.id} className={` whitespace-nowrap border border-gray-300 rounded-md px-6 py-2 cursor-pointer gap-6 group hover:shadow-md text-gray-700 hover:bg-gray-200 ${currentTag == item.value && "bg-gray-300"}`}>
                        {item?.label}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Filters