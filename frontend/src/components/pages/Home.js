import React from 'react'
import Footer from '../Footer-Header/Footer'
import Header from '../Footer-Header/Header'
import CategoriesList from './CategoriesList'
import '../../styles/pages/home.css'
import shoeImage from '../../images/shoe3.jpg';
import { Link } from 'react-router-dom'
import { CiDeliveryTruck } from "react-icons/ci";



const Home = () => {
  return (
    
    <>
    <Header />
    
      <div className='home'>
        <CategoriesList />
          <div className='back-g'>
            <img className='home-1mage1' src={shoeImage} alt='shoeImage' />
              <p className='p-1'>Eco-Sales the only store <br/> with everything you need. <br/> The Only store that <br/>delivers in minutes.</p>
          </div>

          <div className='b-image'>
            <div className='b-content'>
                <p className='p-2'>WE BELIEVE IN DELIVERING <br/>HIGH QUALITY PRODUCTS</p>
                <button className='btn-prd'>
                  <Link className='link-prd' to='/products'>Our Products</Link>
                </button>
                <div className='icon-del'>
                    <CiDeliveryTruck className="icon-h" />
                    <p className='p-3'>We deliver in minutes</p>
                </div>
            </div>
          </div>
      </div>
    <Footer />
    </>
  )
}

export default Home