import React from 'react'
import { Divider } from '@nextui-org/react'

const Footer = ({ websiteName }) => {
  const year = new Date().getYear() + 1900;

  return (
    <div className="max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
      <Divider />
      <p className="text-zinc-500  dark:text-zinc-300 font-medium py-4">
        © {websiteName} {year}
      </p>
    </div>
  )
}

export default Footer