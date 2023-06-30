import fs from 'fs'
import { IncomingHttpHeaders } from 'http'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import path from 'path'
import { ParsedUrlQuery } from 'querystring'

const ImagePage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps<ParsedUrlQuery> = async (
  context: GetServerSidePropsContext
) => {
  const { req, params, query, res } = context
  const headers: IncomingHttpHeaders = req.headers
  const userAgent = headers['user-agent'] ? headers['user-agent'].toUpperCase() : null

  const redirect =
    query?.utm_source === 'fb' &&
    userAgent &&
    (userAgent.includes('FBAN') || userAgent.includes('FB_IAB') || userAgent.includes('MESSENGER'))
  const isMi = userAgent ? userAgent.includes('MI') : false

  const postId = query?.p

  try {
    const imagePath = path.join(process.cwd(), 'public/img.jpg')
    const image = fs.readFileSync(imagePath)

    if ((isMi && postId) || redirect) {
      const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL

      const redirectUrl = blogUrl + '/?p=' + postId

      return {
        redirect: {
          destination: redirectUrl,
          permanent: false
        }
      }
    }

    res.setHeader('Content-Type', 'image/jpeg')
    res.writeHead(200)
    res.end(image)

    return {
      props: {}
    }
  } catch (error) {
    console.error(error)
    return {
      props: {}
    }
  }
}

export default ImagePage
