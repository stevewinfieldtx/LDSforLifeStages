"use client"

import { useRouter } from "next/navigation"
import { useDevotional } from "@/context/devotional-context"
import { useEffect, useRef, useMemo } from "react"

export default function ImageryPage() {
  const router = useRouter()
  const { devotional } = useDevotional()
  const imagery = devotional.imagery || []
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    mainRef.current?.scrollTo(0, 0)
  }, [])

  const allImages = useMemo(() => {
    const images: Array<{ src: string; title: string; source: string }> = []

    // Hero image from verse interpretation
    if (devotional.heroImage) {
      images.push({ src: devotional.heroImage, title: "Verse Hero", source: "Interpretation" })
    }

    // Context hero image
    if (devotional.contextHeroImage) {
      images.push({ src: devotional.contextHeroImage, title: "Historical Context", source: "Context" })
    }

    // Story images
    if (devotional.stories) {
      devotional.stories.forEach((story, i) => {
        if (story.img) {
          images.push({ src: story.img, title: story.title || `Story ${i + 1}`, source: "Stories" })
        }
      })
    }

    // Poetry images
    if (devotional.poetry) {
      devotional.poetry.forEach((poem, i) => {
        if (poem.img) {
          images.push({ src: poem.img, title: poem.title || `Poem ${i + 1}`, source: "Poetry" })
        }
      })
    }

    // Songs image
    if (devotional.songs?.img) {
      images.push({ src: devotional.songs.img, title: devotional.songs.title || "Worship Song", source: "Songs" })
    }

    // Imagery-specific images (the 4 unique ones)
    imagery.forEach((item, i) => {
      if (item.img) {
        images.push({ src: item.img, title: item.title || `Symbol ${i + 1}`, source: "Imagery" })
      }
    })

    return images
  }, [devotional, imagery])

  return (
    <div
      ref={mainRef}
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-gradient-to-b from-blue-50 to-background max-w-md mx-auto shadow-2xl"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background/90 backdrop-blur-md p-4 pb-2 border-b border-border transition-colors duration-300">
        <button
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight text-center flex-1 text-blue-700">Imagery</h1>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
          <span className="material-symbols-outlined text-2xl">more_vert</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-6 pb-12">
        {/* Featured Reflections - Symbol explanations */}
        <section className="flex flex-col pt-6">
          <div className="px-5 mb-4 flex items-baseline justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 mb-2">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span className="text-xs font-semibold uppercase tracking-wide">Visual Symbols</span>
              </div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight">Hidden Meanings</h2>
              <p className="text-sm text-muted-foreground mt-1">Discover the deeper symbolism in this verse</p>
            </div>
          </div>

          {imagery.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-5">
              <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 animate-pulse">
                <span className="material-symbols-outlined text-blue-600">image</span>
              </div>
              <p className="text-muted-foreground">Discovering symbols...</p>
            </div>
          ) : (
            <div className="flex w-full overflow-x-auto pb-4 px-5 snap-x snap-mandatory scrollbar-hide">
              <div className="flex flex-row items-start justify-start gap-4">
                {imagery.map((item, i) => (
                  <div key={i} className="flex flex-col gap-3 w-[260px] snap-center shrink-0 group cursor-pointer">
                    <div className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-blue-100 to-cyan-50 border border-blue-200">
                      {item.img ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url("${item.img}")` }}
                        ></div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                          <span className="material-symbols-outlined text-blue-300 text-4xl">brush</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-2">
                          <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="flex flex-col px-5">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100 text-cyan-700 mb-2">
              <span className="material-symbols-outlined text-sm">photo_library</span>
              <span className="text-xs font-semibold uppercase tracking-wide">Complete Collection</span>
            </div>
            <h2 className="text-2xl font-bold leading-tight tracking-tight">Full Gallery</h2>
            <p className="text-sm text-muted-foreground mt-1">All {allImages.length} images from your devotional</p>
          </div>

          {allImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 animate-pulse">
                <span className="material-symbols-outlined text-blue-600">collections</span>
              </div>
              <p className="text-muted-foreground">Images are being created...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {allImages.map((image, i) => (
                <div
                  key={i}
                  className="relative group rounded-2xl overflow-hidden cursor-zoom-in aspect-square bg-gradient-to-br from-blue-100 to-cyan-50 shadow-md border border-blue-200"
                >
                  <img alt={image.title} className="w-full h-full object-cover" src={image.src || "/placeholder.svg"} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium truncate">{image.title}</p>
                    <p className="text-white/70 text-xs">{image.source}</p>
                  </div>
                  {/* Source badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
                    {image.source}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
