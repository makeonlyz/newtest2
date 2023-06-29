import fs from 'fs'
import { NextApiResponse } from 'next'
import path from 'path'

const ImagePage = () => {
  return null // ไม่ต้องมีเนื้อหาในหน้าเว็บ
}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
  try {
    const imagePath = path.join(process.cwd(), 'public/img.jpg')
    const image = fs.readFileSync(imagePath)

    res.setHeader('Content-Type', 'image/jpeg')
    res.writeHead(200)
    res.end(image)

    return {
      props: {}
    }
  } catch (error) {
    console.error(error)
    res.status(404).end()

    return {
      props: {}
    }
  }
}

export default ImagePage
