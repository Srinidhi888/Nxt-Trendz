// Write your code here
import './index.css'

import {BsPlusSquare} from 'react-icons/bs'

import {BsDashSquare} from 'react-icons/bs'

import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class ProductItemDetails extends Component {
  state = {
    item: [],
    count: 1,
    similarProducts: [],
    isLoading: true,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItem()
  }

  onContinue = () => {
    const {history} = this.props
    history.replace('/products')
  }

  onMinus = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  onPlus = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  getProductItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwt = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedSimilar = data.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        style: each.style,
        price: each.price,
        description: each.description,
        brand: each.brand,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
      }))
      this.setState({similarProducts: updatedSimilar})
      const {similarProducts} = this.state
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: similarProducts,
        style: data.style,
        price: data.price,
        description: data.description,
      }
      this.setState({
        item: updatedData,
        isLoading: false,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderPages = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderItems()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderFailureView = () => {
    return (
      <div className="failure-bg">
        <img
          className="ima-failure"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
          alt="failure view"
        />
        <h1>Product Not Found</h1>
        <button type="button" className="add-btn" onClick={this.onContinue}>
          Continue Shopping
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderItems = () => {
    const {item, similarProducts, count} = this.state
    const {
      id,
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      style,
      description,
      price,
    } = item

    return (
      <>
        <div className="item-bg">
          <img className="item-ima" src={imageUrl} alt="product" />
          <div>
            <h1>{title}</h1>
            <p>Rs {price}/-</p>
            <div className="box-1">
              <p className="spcl">
                {rating}{' '}
                <img
                  className="star-ima"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </p>

              <p>{totalReviews} Reviews</p>
            </div>

            <p>{description}</p>
            <p>
              <span>Available: </span> {availability}
            </p>
            <p>
              <span>Brand: </span> {brand}{' '}
            </p>
            <div className="grp">
              <button
                type="button"
                className="bt-1"
                onClick={this.onMinus}
                data-testid="minus"
                aria-label="Search"
              >
                <BsDashSquare />
              </button>
              <p>{count}</p>
              <button
              aria-label="Search"
                type="button"
                className="bt-2"
                onClick={this.onPlus}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="head-1">Similar Products</h1>
        <ul className="similar-grp">
          {similarProducts.map(each => (
            <SimilarProductItem key={each.id} details={each} />
          ))}
        </ul>
      </>
    )
  }

  render() {
    const {isLoading} = this.state

    return (
      <div>
        <Header />
        {this.renderPages()}
      </div>
    )
  }
}

export default ProductItemDetails
