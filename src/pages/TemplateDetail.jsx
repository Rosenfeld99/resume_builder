import React, { useEffect } from 'react';
import Header from '../components/Header';
import { Link, useParams } from 'react-router-dom';
import useTemplate from '../hooks/useTemplate';
import { MainLoading } from '../components';
import { FaHome } from 'react-icons/fa';

const TemplateDetail = () => {
  const { fetchSingleTemplateByID, isLoadingSingleTemplate, templateSingle } = useTemplate();
  const { templateID } = useParams();

  useEffect(() => {
    if (templateID) {
      fetchSingleTemplateByID(templateID);
    }
  }, [templateID, fetchSingleTemplateByID]);

  if (isLoadingSingleTemplate) {
    return <MainLoading />;
  }

  console.log(templateSingle);

  return (
    <div className=''>
      <Header />
      {/* Render the details of the template here using templateSingle */}
      {templateSingle && (
        <div className=' w-full h-full flex items-center justify-start flex-col px-4 py-12'>
          {/* bread crup */}
          <div className=" w-full flex items-center pb-8 gap-2">
            <Link to={'/'} className=' flex items-center justify-center gap-2 text-gray-600'>
              <FaHome /> Home
            </Link>
            <p>/</p>
            <p>{templateSingle.name}</p>
          </div>
          <div className=" w-full grid grid-cols-3 gap-4 h-full">

            <div className="col-span-2 bg-green-500 h-full flex-1">06</div>
            <div className="bg-blue-500">07</div>
          </div>


        </div>
      )}
    </div>
  );
};

export default TemplateDetail;
