import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmbeddableBadge } from '@/components/EmbeddableBadge'

interface WebsiteData {
  name: string;
  url: string;
  hasDarkMode: boolean;
  imageUrl: string;
  timestamp?: string;
}

export default function EmbedPage() {
  const [searchParams] = useSearchParams()
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  
  useEffect(() => {
    const websiteParam = searchParams.get('website')
    if (websiteParam) {
      try {
        const decodedData = JSON.parse(atob(websiteParam))
        setWebsiteData(decodedData)
      } catch (error) {
        console.error('Failed to decode website data:', error)
      }
    }
  }, [searchParams])

  if (!websiteData) {
    return null
  }

  return (
    <div className="p-4">
      <EmbeddableBadge 
        websiteData={websiteData}
        popupUrl={`${window.location.origin}?website=${searchParams.get('website')}`}
      />
    </div>
  )
} 