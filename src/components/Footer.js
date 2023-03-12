import React from 'react';
import { Link } from 'react-router-dom';
import { BiDrink } from 'react-icons/bi';
import { GiMeal } from 'react-icons/gi';
// import drinkIcon from '../images/drinkIcon.svg';
// import mealIcon from '../images/mealIcon.svg';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer data-testid="footer">
      <div className="footer-box">
        <Link to="/drinks">
          {/* <img src={ drinkIcon } alt="drinks" data-testid="drinks-bottom-btn" /> */}
          <BiDrink size={ 34 } />
        </Link>
        <Link to="/meals">
          {/* <img src={ mealIcon } alt="meals" data-testid="meals-bottom-btn" /> */}
          <GiMeal size={ 34 } />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
