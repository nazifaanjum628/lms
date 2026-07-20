import React, { useContext, useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'



const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext)

  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)
  const [showChapterPopup, setShowChapterPopup] = useState(false)
  const [tempChapterTitle, setTempChapterTitle] = useState('')
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  })
  const [resources, setResources] = useState([]); 
const [uploadingResource, setUploadingResource] = useState(false);
  
  
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = chapterId
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        }
        setChapters([...chapters, newChapter])
        setTempChapterTitle('')
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId))
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      )
    }
  }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId)
      setShowPopup(true)
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1)
          }
          return chapter
        })
      )
    }
  }

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
            resources: resources,
          }
          chapter.chapterContent.push(newLecture)
        }
        return chapter
      })
    )
    setShowPopup(false)
    setLectureDetails({ lectureTitle: '', lectureDuration: '', lectureUrl: '', isPreviewFree: false })
    setResources([]);
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        category,
        tags,
        courseContent: chapters,
      }
      const token = await getToken()
      const { data } = await axios.post(
        backendUrl + '/api/educator/add-course',
        { courseData },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        setCourseTitle('')
        setCoursePrice(0)
        setDiscount(0)
        setChapters([])
        setCategory('')
        setTags([])
        quillRef.current.root.innerHTML = ''
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleResourceUpload = async (files) => {
  if (!files || files.length === 0) return;
  setUploadingResource(true);

  try {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file)); // ← append each file

    const { data } = await axios.post(
      backendUrl + '/api/resource/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    if (data.success) {
      setResources(prev => [...prev, ...data.files]); //  append new files
      toast.success(`${data.files.length} file(s) uploaded`);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error('Upload failed');
  } finally {
    setUploadingResource(false);
  }
};

  const getYouTubeID = (url) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  return (
    <>
      <style>{`
        

        .add-course-wrap * { font-family: 'DM Sans', sans-serif; }
        .add-course-wrap .heading-font { font-family: 'Playfair Display', serif; }

        .field-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #4B5563;
          margin-bottom: 8px;
          display: block;
        }

        .field-input {
          width: 100%;
          border: 1.5px solid #E0E7FF;
          border-radius: 12px;
          padding: 13px 16px;
          font-size: 15px;
          color: #1F2937;
          background: #FAFBFE;
          outline: none;
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
        }
        .field-input:focus {
          border-color: #6366F1;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
          transform: translateY(-1px);
        }
        .field-input:hover {
          border-color: #C7D2FE;
          background: #FAFBFE;
        }

        .section-card {
          background: white;
          border: 1.5px solid #E0E7FF;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.12);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .section-card:hover {
          border-color: #C7D2FE;
          box-shadow: 0 6px 28px rgba(99, 102, 241, 0.18);
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #E0E7FF;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #EFF6FF 0%, #F0E7FF 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #EFF6FF 0%, #F0E7FF 100%);
          color: #4F46E5;
          border: 1.5px solid #C7D2FE;
          border-radius: 24px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(99, 102, 241, 0.1);
        }

        .tag-remove {
          background: none;
          border: none;
          color: #93C5FD;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          padding: 0;
          transition: all 0.15s;
        }
        .tag-remove:hover { color: #EF4444; transform: rotate(90deg); }

        .chapter-card {
          background: linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%);
          border: 1.5px solid #E0E7FF;
          border-radius: 16px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
        }
        .chapter-card:hover { 
          border-color: #C7D2FE;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.16);
          transform: translateY(-2px);
        }

        .chapter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 20px;
          cursor: pointer;
          background: linear-gradient(135deg, #fff 0%, #F8FAFC 100%);
          transition: all 0.2s ease;
        }
        .chapter-header:hover {
          background: linear-gradient(135deg, #F0F4FF 0%, #F8FAFC 100%);
        }

        .chapter-title-text {
          font-weight: 700;
          font-size: 15px;
          color: #1F2937;
          letter-spacing: 0.3px;
        }

        .lecture-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, #fff 0%, #F8FAFC 100%);
          border: 1.5px solid #E0E7FF;
          margin-bottom: 8px;
          font-size: 13px;
          color: #4B5563;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .lecture-row:hover {
          background: linear-gradient(135deg, #F0F4FF 0%, #FAFBFE 100%);
          border-color: #C7D2FE;
        }

        .add-chapter-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          border: 2.5px solid #C7D2FE;
          border-radius: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #F0F6FF 0%, #F0E7FF 100%);
          color: #4F46E5;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .add-chapter-btn:hover { 
          background: linear-gradient(135deg, #DBEAFE 0%, #E9E5FF 100%);
          border-color: #A5B4FC;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
        }

        .submit-btn {
          background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 16px 48px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 24px rgba(99, 102, 241, 0.4);
        }
        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.5);
        }
        .submit-btn:active { transform: translateY(-1px); }

        /* Modal overlay */
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(8px);
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 25px 70px rgba(0,0,0,0.2);
          border: 1.5px solid #E0E7FF;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 8px;
        }

        .modal-btn {
          width: 100%;
          background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
        }
        .modal-btn:hover { 
          opacity: 0.95;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99, 102, 241, 0.4);
        }
        .modal-btn:active {
          transform: translateY(0);
        }

        .free-badge {
          background: linear-gradient(135deg, #F0FDF4 0%, #F0E7FF 100%);
          border: 1.5px solid #BBF7D0;
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          font-size: 13px;
        }
        .free-badge:hover {
          box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2);
          transform: translateY(-2px);
        }

        .price-row { 
          display: flex; 
          gap: 20px;
          flex-wrap: wrap;
        }
        .price-row > div { 
          flex: 1;
          min-width: 200px;
        }

        /* Quill overrides */
        .add-course-wrap .ql-toolbar {
          border-radius: 12px 12px 0 0 !important;
          border: 1.5px solid #E0E7FF !important;
          border-bottom: none !important;
          background: linear-gradient(135deg, #F9FAFB 0%, #F0F4FF 100%) !important;
          padding: 12px !important;
        }
        .add-course-wrap .ql-toolbar button:hover,
        .add-course-wrap .ql-toolbar button.ql-active,
        .add-course-wrap .ql-toolbar button:focus {
          color: #4F46E5 !important;
        }
        .add-course-wrap .ql-toolbar.ql-snow .ql-picker-label {
          color: #1F2937 !important;
        }
        .add-course-wrap .ql-container {
          border-radius: 0 0 12px 12px !important;
          border: 1.5px solid #E0E7FF !important;
          border-top: none !important;
          min-height: 180px;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 15px !important;
          background: #FAFBFE !important;
        }
        .add-course-wrap .ql-editor {
          padding: 16px !important;
          color: #1F2937 !important;
          font-weight: 500 !important;
        }
        .add-course-wrap .ql-editor.ql-blank::before {
          color: #B0B9C6 !important;
          font-weight: 500 !important;
        }

        .divider { 
          height: 1px; 
          background: linear-gradient(to right, transparent, #E0E7FF, transparent);
          margin: 8px 0 20px;
        }
      `}</style>

      <div className='add-course-wrap h-screen overflow-scroll p-6 md:p-10 bg-gradient-to-br from-blue-50 via-purple-50 to-violet-50'>

        {/* Page Header */}
        <div className='mb-12 relative'>
          <div className='absolute -inset-10 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-violet-400/20 rounded-3xl blur-3xl opacity-50'></div>
          <div className='relative'>
            <div className='flex items-center gap-3 mb-4'>
              <span className='inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-violet-100 border border-blue-300 rounded-full text-xs font-bold text-blue-700 uppercase tracking-widest'>Create Course</span>
            </div>
            <h1 className='heading-font text-5xl md:text-5xl font-bold text-gray-900 mb-3'>
              Create New Course
            </h1>
            <p className='text-gray-600 text-lg font-medium leading-relaxed'>
              Build engaging content and share your expertise with learners worldwide
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='max-w-3xl flex flex-col gap-0'>

          
          <div className='section-card'>
            <div className='section-title'>
              
              Basic Information
            </div>

            <div className='flex flex-col gap-4'>
              <div>
                <label className='field-label'>Course Title</label>
                <input
                  autoComplete='off'
                  onChange={e => setCourseTitle(e.target.value)}
                  value={courseTitle}
                  type='text'
                  
                  className='field-input'
                  required
                />
              </div>

              <div>
                <label className='field-label'>Course Description</label>
                <div ref={editorRef}></div>
              </div>
            </div>
          </div>

          
          <div className='section-card'>
            <div className='section-title'>
              
              Pricing
            </div>
            <div className='price-row'>
              <div>
                <label className='field-label'>Price (USD)</label>
                <input
                  onChange={e => setCoursePrice(e.target.value)}
                  value={coursePrice}
                  type='number'
                  placeholder='0'
                  className='field-input'
                  required
                />
              </div>
              <div>
                <label className='field-label'>Discount (%)</label>
                <input
                  onChange={e => setDiscount(e.target.value)}
                  value={discount}
                  type='number'
                  placeholder='0'
                  min={0}
                  max={100}
                  className='field-input'
                  required
                />
              </div>
            </div>
          </div>

          
          <div className='section-card'>
            <div className='section-title'>
             
              Category & Tags
            </div>

            <div className='flex flex-col gap-4'>
              <div>
                <label className='field-label'>Category</label>
                <select
                  onChange={e => setCategory(e.target.value)}
                  value={category}
                  className='field-input'
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value='' disabled>Select a category</option>
                  <option value='Web Development'>Web Development</option>
                  <option value='Mobile Development'>Mobile Development</option>
                  <option value='Data Science'>Data Science</option>
                  <option value='Machine Learning'>Machine Learning</option>
                  <option value='Database'>Database</option>
                  <option value='DevOps'>DevOps</option>
                  <option value='Programming'>Programming</option>
                  <option value='Design'>Design</option>
                  <option value='Business'>Business</option>
                  <option value='Other'>Other</option>
                </select>
              </div>

              <div>
                <label className='field-label'>Tags</label>
                {tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {tags.map((tag, i) => (
                      <span key={i} className='tag-pill'>
                        {tag}
                        <button
                          type='button'
                          className='tag-remove'
                          onClick={() => setTags(tags.filter((_, index) => index !== i))}
                        >×</button>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type='text'
                    autoComplete='off'
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                          setTags([...tags, tagInput.trim().toLowerCase()])
                          setTagInput('')
                        }
                      }
                    }}
                    
                    className='field-input'
                    style={{ flex: 1 }}
                  />
                  <button
                    type='button'
                    onClick={() => {
                      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                        setTags([...tags, tagInput.trim().toLowerCase()])
                        setTagInput('')
                      }
                    }}
                    style={{
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      border: '1.5px solid #BFDBFE',
                      borderRadius: '10px',
                      padding: '0 18px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'background 0.15s',
                    }}
                  >+ Add</button>
                </div>
              </div>
            </div>
          </div>

          
          <div className='section-card'>
            <div className='section-title'>
              
              Course Content
            </div>

            {chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className='chapter-card'>
                <div className='chapter-header' onClick={() => handleChapter('toggle', chapter.chapterId)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.05em'
                    }}>
                      CH {chapterIndex + 1}
                    </span>
                    <span className='chapter-title-text'>{chapter.chapterTitle}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500 }}>
                      {chapter.chapterContent.length} lecture{chapter.chapterContent.length !== 1 ? 's' : ''}
                    </span>
                    <button
                      type='button'
                      onClick={e => { e.stopPropagation(); handleChapter('remove', chapter.chapterId) }}
                      style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', fontSize: '18px', lineHeight: 1, transition: 'color 0.15s' }}
                      onMouseOver={e => e.target.style.color = '#EF4444'}
                      onMouseOut={e => e.target.style.color = '#D1D5DB'}
                    >×</button>
                  </div>
                </div>

                {!chapter.collapsed && (
                  <div style={{ padding: '12px 16px', borderTop: '1px solid #F3F4F6' }}>
                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div key={lectureIndex} className='lecture-row'>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: '#EFF6FF', color: '#1D4ED8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', fontWeight: 700, flexShrink: 0
                          }}>{lectureIndex + 1}</span>
                          <span style={{ fontWeight: 500, color: '#374151' }}>{lecture.lectureTitle}</span>
                          <span style={{ color: '#9CA3AF', fontSize: '12px' }}>· {lecture.lectureDuration} min</span>
                          {lecture.isPreviewFree && (
                            <span style={{
                              background: '#F0FDF4', color: '#16A34A',
                              border: '1px solid #BBF7D0', borderRadius: '20px',
                              padding: '1px 8px', fontSize: '11px', fontWeight: 600
                            }}>Free</span>
                          )}
                        </div>
                        <button
                          type='button'
                          onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                          style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', fontSize: '18px', lineHeight: 1, transition: 'color 0.15s' }}
                          onMouseOver={e => e.target.style.color = '#EF4444'}
                          onMouseOut={e => e.target.style.color = '#D1D5DB'}
                        >×</button>
                      </div>
                    ))}

                    <button
                      type='button'
                      onClick={() => handleLecture('add', chapter.chapterId)}
                      style={{
                        marginTop: '8px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: '#F9FAFB', border: '1.5px dashed #E5E7EB',
                        borderRadius: '8px', padding: '8px 14px',
                        color: '#6B7280', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                        transition: 'all 0.15s',
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = '#93C5FD'; e.currentTarget.style.color = '#1D4ED8' }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#6B7280' }}
                    >
                      + Add Lecture
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className='add-chapter-btn ' onClick={() => setShowChapterPopup(true)}>
              <span style={{ fontSize: '18px' }}>+</span>
              Add Chapter
            </div>
          </div>

          
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '40px' }}>
            <button type='submit' className='submit-btn'>
              Publish Course →
            </button>
          </div>
        </form>

        
        {showChapterPopup && (
          <div className='modal-overlay'>
            <div className='modal-card'>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span className='modal-title'>New Chapter</span>
                <button
                  type='button'
                  onClick={() => setShowChapterPopup(false)}
                  style={{ background: 'none', border: 'none', fontSize: '22px', color: '#9CA3AF', cursor: 'pointer', lineHeight: 1 }}
                >×</button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className='field-label'>Chapter Title</label>
                <input
                  type='text'
                  autoComplete='off'
                  className='field-input'
                  
                  onChange={e => setTempChapterTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (tempChapterTitle.trim()) {
                        handleChapter('add', tempChapterTitle)
                        setShowChapterPopup(false)
                        setTempChapterTitle('')
                      }
                    }
                  }}
                />
              </div>
              <button
                type='button'
                className='modal-btn'
                onClick={() => {
                  handleChapter('add', tempChapterTitle)
                  setShowChapterPopup(false)
                }}
              >
                Create Chapter
              </button>
            </div>
          </div>
        )}

        
        {showPopup && (
          <div className='modal-overlay'>
            <div className='modal-card'  style={{ 
      maxHeight: '90vh',        // limit height
      overflowY: 'auto',        // scrollable
      padding: '24px',
    }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span className='modal-title'>Add Lecture</span>
                <button
                  type='button'
                  onClick={() => setShowPopup(false)}
                  style={{ background: 'none', border: 'none', fontSize: '22px', color: '#9CA3AF', cursor: 'pointer', lineHeight: 1 }}
                >×</button>
              </div>

              
              <div style={{
                background: '#F9FAFB', borderRadius: '12px',
                overflow: 'hidden', aspectRatio: '16/9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid #E5E7EB', marginBottom: '20px'
              }}>
                {lectureDetails.lectureUrl ? (
                  getYouTubeID(lectureDetails.lectureUrl) ? (
                    <iframe
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      src={`https://www.youtube.com/embed/${getYouTubeID(lectureDetails.lectureUrl)}`}
                      title='YouTube preview'
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={lectureDetails.lectureUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      controls
                      onLoadedMetadata={e =>
                        setLectureDetails(prev => ({ ...prev, lectureDuration: Math.ceil(e.target.duration / 60) }))
                      }
                    />
                  )
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '6px' }}>🎬</div>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Video Preview
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className='field-label'>Lecture Title</label>
                  <input
                    type='text'
                    autoComplete='off'
                    className='field-input'
                    placeholder='e.g. Introduction to React Hooks'
                    value={lectureDetails.lectureTitle}
                    onChange={e => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                  />
                </div>

                <div>
                  <label className='field-label'>Lecture URL</label>
                  <input
                    type='text'
                    autoComplete='off'
                    className='field-input'
                    placeholder='YouTube Link'
                    value={lectureDetails.lectureUrl}
                    onChange={e => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                  />
                </div>

                <div>
  <label className='field-label'>Lecture Resources</label>
  
  {/* Already uploaded files */}
  {resources.length > 0 && (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
      {resources.map((file, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#F0FDF4', border: '1px solid #BBF7D0',
          borderRadius: '8px', padding: '8px 12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📄</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              {file.name}
            </span>
          </div>
          <button
            type='button'
            onClick={() => setResources(resources.filter((_, index) => index !== i))}
            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '16px' }}
          >×</button>
        </div>
      ))}
    </div>
  )}

  {/* File Upload Input */}
  <div style={{
    border: '2px dashed #C7D2FE', borderRadius: '12px',
    padding: '20px', textAlign: 'center', cursor: 'pointer',
    background: '#F9FAFB', transition: 'all 0.2s'
  }}
    onDragOver={e => e.preventDefault()}
    onDrop={async (e) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      await handleResourceUpload(droppedFiles);
    }}
  >
    <input
      type='file'
      multiple 
      id='resource-upload'
      style={{ display: 'none' }}
      onChange={async (e) => {
        const selectedFiles = Array.from(e.target.files);
        await handleResourceUpload(selectedFiles);
        e.target.value = ''; 
      }}
    />
    <label htmlFor='resource-upload' style={{ cursor: 'pointer' }}>
      {uploadingResource ? (
        <div>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>⏳</div>
          <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Uploading...</p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>📁</div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#4F46E5' }}>
            Click to upload or drag & drop
          </p>
          <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
            PDF, DOC, PPT, ZIP — up to 10 files
          </p>
        </div>
      )}
    </label>
  </div>
</div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label className='field-label'>Duration (mins)</label>
                    <input
                      type='number'
                      className='field-input'
                      value={lectureDetails.lectureDuration}
                      onChange={e => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <label className='field-label'>Preview</label>
                    <div
                      className='free-badge'
                      onClick={() => setLectureDetails({ ...lectureDetails, isPreviewFree: !lectureDetails.isPreviewFree })}
                    >
                      <input
                        type='checkbox'
                        checked={lectureDetails.isPreviewFree}
                        onChange={e => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                        style={{ width: '15px', height: '15px', accentColor: '#1D4ED8', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#16A34A' }}>Free</span>
                    </div>
                  </div>
                </div>

                <button type='button' className='modal-btn' onClick={addLecture}
                  style={{ marginTop: '4px' }}>
                  Add Lecture
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AddCourse