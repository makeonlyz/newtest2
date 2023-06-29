import { restoreImageUrl } from '@/libs/urlUtils'
import { IncomingHttpHeaders } from 'http'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect } from 'react'

interface PageData {
  p: number
  t: string
  i: string
  b: boolean
  clientRedirect: boolean
}

interface PageProps {
  pageData?: PageData
}

const Page: React.FC<PageProps> = ({ pageData }) => {
  const router = useRouter()

  useEffect(() => {
    if (pageData && pageData?.clientRedirect && pageData.p) {
      const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL
      const redirectUrl = blogUrl + '/?p=' + pageData.p
      window.location.href = redirectUrl
    }
  }, [pageData])

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>{pageData && pageData.t ? pageData.t : 'Blog'}</title>
        <meta name="description" content={pageData && pageData.t ? pageData.t : 'Blog'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={pageData && pageData.t ? pageData.t : 'Blog'} />
        <meta property="og:image" content={pageData && pageData.i ? pageData.i : 'Blog'} />
        {pageData && pageData?.b == true ? (
          <>
            <meta name="medium" content="image" />
          </>
        ) : (
          <></>
        )}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {pageData && pageData?.clientRedirect == false ? (
        <div className="m-auto max-w-lg">
          <h1 className="mb-4 mt-10 text-xl font-bold">{pageData.t}</h1>
          {pageData.i && (
            <p className="w-100 h-100">
              {/* <Image src={pageData.i} height={100} width={100} alt={pageData.t} /> */}
              <img src={pageData.i} alt={pageData.t} loading="lazy" />
            </p>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps, ParsedUrlQuery> = async (
  context: GetServerSidePropsContext
) => {
  const { req, params, query, res } = context
  const headers: IncomingHttpHeaders = req.headers
  const userAgent = headers['user-agent'] ? headers['user-agent'].toUpperCase() : null

  const postId = Number((params?.slug as string)?.split('-')[1]) ?? null

  if (isNaN(postId)) {
    return {
      notFound: true
    }
  }

  const redirect =
    query?.utm_source === 'fb' &&
    userAgent &&
    (userAgent.includes('FBAN') || userAgent.includes('FB_IAB') || userAgent.includes('MESSENGER'))
  const isMi = userAgent ? userAgent.includes('MI') : false

  const clientRedirect = query?.utm_source === 'fb'
  const bigImage = query.hasOwnProperty('b') ? true : false

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

  const img = query.i ? `${query.i}` : null
  let imgPath = null
  if (img) {
    if (img.startsWith('http')) {
      imgPath = img
    } else {
      let buff = new Buffer(img, 'base64')
      let text = buff.toString('ascii')
      imgPath = restoreImageUrl(text)
    }
  }

  const title = query.t ? `${query.t}` : null

  const pageData = {
    p: postId ?? '',
    t: title ?? '',
    i: imgPath ?? '',
    b: bigImage,
    clientRedirect: clientRedirect
  }

  return {
    props: {
      pageData
    }
  }
}

export default Page
