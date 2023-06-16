import { restoreImageUrl } from '@/libs/urlUtils'
import { IncomingHttpHeaders } from 'http'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
// import data from `../data/${process.env.NEXT_PUBLIC_JSON_FILE}`
const data = require(`../data/${process.env.NEXT_PUBLIC_JSON_FILE}`)

interface PageData {
  p: number
  t: string
  i: string
}

interface PageProps {
  pageData?: PageData
}

const Page: React.FC<PageProps> = ({ pageData }) => {
  const router = useRouter()

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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {pageData ? (
        <div className="m-auto max-w-lg">
          <h1 className="mb-4 mt-10 text-xl font-bold">{pageData.t}</h1>
          {pageData.i && (
            <p className="w-100 h-100">
              {/* <Image src={pageData.i} height={100} width={100} alt={pageData.t} /> */}
              <img src={pageData.i} alt={pageData.t} />
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
  const userAgent = headers['user-agent']

  const postId = Number((params?.slug as string)?.split('-')[1]) ?? null

  if (isNaN(postId)) {
    return {
      notFound: true
    }
  }

  const pageData = data.find((page: PageData) => page.p === postId)

  const redirect = query?.utm_source === 'fb'
  const isMi = userAgent ? userAgent.toUpperCase().includes('MI') : false

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

  if (pageData) {
    if (query.i) {
      const img = `${query.i}`
      if (img.startsWith('http')) {
        pageData.i = img
      } else {
        let buff = new Buffer(img, 'base64')
        let text = buff.toString('ascii')
        pageData.i = restoreImageUrl(text)
      }
    } else {
      pageData.i = pageData.i ? restoreImageUrl(pageData.i) : pageData.i
    }
    pageData.t = query.t ? query.t : pageData.t

    return {
      props: {
        pageData
      }
    }
  }

  return {
    notFound: true
  }
}

export default Page
