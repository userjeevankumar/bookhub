import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const topRatedApiStatuses = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: true,
  autoplay: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 860,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 650,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {topRatedApiStatus: topRatedApiStatuses.initial, topRatedBooks: []}

  componentDidMount() {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    this.setState({topRatedApiStatus: topRatedApiStatuses.inProgress})
    const topRatedBooksApi = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(topRatedBooksApi, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const booksList = fetchedData.books
      const updatedData = booksList.map(eachBook => ({
        id: eachBook.id,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        title: eachBook.title,
      }))

      this.setState({
        topRatedApiStatus: topRatedApiStatuses.success,
        topRatedBooks: updatedData,
      })
    } else {
      this.setState({topRatedApiStatus: topRatedApiStatuses.failure})
    }
  }

  onClickRetry = () => {
    this.getTopRatedBooks()
  }

  onClickFindBooks = () => {
    const {history} = this.props
    history.push('/shelf')
  }

  renderSliderSuccessView = () => {
    const {topRatedBooks} = this.state

    return (
      <div className="slider-container">
        <Slider {...settings}>
          {topRatedBooks.map(eachBook => {
            const {id, title, coverPic, authorName} = eachBook

            return (
              <>
                <Link to={`/books/${id}`}>
                  <div className="slider-book-details-container" key={id}>
                    <div className="slider-image-container">
                      <img
                        className="slider-book-img"
                        src={coverPic}
                        alt={title}
                      />
                    </div>
                    <h1 className="slider-head">{title}</h1>
                    <p className="slider-description">{authorName}</p>
                  </div>
                </Link>
              </>
            )
          })}
        </Slider>
      </div>
    )
  }

  renderSliderProgressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284c7" width={50} height={50} />
    </div>
  )

  renderSliderFailureView = () => (
    <div className="top-rated-books-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png"
        alt="failure view"
        className="top-rated-books-failure-image"
      />
      <p className="top-rated-books-failure-heading">
        Something went wrong. Please try again
      </p>
      <button
        className="top-rated-books-failure-btn"
        onClick={this.onClickRetry}
        type="button"
      >
        Try Again
      </button>
    </div>
  )

  renderSlider = () => {
    const {topRatedApiStatus} = this.state
    switch (topRatedApiStatus) {
      case topRatedApiStatuses.success:
        return <>{this.renderSliderSuccessView()}</>
      case topRatedApiStatuses.inProgress:
        return <>{this.renderSliderProgressView()}</>
      case topRatedApiStatuses.failure:
        return <>{this.renderSliderFailureView()}</>
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header home />
        <div className="home-page-bg-container">
          <h1 className="home-heading">Find Your Next Favorite Books?</h1>
          <p className="home-paragraph">
            You are in the right place. Tell us what titles or genres you have
            enjoyed in the past, and we will give you surprisingly insightful
            recommendations.
          </p>
          <Link to="/shelf">
            <button
              className="home-find-books-btn books-responsive-btn-sm"
              type="button"
              onClick={this.onClickFindBooks}
            >
              Find Books
            </button>
          </Link>
          <div>
            <div className="home-top-rated-container">
              <div className="top-head-find-btn-container">
                <h1 className="top-rated-heading">Top Rated Books</h1>
                <Link to="/shelf">
                  <button
                    className="home-find-books-btn books-responsive-btn-lg"
                    type="button"
                    onClick={this.onClickFindBooks}
                  >
                    Find Books
                  </button>
                </Link>
              </div>
              <div className="slick-container">{this.renderSlider()}</div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

export default Home
