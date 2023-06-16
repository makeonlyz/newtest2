import { useState } from 'react'

const FormPage = () => {
  const enableFormPage = process.env.NEXT_PUBLIC_ENABLE_FORM_PAGE

  const [postId, setPostId] = useState('')
  const [vercelUrl, setVercelUrl] = useState('')
  const [title, setTitle] = useState('')
  const [imgUrl, setImgUrl] = useState('')

  const [urlGenerate, setUrlGenerate] = useState('')

  const [errors, setErrors] = useState({
    vercelUrl: '',
    postId: ''
  })

  const handleClick = () => {
    const isUrlValid = /^https?:\/\/\S+$/.test(vercelUrl)
    const isPostIdValid = /^\d+$/.test(postId)

    setErrors({
      vercelUrl: '',
      postId: ''
    })

    if (!isUrlValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        vercelUrl: 'กรุณากรอก Vercel Url ให้ถูกต้อง'
      }))
    }

    if (!isPostIdValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        postId: 'กรุณากรอก Post Id ให้เป็นตัวเลข'
      }))
    }

    console.log('errors', errors)
  }

  return (
    <>
      {enableFormPage && enableFormPage == 'true' ? (
        <div className="mx-auto my-8 max-w-md">
          <h1 className="mb-4 text-3xl font-bold">Form</h1>
          <div>
            <label htmlFor="postId" className="mb-2 block font-medium">
              Post ID
            </label>
            <input
              type="text"
              id="postId"
              value={postId}
              onChange={(e) => setPostId(e.target.value)}
              className={`border ${
                errors.postId ? 'border-red-500' : 'border-gray-300'
              } mb-2 w-full rounded border border-gray-300 px-4 py-2 text-black`}
            />
            {errors.postId && <p className="mb-2 text-sm text-red-500">{errors.postId}</p>}
          </div>
          <div>
            <label htmlFor="vercelUrl" className="mb-2 block font-medium">
              Vercel URL
            </label>
            <input
              type="text"
              id="vercelUrl"
              value={vercelUrl}
              onChange={(e) => setVercelUrl(e.target.value)}
              className={`border ${
                errors.vercelUrl ? 'border-red-500' : 'border-gray-300'
              } mb-2 w-full rounded border border-gray-300 px-4 py-2 text-black`}
            />
            {errors.vercelUrl && <p className="mb-2 text-sm text-red-500">{errors.vercelUrl}</p>}
          </div>
          <div>
            <label htmlFor="title" className="mb-2 block font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2 w-full rounded border border-gray-300 px-4 py-2 text-black"
            />
          </div>
          <div>
            <label htmlFor="imgUrl" className="mb-2 block font-medium">
              Image URL
            </label>
            <input
              type="text"
              id="imgUrl"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              className="mb-2 w-full rounded border border-gray-300 px-4 py-2 text-black"
            />
          </div>
          <button
            onClick={handleClick}
            className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            Generate
          </button>
          {urlGenerate && (
            <div className="mt-4">
              <label htmlFor="imgUrl" className="mb-2 block font-medium">
                URL Generate
              </label>
              <input
                type="text"
                id="urlGenerate"
                value={urlGenerate}
                className="mb-2 w-full rounded border border-gray-300 px-4 py-2 text-black"
              />
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default FormPage
