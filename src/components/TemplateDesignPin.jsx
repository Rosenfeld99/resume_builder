import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { FadeInOutWIthOpacity, scaleInOut } from '../animations'
import { BiFolderPlus, BiHeart } from 'react-icons/bi'
import userUser from '../hooks/userUser'

const TemplateDesignPin = ({ item, index }) => {
    const {saveToCollections} = userUser()

    const addToCollections = async (e) => {
        e.stopPropagation()
        await saveToCollections(item)
    }

    const addToFavorite = () => {

    }
    return (
        <motion.div
            {...scaleInOut(index)}
        >
            <div className=' aspect-[3/4] rounded-md bg-gray-200 overflow-hidden relative'>
                <img src={item?.imageURL} className=' w-full h-full object-cover' alt="" />
                <AnimatePresence>
                    <motion.div {...FadeInOutWIthOpacity}
                        className=' absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer '
                    >
                        <div className=" flex flex-col items-end justify-start w-full gap-8">
                            <InnerIconBox Icon={BiFolderPlus} label={"Add to collections"} onAction={addToCollections} />
                            <InnerIconBox Icon={BiHeart} label={"Add to favourites"} onAction={addToFavorite} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

        </motion.div>
    )
}

const InnerIconBox = ({ label, Icon, onAction }) => {
    const [isHover, setIsHover] = useState(false)
    return (
        <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} onClick={onAction} className=" w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative">
            <Icon />
            {isHover && <AnimatePresence>
                <motion.div initial={{opacity:0,scale:0.6,x:50}} animate={{opacity:1,scale:1,x:0}} exit={{opacity:0,scale:0.6,x:50}} className=' px-3 py-2 rounded-md bg-gray-200 absolute text-sm text-gray-700 whitespace-nowrap -left-40 after:w-2 after:h-2 after:bg-gray-200 after:-right-1 after:top-3.5 after:absolute after:rotate-45'>
                    <p>{label}</p>
                </motion.div>
            </AnimatePresence>}
        </div>
    )
}

export default TemplateDesignPin