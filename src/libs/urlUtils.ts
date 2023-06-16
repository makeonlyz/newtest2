export function formatImageUrl(url: string): string {
  const urlMapping = process.env.NEXT_PUBLIC_URL_MAPPING
  if (!urlMapping) {
    throw new Error('NEXT_PUBLIC_URL_MAPPING is not defined')
  }

  const urlMappings: { [key: string]: string } = {}

  urlMapping.split('|').forEach((mapping: string) => {
    const [domain, replacement] = mapping.split(',')
    urlMappings[domain] = replacement
  })

  for (const [domain, mapping] of Object.entries(urlMappings)) {
    if (url.includes(domain)) {
      return url.replace(domain, mapping)
    }
  }

  return url
}

export function restoreImageUrl(url: string): string {
  const urlMapping = process.env.NEXT_PUBLIC_URL_MAPPING
  if (!urlMapping) {
    throw new Error('NEXT_PUBLIC_URL_MAPPING is not defined')
  }

  const urlMappings: { [key: string]: string } = {}

  urlMapping.split('|').forEach((mapping: string) => {
    const [domain, replacement] = mapping.split(',')
    urlMappings[domain] = replacement
  })

  for (const [domain, mapping] of Object.entries(urlMappings)) {
    if (url.includes(mapping)) {
      return url.replace(mapping, domain)
    }
  }

  return url
}
