import { formatImageUrl } from '@/libs/urlUtils'
import axios, { AxiosResponse } from 'axios'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

const WordPressAPI = process.env.NEXT_PUBLIC_WP_API_URL
const jsonFilePath = `./src/data/` + process.env.NEXT_PUBLIC_JSON_FILE

async function fetchPosts(page: number): Promise<AxiosResponse<any[]>> {
  const response = await axios.get(`${WordPressAPI}/wp-json/wp/v2/posts`, {
    params: {
      per_page: 100,
      page
    }
  })

  return response
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let allPosts: any[] = []
    let currentPage = 1
    let totalPages = 1

    let postsEmptyTitle: any[] = []
    let postsEmptyImage: any[] = []

    while (currentPage <= totalPages) {
      const response = await fetchPosts(currentPage)
      const posts = response.data
      allPosts = allPosts.concat(posts)

      const totalPagesHeader = parseInt(response.headers['x-wp-totalpages'], 10)
      if (totalPagesHeader && !isNaN(totalPagesHeader)) {
        totalPages = totalPagesHeader
      }

      currentPage++
    }

    const formattedPosts = allPosts.map((post: any) => {
      const formattedPost = {
        p: post.id,
        t: post.title.rendered,
        i:
          post.yoast_head_json?.og_image && post.yoast_head_json?.og_image.length
            ? formatImageUrl(post.yoast_head_json?.og_image[0].url)
            : ''
      }

      if (!formattedPost.t) {
        postsEmptyTitle.push(post.id)
      }

      if (!formattedPost.i) {
        postsEmptyImage.push(post.id)
      }

      return formattedPost
    })

    if (jsonFilePath) {
      const jsonPosts = JSON.stringify(formattedPosts)
      fs.writeFileSync(jsonFilePath, jsonPosts)
    } else {
      throw new Error('JSON file path is not defined.')
    }

    res.status(200).json({
      message: 'Posts data saved successfully.',
      postsEmptyTitle: postsEmptyTitle,
      postsEmptyImage: postsEmptyImage
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ message: 'Error fetching posts.' })
  }
}
