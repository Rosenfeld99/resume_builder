import React, { useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useTemplate from '../hooks/useTemplate';
import { MainLoading, TemplateDesignPin } from '../components';
import { FaHome } from 'react-icons/fa';
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import useUser from '../hooks/userUser';
import { AnimatePresence } from 'framer-motion';

const TemplateDetail = () => {
  const { currentUser, saveToCollections, saveToFavouries } = useUser();
  const { fetchSingleTemplateByID, templates, isLoadingSingleTemplate, templateSingle, setTemplateSingle, handleDeleteTemplate } = useTemplate();
  const { templateID } = useParams();
  const navigation = useNavigate()

  useEffect(() => {
    if (templateID) {
      fetchSingleTemplateByID(templateID);
    }
  }, [templateID, fetchSingleTemplateByID]);

  const addToCollections = useCallback(async () => {
    await saveToCollections(templateSingle);
  }, [saveToCollections, templateSingle]);

  const addToFavorite = useCallback(async () => {
    await saveToFavouries(templateSingle);
  }, [saveToFavouries, templateSingle]);

  const deleteTemplate = useCallback(async (tempId) => {
    await handleDeleteTemplate(tempId);
    navigation(-1)
  }, []);

  if (isLoadingSingleTemplate) {
    return <MainLoading />;
  }

  return (
    <div className=''>
      <Header />
      {/* Render the details of the template here using templateSingle */}
      {templateSingle && (
        <div className='w-full h-full flex items-center justify-start flex-col px-4 py-12'>
          {/* breadcrumb */}
          <div className="w-full flex items-center pb-8 gap-2">
            <Link to={'/'} className='flex items-center justify-center gap-2 text-gray-600'>
              <FaHome /> Home
            </Link>
            <p>/</p>
            <p>{templateSingle.name}</p>
          </div>

          <div className="w-full grid grid-cols-3 gap-4 h-full">
            <div className="md:col-span-2 col-span-full overflow-hidden h-full min-h-[50vh] flex-1">
              <img className='aspect-[3/4] object-cover rounded-md bg-gray-200' loading='lazy' src={templateSingle?.imageURL} alt="" />
              {/* title and other option */}
              <div className="flex items-center justify-between w-full">
                <div className="text-lg py-4 text-gray-700 font-semibold">{templateSingle?.title}</div>
                {templateSingle?.favouries?.length > 0 && <div className="flex items-center gap-2">
                  <BiSolidHeart className='text-red-500' />
                  {templateSingle?.favouries?.length}
                  <span>Likes</span>
                </div>}
              </div>
              {/* buttons section */}
              <div className='flex items-center gap-2 flex-wrap'>
                {/* toggle collections */}
                <button onClick={addToCollections} className="flex items-center gap-3 px-3 py-1 border-2 border-gray-300 rounded-md">
                  <span>
                    {currentUser?.collections?.includes(templateSingle?.id) ? "Remove from collections" : "Add to collections"}
                  </span>
                  {currentUser?.collections?.includes(templateSingle?.id) ? <BiSolidFolderPlus /> : <BiFolderPlus />}
                </button>
                {/* toggle favourites */}
                <button onClick={addToFavorite} className="flex items-center gap-3 px-3 py-1 border-2 border-gray-300 rounded-md">
                  <span>
                    {templateSingle?.favouries?.includes(currentUser?.id) ? "Remove from favourites" : "Add to favourites"}
                  </span>
                  {templateSingle?.favouries?.includes(currentUser?.id) ? <BiSolidHeart /> : <BiHeart />}
                </button>
              </div>
            </div>

            {/* right section  */}
            <div className=" flex flex-col items-center md:col-span-1 col-span-full gap-4 mr-4">
              <div className="h-72 relative bg-gray-200 w-full rounded-md" style={{ background: 'url("https://images.pexels.com/photos/409696/pexels-photo-409696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', backgroundPosition: "center", backgroundSize: "cover", }}>
                <div className=" flex items-center justify-center h-full bg-[#00000051]">
                  <Link to={'/'}>
                    <button type='button' className='border-2 border-white text-white px-3 py-2 rounded-md text-lg'>
                      Descover more
                    </button>
                  </Link>
                </div>
              </div>

              <div className=" flex items-center md:flex-col w-full gap-3">
                {/* Edit this template */}
                {currentUser &&
                  <Link className=' w-full' to={`/resume/${templateSingle?.name}?templateID=${templateSingle?.id}`}>
                    <button className=' bg-emerald-600 w-full rounded-md text-white text-xl p-3'>
                      Get template
                    </button>
                  </Link>
                }
                {/* Delete this template */}
                {currentUser?.role == "admin" &&
                  <button onClick={() => deleteTemplate(templateSingle?.id)} className=' bg-red-600 w-full rounded-md text-white text-xl p-3'>
                    Delete template
                  </button>
                }
              </div>

              {/* tags section */}
              <div className=" flex items-center flex-wrap gap-3">
                {templateSingle?.tags?.map((tag, index) => (
                  <div key={index} className={` whitespace-nowrap border border-gray-300 rounded-md px-3 py-1 cursor-pointer gap-6 group hover:shadow-md text-gray-700 hover:bg-gray-200`}>
                    {tag}
                  </div>
                ))}
              </div>
            </div>

          </div>
          {/* might alos like */}
          {templates?.length > 1 && <div>
            <div className=" text-xl font-semibold text-gray-700 pt-6 pb-4">
              You might also like
            </div>

            <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
              <AnimatePresence>
                {templates?.filter((item) => item?.id != templateSingle?.id)?.map((item, index) => (
                  <TemplateDesignPin item={item} index={index} key={item?.id} />
                ))}
              </AnimatePresence>

            </div>
          </div>}
        </div>
      )}
    </div>
  );
};

export default TemplateDetail;
