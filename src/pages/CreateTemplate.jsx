import React, { useState } from 'react'
import Header from '../components/Header'
import { IoMdCloudUpload } from 'react-icons/io'
import { initialTags } from '../utils/helpers/helpers'
import { PuffLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { db, storage } from '../config/firebase.config'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { FaTrashCan } from 'react-icons/fa6'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import useTemplate from '../hooks/useTemplate'

const CreateTemplate = () => {
    const { templates, fetchTemplates, isLoadingTemplates } = useTemplate()
    console.log(templates);
    const [templateForm, setTemplateForm] = useState({
        title: "",
        tagsList: null,
        imageURL: null
    })

    const [imageAssets, setImageAssets] = useState({
        isImageLoading: false,
        uri: null,
        progress: 0
    })

    // tag list with toggel actions
    const handleToggleTag = (tag) => {
        if (templateForm?.tagsList?.includes(tag)) {
            setTemplateForm({ ...templateForm, tagsList: templateForm?.tagsList?.filter((selected) => selected != tag) })
        } else {
            const updateTagList = templateForm?.tagsList || []
            updateTagList.push(tag)
            setTemplateForm({ ...templateForm, tagsList: updateTagList })
        }
    }

    // select image from the cloud with progress viwed
    const handleSelectImage = (e) => {
        setImageAssets((prev) => ({ ...prev, isImageLoading: true }))
        const file = e.target.files[0];
        // console.log(file);
        if (file && isAllowedTypes(file)) {
            const storageRef = ref(storage, `Templates/${Date.now()}-${file?.name}`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const calcProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageAssets((prev) => ({ ...prev, progress: calcProgress }))
                },
                (error) => {
                    toast.error(`Error : ${error.message}`)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        setImageAssets((prev) => ({ ...prev, uri: downloadURL }))
                        toast.success("Image Upload")

                        setTimeout(() => {
                            setImageAssets((prev) => ({ ...prev, isImageLoading: false }))
                        }, 1000)
                    });
                }
            );
        } else {
            toast.info("Invalid File Format")
        }

    }

    // validat types
    const isAllowedTypes = (file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
        return allowedTypes.includes(file.type)
    }

    // cancel image will be delete image from the cloud
    const handleDeleteImageFromCloud = async () => {
        setImageAssets((prev) => ({ ...prev, isImageLoading: true }))
        const desertRef = ref(storage, imageAssets.uri);

        // Delete the file
        deleteObject(desertRef).then(() => {
            toast.success("Image Deleted")
            setTimeout(() => {
                setImageAssets((prev) => ({ ...prev, progress: 0, uri: null, isImageLoading: false }))
            }, 1000)
        }).catch((error) => {
            toast.error(`Error : ${error.message}`)
        });
    }

    // push new template to cloud
    const pushToCloud = async () => {
        const timestemp = serverTimestamp()
        const id = `${Date.now()}`

        const newDoc = {
            id: id,
            title: templateForm.title,
            imageURL: imageAssets.uri,
            tags: templateForm?.tagsList || [],
            name: templates && templates?.length > 0 ? `template${templates?.length + 1}` : 'template1',
            timestemp: timestemp
        }

        await setDoc(doc(db, "templates", id), newDoc).then(() => {
            setTemplateForm({
                title: "",
                tagsList: null,
                imageURL: null
            })
            setImageAssets({
                isImageLoading: false,
                uri: null,
                progress: 0
            })
            toast.success("Template Created")
            fetchTemplates()
        }).catch(error => {
            toast.error(`Error : ${error.message}`)
        })
    }

    console.log(templateForm);

    return (
        <div>
            <Header />
            <div className=" md:px-10 md:py-5 p-5">

                <h3 className=' text-md capitalize '>create a new template</h3>
                {/* main section */}
                <div className=" flex md:flex-row gap-3 flex-col w-full ">

                    {/* left section */}
                    <div className=" w-full flex flex-col gap-3 md:w-1/3 md:max-w-96">
                        {/* tempid */}
                        <div className=" text-sm text-gray-400 w-full flex items-center justify-end">TEMPID : <span className='text-black'>{templates && templates?.length > 0 ? `template${templates?.length + 1}` : 'template1'}</span></div>

                        {/* input section */}
                        <input className=' px-3 py-2 rounded-md outline-none bg-transparent border-gray-300 border-2 w-full' type="text" placeholder='Template title' value={templateForm?.title} onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })} />

                        {/* upLoadImage section */}
                        <div className=" w-full aspect-[3/4] rounded-md overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                            {imageAssets?.isImageLoading ? <div className='flex flex-col w-full h-full items-center justify-center'><PuffLoader color='#bbb' size={40} />
                                <div className="">{imageAssets?.progress?.toFixed(0)}%</div>
                            </div> :
                                <React.Fragment>
                                    {!imageAssets?.uri ?
                                        <label id='uploadImage' className=" cursor-pointer flex flex-col w-full h-full items-center justify-center">
                                            <IoMdCloudUpload className=' text-4xl' />
                                            <span className=' text-gray-400'>Click to upload </span>
                                            <input id='uploadImage' onChange={handleSelectImage} type="file" className=' hidden' accept='.jpg,.jpeg,.png' />
                                        </label>
                                        : <div className=' w-full h-full relative backdrop-blur-md'>
                                            <img className='w-full h-full object-cover backdrop-blur-md' loading='lazy' src={imageAssets?.uri} alt="" />
                                            <button type='button' onClick={handleDeleteImageFromCloud} className=" absolute top-4 right-4 p-2 lg:p-3 bg-red-600 text-white rounded-md">
                                                <FaTrashCan className=' text-xl' />
                                            </button>
                                        </div>}
                                </React.Fragment>
                            }
                        </div>

                        {/* tag section */}
                        <div className=" flex flex-wrap gap-2">
                            {initialTags?.map((tag, index) => (
                                <div onClick={() => handleToggleTag(tag)} className={` px-2 py-1 text-sm cursor-pointer rounded-md ${templateForm?.tagsList?.includes(tag) ? " bg-blue-500 text-white border-2" : " border-2 border-gray-300 text-gray-400"}`} key={index}>{tag}</div>
                            ))}
                        </div>

                        {/* Save section */}
                        <button type='button' onClick={pushToCloud} className=' w-full p-3 bg-blue-700 rounded-md text-white active:scale-75 duration-300'>Save</button>

                    </div>

                    {/* right section */}
                    <div className=" p-2 w-full flex-1 grid grid-cols-2 h-full overflow-y-auto lg:grid-cols-3  gap-3">
                        {templates?.map((template, index) => (
                            <div key={template?.id} className=" px-8  py-5 rounded-md overflow-hidden  bg-gray-200 backdrop-blur-sm">
                                <img className='aspect-[3/4] object-cover shadow-2xl' loading='lazy' src={template?.imageURL} alt="" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateTemplate