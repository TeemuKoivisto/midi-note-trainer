<script>
  import { onMount } from 'svelte'
  import { JsonLd, MetaTags } from 'svelte-meta-tags'

  import { SITE_METADATA } from '$config'

  import '../../app.pcss'

  let url = SITE_METADATA.url

  onMount(() => {
    if (typeof window !== 'undefined' && window.location.href.length > 1) {
      url += window.location.pathname
    }
  })
</script>

<MetaTags
  title={SITE_METADATA.title}
  description={SITE_METADATA.description}
  canonical={url}
  keywords={SITE_METADATA.tags}
  openGraph={{
    type: 'website',
    url: url,
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
  <main class="mx-[auto] h-full min-h-screen max-w-[780px] flex-col items-center justify-center">
    <slot />
  </main>
</div>
