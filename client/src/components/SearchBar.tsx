import React, { forwardRef, ForwardedRef } from 'react'

const SearchBar = ({ ...props },ref:ForwardedRef<HTMLInputElement>) => {
  return (
    <div className='relative inline-flex md:w-1/3 w-full'>
      <input ref={ref} className='peer placeholder:text-[#00000065] focus:placeholder:text-primary-light rounded-sm bg-[#F1F1F1] focus:outline focus:outline-primary-light w-full pl-8 pr-2.5 py-1' type='text' placeholder='Search' { ...props } />
      <i className='fa-solid fa-search fa-fw absolute top-2 left-1.5 text-[#00000065] peer-focus:text-primary-light' />
    </div>
  )
}

export default forwardRef(SearchBar)