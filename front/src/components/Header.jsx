import React from 'react'

 const Header = ({title}) => {
  return (
    <div className='mb-10 text-3xl font-semibold text-center text-indigo-700 underline uppercase '>
      <p className='text-3xl font-extrabold tracking-tight text-indigo-700'>{title}</p>
    </div>
  )
}
export default Header;
