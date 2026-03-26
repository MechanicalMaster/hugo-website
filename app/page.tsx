import { HeroSection } from '@/components/home/HeroSection'
import { TrustBar } from '@/components/home/TrustBar'
import { StatsStrip } from '@/components/home/StatsStrip'
import { FeaturedWork } from '@/components/home/FeaturedWork'
import { ThreeColumnGrid } from '@/components/home/ThreeColumnGrid'
import { CTAFooter } from '@/components/home/CTAFooter'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <StatsStrip />
      <FeaturedWork />
      <ThreeColumnGrid />
      <CTAFooter />
    </>
  )
}
