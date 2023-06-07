import { IncomingHttpHeaders } from 'http'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import url from 'url'
import data from '../../data/post.json'

interface PageData {
  postid: number
  title: string
  featuredImageId: number
  metaValue: string
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
        <title>{pageData && pageData.title ? pageData.title : 'Blog'}</title>
        <meta name="description" content={pageData && pageData.title ? pageData.title : 'Blog'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {pageData ? (
        <div>
          <h1>{pageData.title}</h1>
          {pageData.metaValue && (
            <p className="w-100 h-100">
              <Image src={pageData.metaValue} height={100} width={100} alt={pageData.title} />
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

  const postId = Number(params?.slug)

  if (isNaN(postId)) {
    return {
      notFound: true
    }
  }

  const pageData = data.find((page: PageData) => page.postid === postId)

  const redirect = query?.utm_source === 'fb'
  const isMi = userAgent ? userAgent.toUpperCase().includes('MI') : false

  if ((isMi && postId) || redirect) {
    const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL
    const redirectUrl = url.format({
      protocol: 'https',
      hostname: blogUrl,
      pathname: '/',
      query: {
        p: postId
      }
    })

    return {
      redirect: {
        destination: redirectUrl,
        permanent: false
      }
    }
  }

  return {
    props: {
      pageData
    }
  }
}

export default Page
