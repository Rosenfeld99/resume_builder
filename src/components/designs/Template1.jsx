
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../config/firebase.config";
import { getTemplateDetailEditByUser } from "../../api";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

import { FaHouse, FaTrash, FaPenToSquare, FaPencil, FaPlus, } from "react-icons/fa6";
import { BiSolidBookmarks } from "react-icons/bi";
import { BsFiletypePdf, BsFiletypePng, BsFiletypeJpg, BsFiletypeSvg, } from "react-icons/bs";

import { AnimatePresence, motion } from "framer-motion";
import { FadeInOutWIthOpacity, opacityINOut } from "../../animations";
import MainLoading from "../MainLoading";
import useUser from "../../hooks/userUser";
import { educationDumy, experiencesDumy, formDataDumy, skillsDumy } from "../../utils/db/dataDumy";

const Template1 = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const templateName = pathname?.split("/")?.slice(-1);
  const [searchParams] = useSearchParams()
  const loadedTemplateId = searchParams.get("templateID");
  // console.log(pathname, templateName, loadedTemplateId);


  const [isEdit, setIsEdit] = useState(false);
  const { currentUser } = useUser();

  const resumeRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(formDataDumy || {});
  const [experiences, setExperiences] = useState(experiencesDumy || []);
  const [skills, setSkills] = useState(skillsDumy || []);
  const [education, setEducation] = useState(educationDumy || []);
  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    imageURL: null,
  });

  const fetchData = useCallback(async () => {
    if (!currentUser?.id || !templateName) return;

    try {
      const data = await getTemplateDetailEditByUser(currentUser.id, `${templateName}-${currentUser.id}`);
      // console.log("Fetched data:", data);
      if (data) {
        setFormData(data.formData || formDataDumy || {});
        setExperiences(data.experiences || experiencesDumy || []);
        setSkills(data.skills || skillsDumy || []);
        setEducation(data.education || educationDumy || []);
        setImageAsset(prevAsset => ({
          ...prevAsset,
          imageURL: data.userProfilePic || null,
        }));
      }
      setError(null)
    } catch (error) {
      console.error("Error fetching resume data:", error);
      setError(`Error : ${error?.message}`)
    } finally {
      setLoading(false)
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditable = () => {
    setIsEdit(!isEdit);
    var inputs = document.querySelectorAll("input");
    var textarea = document.querySelectorAll("textarea");

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].readOnly = !inputs[i].readOnly;
    }

    for (var i = 0; i < textarea.length; i++) {
      textarea[i].readOnly = !textarea[i].readOnly;
    }
  };

  // image upload to the cloud
  const handleFileSelect = async (event) => {
    setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    // console.log(event.target.files[0]);
    const file = event.target.files[0];
    if (file && isAllowed(file)) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const dataURL = event.target.result;
        console.log("Data URL:", dataURL);

        // You can now use the dataURL as needed, e.g., to display an image.
        setImageAsset((prevAsset) => ({
          ...prevAsset,
          imageURL: dataURL,
        }));
      };

      // Read the file as a Data URL
      reader.readAsDataURL(file);
    } else {
      toast.error("Invalid File Format");
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  // delete an image
  const deleteImageObject = () => {
    setImageAsset((prevAsset) => ({
      ...prevAsset,
      imageURL: null,
    }));
  };

  // uploader finshed

  const handleExpChange = (index, e) => {
    const { name, value } = e.target;
    // Create a copy of the workExperiences array
    const updatedExperiences = [...experiences];
    // Update the specific field for the experience at the given index
    updatedExperiences[index][name] = value;
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const removeExperience = (index) => {
    // Create a copy of the workExperiences array and remove the experience at the given index
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const addExperience = () => {
    // Create a copy of the workExperiences array and add a new experience
    const updatedExperiences = [
      ...experiences,
      {
        year: "2012 - 2014",
        title: "Job Position Here",
        companyAndLocation: "Company Name / Location here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
      },
    ];
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const handleSkillsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSkills = [...skills];
    updatedSkills[index][name] = value;
    setSkills(updatedSkills);
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    const updatedSkills = [
      ...skills,
      {
        title: "skill1",
        percentage: "75",
      },
    ];
    setSkills(updatedSkills);
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEdu = [...education];
    updatedEdu[index][name] = value;
    setEducation(updatedEdu);
  };

  const removeEducation = (index) => {
    const updatedEdu = [...education];
    updatedEdu.splice(index, 1);
    setEducation(updatedEdu);
  };

  const addEducation = () => {
    const updatedEdu = [
      ...education,
      {
        major: "ENTER YOUR MAJOR",
        university: "Name of your university / college 2005-2009",
      },
    ];
    setEducation(updatedEdu);
  };

  const saveFormData = async () => {
    const timeStamp = serverTimestamp();
    const resume_id = `${templateName}-${currentUser?.id}`;
    const imageURL = await getImage();
    const _doc = {
      id: loadedTemplateId,
      resume_id,
      formData,
      education,
      experiences,
      skills,
      timeStamp,
      userProfilePic: imageAsset.imageURL,
      imageURL,
    };
    console.log(_doc);
    setDoc(doc(db, "users", currentUser?.id, "resumes", resume_id), _doc)
      .then(() => {
        toast.success(`Data Saved`);
      })
      .catch((err) => {
        toast.error(`Error : ${err.message}`);
      });
  };

  const getImage = async () => {
    const element = resumeRef.current;
    element.onload = async () => {
      // Call the image capture code here
    };
    element.onerror = (error) => {
      console.error("Image loading error:", error);
    };
    if (!element) {
      console.error("Unable to capture content. The DOM element is null.");
      return;
    }
    try {
      const dataUrl = await htmlToImage.toJpeg(element);
      console.log(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error("Oops, something went wrong!", error.message);
      return null; // Return a default value or handle the error appropriately
    }
  };

  const generatePDF = async () => {
    const element = resumeRef.current;
    if (!element) {
      return toast.info("Failed to get document");
    }

    try {
      const dataUrl = await htmlToImage.toPng(element);
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4"
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // const verticalMargin = (pdfHeight - imgHeight) / 2;

      pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${currentUser?.displayName}_resume.pdf`);
    } catch (err) {
      toast.error(`Error: ${err?.message}`);
    }
  };

  const generateImage = async () => {
    const element = resumeRef.current;
    if (!element) {
      return toast.info("Failed to get document");
    }

    try {
      htmlToImage.toJpeg(element).then((dataUrl) => {
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = `${currentUser?.displayName}_resume.jpeg`
        a.click()
      })
    } catch (err) {
      toast.error(`Error: ${err?.message}`);
    }
  };

  const generatePng = async () => {
    const element = resumeRef.current;
    if (!element) {
      return toast.info("Failed to get document");
    }

    try {
      htmlToImage.toPng(element).then((dataUrl) => {
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = `${currentUser?.displayName}_resume.png`
        a.click()
      })
    } catch (err) {
      toast.error(`Error: ${err?.message}`);
    }

  };

  const generateSvg = async () => {
    const element = resumeRef.current;
    if (!element) {
      return toast.info("Failed to get document");
    }

    try {
      htmlToImage.toSvg(element).then((dataUrl) => {
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = `${currentUser?.displayName}_resume.svg`
        a.click()
      })
    } catch (err) {
      toast.error(`Error: ${err?.message}`);
    }
  };

  if (loading) return <MainLoading />;

  if (error) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          Error While fetching the data
        </p>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-center justify-start gap-4">
      {/* bread crump */}
      <div className="w-full flex items-center gap-2 px-2 lg:px-16">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse />
          Home
        </Link>
        <p
          className="text-txtPrimary cursor-pointer"
          onClick={() => navigate(-1)}
        >
          / Template1 /
        </p>
        <p>Edit</p>
      </div>

      <div className="w-full overflow-x-hidden lg:w-[1200px] grid grid-cols-1 lg:grid-cols-12 px-2 lg:px-32">
        {/* template design */}
        <div className="col-span-12 md:px-4 py-6">

          {/* Download options */}
          <div className="flex items-center px-4 justify-end w-full md:gap-12 gap-3 sm:gap-6 mb-4">
            <div
              className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 cursor-pointer"
              onClick={toggleEditable}
            >
              {isEdit ? (
                <FaPenToSquare className="text-sm text-txtPrimary" />
              ) : (
                <FaPencil className="text-sm text-txtPrimary" />
              )}
              <p className="text-sm text-txtPrimary">Edit</p>
            </div>

            <div
              className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 cursor-pointer"
              onClick={saveFormData}
            >
              <BiSolidBookmarks className="text-sm text-txtPrimary" />
              <p className="text-sm text-txtPrimary">Save</p>
            </div>

            <div className=" flex items-center justify-center gap-2">
              <p className="text-sm text-txtPrimary">Download : </p>
              <BsFiletypePdf
                className="text-2xl text-txtPrimary cursor-pointer"
                onClick={generatePDF}
              />
              <BsFiletypePng
                onClick={generatePng}
                className="text-2xl text-txtPrimary cursor-pointer"
              />
              <BsFiletypeJpg
                className="text-2xl text-txtPrimary cursor-pointer"
                onClick={generateImage}
              />
              <BsFiletypeSvg
                onClick={generateSvg}
                className="text-2xl text-txtPrimary cursor-pointer"
              />
            </div>
          </div>

          <div className="w-full h-auto grid grid-cols-12" ref={resumeRef}>
           
            <div className="md:col-span-4 col-span-full bg-black flex flex-col items-center justify-start">

              {/* image setion */}
              <div className="w-full md:h-80 bg-gray-300 flex items-center justify-center">
                {!imageAsset.imageURL ? (
                  <React.Fragment>
                    <label className=" w-full cursor-pointer h-full">
                      <div className="w-full flex flex-col items-center justify-center h-full">
                        <div className="w-full flex flex-col justify-center items-center cursor-pointer">
                          <img
                            src={'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                            className="w-full h-80 object-cover"
                            alt=""
                          />
                        </div>
                      </div>

                      {isEdit && (
                        <input
                          type="file"
                          className="w-0 h-0"
                          accept=".jpeg,.jpg,.png"
                          onChange={handleFileSelect}
                        />
                      )}
                    </label>
                  </React.Fragment>
                ) : (
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset.imageURL}
                      alt="uploaded image"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {isEdit && (
                      <div
                        className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                        onClick={deleteImageObject}
                      >
                        <FaTrash className="text-sm text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* educations */}
              <div className="w-full flex flex-col items-center justify-start pl-8 mt-4 gap-6">
                <div className="w-full">
                  <p className="uppercase text-lg font-semibold text-gray-100">
                    Education
                  </p>
                  <div className="w-full h-[2px] bg-yellow-400 mt-2"></div>
                  <AnimatePresence>
                    {education &&
                      education?.map((edu, i) => (
                        <motion.div
                          key={i}
                          {...opacityINOut(i)}
                          className="w-full pl-4 mt-3 relative"
                        >
                          <input
                            type="text"
                            readOnly="true"
                            name="major"
                            value={edu.major}
                            onChange={(e) => handleEducationChange(i, e)}
                            className={`bg-transparent outline-none border-none text-sm font-semibold uppercase  text-gray-100  ${isEdit && "text-yellow-400 w-full"
                              }`}
                          />

                          <textarea
                            readOnly="true"
                            className={`text-xs text-gray-200 mt-2  w-full  outline-none border-none ${isEdit ? "bg-[#1c1c1c]" : "bg-transparent"
                              }`}
                            name="university"
                            value={edu.university}
                            onChange={(e) => handleEducationChange(i, e)}
                            rows="2"
                            style={{
                              maxHeight: "auto",
                              minHeight: "40px",
                              resize: "none",
                            }}
                          />
                          <AnimatePresence>
                            {isEdit && (
                              <motion.div
                                {...FadeInOutWIthOpacity}
                                onClick={() => removeEducation(i)}
                                className="cursor-pointer absolute right-2 top-0"
                              >
                                <FaTrash className="text-sm text-gray-100" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {isEdit && (
                    <motion.div
                      {...FadeInOutWIthOpacity}
                      onClick={addEducation}
                      className="cursor-pointer"
                    >
                      <FaPlus className="text-base text-gray-100" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* reference */}
                <div className="w-full">
                  <p className="uppercase text-lg font-semibold text-gray-100">
                    Reference
                  </p>
                  <div className="w-full h-[2px] bg-yellow-400 mt-2"></div>
                  <div className="w-full pl-4 mt-3">
                    <input
                      value={formData.refererName}
                      onChange={handleChange}
                      name="refererName"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-base tracking-widest capitalize text-gray-100 w-full ${isEdit && "bg-[#1c1c1c]"
                        }`}
                    />

                    <input
                      value={formData.refererRole}
                      onChange={handleChange}
                      name="refererRole"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs capitalize text-gray-300 w-full ${isEdit && "bg-[#1c1c1c]"
                        }`}
                    />
                  </div>
                </div>
              </div>
              
              {/* prefomence */}
              <div className="w-full flex flex-col items-start justify-start mt-6 gap-6">
                <div className="w-full grid grid-cols-12">
                  <div className="col-span-3 w-full h-6 bg-yellow-400"></div>
                  <div className="col-span-9">
                    <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
                      <p className="text-sm font-semibold text-gray-200">
                        Phone
                      </p>
                    </div>
                    <input
                      value={formData.mobile}
                      onChange={handleChange}
                      name="mobile"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs px-3 mt-2 text-gray-200 w-full ${isEdit && "bg-[#1c1c1c]"
                        }`}
                    />
                  </div>
                </div>

                {/* email */}
                <div className="w-full grid grid-cols-12">
                  <div className="col-span-3 w-full h-6 bg-yellow-400"></div>
                  <div className="col-span-9">
                    <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
                      <p className="text-sm font-semibold text-gray-200">
                        Email
                      </p>
                    </div>
                    <input
                      value={formData.email}
                      onChange={handleChange}
                      name="email"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs px-3 mt-2 text-gray-200 w-full ${isEdit && "bg-[#1c1c1c]"
                        }`}
                    />
                  </div>
                </div>

                {/* website */}
                <div className="w-full grid grid-cols-12">
                  <div className="col-span-3 w-full h-6 bg-yellow-400"></div>
                  <div className="col-span-9">
                    <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
                      <p className="text-sm font-semibold text-gray-200">
                        Website
                      </p>
                    </div>

                    <input
                      value={formData.website}
                      onChange={handleChange}
                      name="website"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs px-3 mt-2 text-gray-200 w-full ${isEdit && "bg-[#1c1c1c]"
                        }`}
                    />
                  </div>
                </div>

                {/* address */}
                <div className="w-full grid grid-cols-12">
                  <div className="col-span-3 w-full h-6 bg-yellow-400"></div>
                  <div className="col-span-9">
                    <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
                      <p className="text-sm font-semibold text-gray-200">
                        Address
                      </p>
                    </div>

                    <textarea
                      readOnly="true"
                      className={`text-xs text-gray-200 mt-2 px-3  w-full  outline-none border-none ${isEdit ? "bg-[#1c1c1c]" : "bg-transparent"
                        }`}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      style={{
                        maxHeight: "auto",
                        minHeight: "40px",
                        resize: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
              
            </div>

            <div className="md:col-span-8 col-span-full flex flex-col items-center justify-start py-6 bg-white">
              <div className="w-full py-6"></div>
              {/* title */}
              <div className="w-full px-8 py-6 bg-yellow-500">
                <div className="flex items-center justify-start ">
                  <input
                    type="text"
                    readOnly="true"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className={`bg-transparent outline-none border-none text-3xl font-sans uppercase tracking-wider text-txtDark font-extrabold ${isEdit && "text-white w-full"
                      }`}
                  />
                </div>

                <input
                  value={formData.professionalTitle}
                  onChange={handleChange}
                  name="professionalTitle"
                  type="text"
                  readOnly="true"
                  className={`bg-transparent outline-none border-none text-xl tracking-widest uppercase text-txtPrimary w-full ${isEdit && "text-white"
                    }`}
                />
              </div>

              {/* about me */}
              <div className="w-full px-8 py-6 flex flex-col items-start justify-start gap-6">
                <div className="w-full">
                  <p className="uppercase text-xl tracking-wider">About Me</p>
                  <div className="w-full h-1 bg-txtDark my-3"></div>
                  <textarea
                    readOnly="true"
                    className={`text-base text-txtPrimary tracking-wider w-full  outline-none border-none ${isEdit ? "bg-gray-200" : "bg-transparent"
                      }`}
                    name="personalDescription"
                    value={formData.personalDescription}
                    onChange={handleChange}
                    rows="4"
                    style={{
                      minHeight: "100px",
                      width: "100%",
                      height: "100px",
                      resize: "none",
                    }}
                  />
                </div>

                {/* experience */}
                <div className="w-full">
                  <p className="uppercase text-xl tracking-wider">
                    Work Experience
                  </p>
                  <div className="w-full h-1 bg-txtDark my-3"></div>
                  <div className="w-full flex flex-col items-center justify-start gap-4">
                    <AnimatePresence>
                      {experiences &&
                        experiences?.map((exp, i) => (
                          <motion.div
                            {...opacityINOut(i)}
                            className="w-full grid grid-cols-12"
                            key={i}
                          >
                            <div className="col-span-4">
                              <input
                                value={exp.year}
                                onChange={(e) => handleExpChange(i, e)}
                                name="year"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none text-base tracking-eide uppercase text-txtDark w-full ${isEdit ? "bg-gray-200" : "bg-transparent"
                                  }`}
                              />
                            </div>
                            <div className="col-span-8 relative">
                              <AnimatePresence>
                                {isEdit && (
                                  <motion.div
                                    {...FadeInOutWIthOpacity}
                                    onClick={() => removeExperience(i)}
                                    className="cursor-pointer absolute right-0 top-2"
                                  >
                                    <FaTrash className="text-base text-txtPrimary" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <input
                                value={exp.title}
                                onChange={(e) => handleExpChange(i, e)}
                                name="title"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none font-sans text-lg tracking-wide capitalize text-txtDark w-full ${isEdit ? "bg-gray-200" : "bg-transparent"
                                  }`}
                              />

                              <input
                                value={exp.companyAndLocation}
                                onChange={(e) => handleExpChange(i, e)}
                                name="companyAndLocation"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none text-sm tracking-wide capitalize text-txtPrimary w-full ${isEdit ? "bg-gray-200" : "bg-transparent"
                                  }`}
                              />

                              <textarea
                                readOnly="true"
                                className={`text-xs mt-4  text-txtPrimary tracking-wider w-full  outline-none border-none ${isEdit ? "bg-gray-200" : "bg-transparent"
                                  }`}
                                name="description"
                                value={exp.description}
                                onChange={(e) => handleExpChange(i, e)}
                                rows="3"
                                style={{
                                  maxHeight: "auto",
                                  minHeight: "60px",
                                  resize: "none",
                                }}
                              />
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                    <AnimatePresence>
                      {isEdit && (
                        <motion.div
                          {...FadeInOutWIthOpacity}
                          onClick={addExperience}
                          className="cursor-pointer"
                        >
                          <FaPlus className="text-base text-txtPrimary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* skills */}
                <div className="w-full">
                  <p className="uppercase text-xl tracking-wider">Skills</p>
                  <div className="w-full h-1 bg-txtDark my-3"></div>
                  <div className="w-full flex flex-wrap items-center justify-start gap-4">
                    <AnimatePresence>
                      {skills &&
                        skills?.map((skill, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="flex-1"
                            style={{ minWidth: 225 }}
                          >
                            <div className="w-full flex items-center justify-between">
                              <div className="flex items-center justify-center">
                                <input
                                  value={skill.title}
                                  onChange={(e) => handleSkillsChange(i, e)}
                                  name="title"
                                  type="text"
                                  readOnly="true"
                                  className={` outline-none border-none text-base tracking-wide capitalize font-semibold text-txtPrimary w-full ${isEdit ? "bg-gray-200" : "bg-transparent"
                                    }`}
                                />

                                <AnimatePresence>
                                  {isEdit && (
                                    <motion.input
                                      {...FadeInOutWIthOpacity}
                                      value={skill.percentage}
                                      onChange={(e) => handleSkillsChange(i, e)}
                                      name="percentage"
                                      type="text"
                                      className={` outline-none border-none text-base tracking-wide capitalize font-semibold text-txtPrimary w-full ${isEdit
                                        ? "bg-gray-200"
                                        : "bg-transparent"
                                        }`}
                                    />
                                  )}
                                </AnimatePresence>
                              </div>

                              <AnimatePresence>
                                {isEdit && (
                                  <motion.div
                                    {...FadeInOutWIthOpacity}
                                    onClick={() => removeSkill(i)}
                                    className="cursor-pointer "
                                  >
                                    <FaTrash className="text-base text-txtPrimary" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <div className="relative mt-2 w-full h-1 rounded-md bg-gray-400">
                              <div
                                className="h-full rounded-md bg-gray-600"
                                style={{
                                  width: `${skill.percentage}%`,
                                  transition: "width 0.3s ease",
                                }}
                              ></div>
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {isEdit && (
                      <div className="w-full  flex items-center justify-center py-4">
                        <motion.div
                          {...FadeInOutWIthOpacity}
                          onClick={addSkill}
                          className="cursor-pointer"
                        >
                          <FaPlus className="text-base text-txtPrimary" />
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template1;

