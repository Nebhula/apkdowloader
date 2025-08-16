import React from 'react'
import { DiscussionEmbed } from 'disqus-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'

const Comments = ({ websiteName }) => {
  const { theme } = useTheme();

  const router = useRouter();
  const { locales, locale: activeLocal, defaultLocale } = router;

  const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME

  const disqusConfig = {
    url: process.env.NEXT_PUBLIC_DOMAIN_URL,
    identifier: '1',
    title: websiteName,
    language: activeLocal,
  }

  return (
    <div id="comments" className="max-w-screen-xl my-16 px-4 sm:px-6 lg:px-8 mx-auto dark:bg-black">
      <DiscussionEmbed
        key={theme}
        shortname={disqusShortname}
        config={disqusConfig}
      />
    </div>
  )
}

export default Comments