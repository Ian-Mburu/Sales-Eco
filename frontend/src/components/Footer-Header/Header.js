import React from 'react'
import { Link } from 'react-router-dom';
import { RiUser6Fill } from "react-icons/ri";
import { TbShoppingCartFilled } from "react-icons/tb";
import '../../styles/footer-header/header.css'


const Header = () => {
  return (
    <div className='header'>  
      <div className='eco-header'>
        <Link className='links-nav' to='/'>
          <h2>Eco-Sales</h2>
          <small>SHOP SMART, SHOP WISE</small>
        </Link>
      </div>

      <div className='header-nav'>
        <Link className='links-nav' to='/'>Home</Link>
        <Link className='links-nav' to='/'>About</Link>
        <Link className='links-nav' to='/products'>Products</Link>
        <Link className='links-nav' to='/wishlist'>Wishlist</Link>
        <Link className='links-nav' to='/contact'>Contact</Link>
        <Link className='links-nav' to="/cart">
          <TbShoppingCartFilled className="icon" />
        </Link>
        <Link className='links-nav' to="/my-profile">
          <RiUser6Fill className="icon" />
        </Link>
      </div>
    </div>
  )
}

export default Header