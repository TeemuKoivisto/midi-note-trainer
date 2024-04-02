<script>
  import { JsonLd, MetaTags } from 'svelte-meta-tags'

  import { SITE_METADATA } from '$config'

  import '../../tailwind.css'
</script>

<MetaTags
  title={SITE_METADATA.title}
  description={SITE_METADATA.description}
  canonical={SITE_METADATA.url}
  keywords={SITE_METADATA.tags}
  openGraph={{
    type: 'website',
    url: SITE_METADATA.url,
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [SITE_METADATA.image]
  }}
  twitter={{
    title: SITE_METADATA.title,
    description: SITE_METADATA.description
  }}
/>
<JsonLd
  schema={{
    '@type': 'WebPage',
    headline: SITE_METADATA.title,
    datePublished: SITE_METADATA.datePublished,
    dateModified: SITE_METADATA.dateModified,
    description: SITE_METADATA.description,
    image: [SITE_METADATA.image.url],
    keywords: SITE_METADATA.tags,
    author: {
      '@type': 'Person',
      name: SITE_METADATA.author.name
    }
  }}
/>

<div class="flex-col items-center justify-center">
  <main class="flex-col items-center justify-center h-full min-h-screen max-w-[764px] mx-[auto]">
    <slot />
  </main>
</div>
