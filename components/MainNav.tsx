import React from 'react'
import Link from 'next/link'
import ToggleMode from './ToggleMode'
import MainNavLInks from './MainNavLInks'

const MainNav = () => {
  return (
    <div className='flex justify-between'>

      <MainNavLInks/>

        <div className='flex items-center gap-2'>
          <Link href="/">Logout</Link>
          <ToggleMode />
        </div>
    </div>
  )
}

export default MainNav