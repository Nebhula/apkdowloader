import React from 'react'

const Content = ({ content }) => {
    return (
        <div className="max-w-4xl my-16 px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="mt-8 prose dark:prose-invert prose-a:text-blue-600 hover:prose-a:text-blue-500 min-w-full" dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
    )
}

export default Content