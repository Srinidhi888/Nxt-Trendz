// Write your code here
import './index.css'

import {FaStar} from 'react-icons/fa'

const SimilarProductItem = props => {
  const {details} = props
  const {imageUrl, rating, price, title, brand} = details
  return (
    <li className="similar-item">
      <img
        className="similar-ima"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <h1 className="h-1">{title}</h1>
      <p>by {brand}</p>
      <div className="box">
        <p>Rs {price}/-</p>
        <span className="spcl">
          {rating}
          <img
            className="star-ima"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </span>
      </div>
    </li>
  )
}

export default SimilarProductItem
