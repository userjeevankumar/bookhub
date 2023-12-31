import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'

import Footer from '../Footer'
import BookItem from '../BookItem'

import './index.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const booksApiStatuses = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Bookshelves extends Component {
  state = {
    activeFilter: bookshelvesList[0].value,
    booksApiStatus: booksApiStatuses.initial,
    booksData: {},
    searchInput: '',
    search: '',
    activeFilterLabel: bookshelvesList[0].label,
  }

  componentDidMount() {
    this.getBooksApiData()
  }

  updateBooksList = booksList =>
    booksList.map(eachBook => ({
      id: eachBook.id,
      title: eachBook.title,
      readStatus: eachBook.read_status,
      rating: eachBook.rating,
      authorName: eachBook.author_name,
      coverPic: eachBook.cover_pic,
    }))

  getBooksApiData = async () => {
    this.setState({booksApiStatus: booksApiStatuses.inProgress})

    const {search, activeFilter} = this.state
    const booksApi = `https://apis.ccbp.in/book-hub/books?shelf=${activeFilter}&search=${search}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(booksApi, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        books: this.updateBooksList(fetchedData.books),
        total: fetchedData.total,
      }
      this.setState({
        booksData: updatedData,
        booksApiStatus: booksApiStatuses.success,
      })
    } else {
      this.setState({booksApiStatus: booksApiStatuses.failure})
    }
  }

  onClickRetry = () => {
    this.getBooksApiData()
  }

  onChangeInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchBooks = () => {
    this.setState(
      prevState => ({
        search: prevState.searchInput,
      }),
      this.getBooksApiData,
    )
  }

  renderBooksProgressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284c7" height={32} width={32} />
    </div>
  )

  renderBooksFailureView = () => (
    <div className="top-rated-books-failure-container">
      <img
        src="https://res.cloudinary.com/dgjd6lxkk/image/upload/v1688626650/NxtWave/Min%20Projects/bookhub/Bookhub_Failure_rdpkog.png"
        alt="failure view"
        className="top-rated-books-failure-image"
      />
      <p className="top-rated-books-failure-heading">
        Something Went Wrong. Please try again
      </p>
      <button
        className="top-rated-books-failure-btn"
        type="button"
        onClick={this.onClickRetry}
      >
        Try Again
      </button>
    </div>
  )

  renderTheListOfBooks = () => {
    const {booksData} = this.state
    const {books} = booksData

    return (
      <ul className="bookList-container">
        {books.map(eachBook => (
          <BookItem key={eachBook.id} bookDetails={eachBook} />
        ))}
      </ul>
    )
  }

  renderNoMatchBooks = () => {
    const {searchInput} = this.state
    return (
      <div className="no-match-found-container">
        <img
          className="no-match-image"
          src="https://res.cloudinary.com/dgjd6lxkk/image/upload/v1688626626/NxtWave/Min%20Projects/bookhub/Bookhub_SearchNotFound_tmiime.png"
          alt="no books"
        />
        <p className="no-match-paragraph">
          Your search for {searchInput} did not find any matches.
        </p>
      </div>
    )
  }

  renderBooksSuccessView = () => {
    const {booksData} = this.state
    const {total} = booksData
    if (total !== 0) {
      return <>{this.renderTheListOfBooks()}</>
    }
    return <>{this.renderNoMatchBooks()}</>
  }

  renderBooks = () => {
    const {booksApiStatus} = this.state
    switch (booksApiStatus) {
      case booksApiStatuses.success:
        return this.renderBooksSuccessView()
      case booksApiStatuses.failure:
        return this.renderBooksFailureView()
      case booksApiStatuses.inProgress:
        return this.renderBooksProgressView()
      default:
        return null
    }
  }

  render() {
    const {activeFilter, searchInput, activeFilterLabel} = this.state

    return (
      <>
        <Header shelves />
        <div className="book-shelves-bg-container">
          <div className="bookshelves-filters-container-lg">
            <h1 className="bookshelves-heading bookshelves-heading-lg">
              Bookshelves
            </h1>
            <ul className="container-filtered-listed-names">
              {bookshelvesList.map(eachItem => {
                const activeFilterClass =
                  activeFilter === eachItem.value ? 'active-filter-lg' : ''
                const onClickedFilter = () => {
                  this.setState(
                    {
                      activeFilter: eachItem.value,
                      activeFilterLabel: eachItem.label,
                    },
                    this.getBooksApiData,
                  )
                }
                return (
                  <li className="active-filter-list-lg" key={eachItem.label}>
                    <button
                      className={`active-filter-btn-lg ${activeFilterClass}`}
                      onClick={onClickedFilter}
                      type="button"
                    >
                      {eachItem.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <div className="filtered-books-search-input-container-lg">
              <h1 className="filtered-books-heading">
                {activeFilterLabel} Books
              </h1>
              <div className="search-input-container">
                <input
                  placeholder="search"
                  className="search-input"
                  type="search"
                  onChange={this.onChangeInput}
                  value={searchInput}
                />
                <button
                  className="search-btn"
                  onClick={this.onSearchBooks}
                  type="button"
                  testid="searchButton"
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
            </div>
            <h1 className="bookshelves-heading bookshelves-heading-sm">
              Bookshelves
            </h1>
            <div className="books-filters-sm">
              {bookshelvesList.map(eachItem => {
                const activeFilterClass =
                  activeFilter === eachItem.value ? 'active-filter-btn' : ''
                const onClickedFilter = () => {
                  this.setState(
                    {
                      activeFilter: eachItem.value,
                      activeFilterLabel: eachItem.label,
                    },

                    this.getBooksApiData,
                  )
                }
                return (
                  <button
                    className={`Bookshelves-filter-btn ${activeFilterClass}`}
                    type="button"
                    key={eachItem.label}
                    onClick={onClickedFilter}
                  >
                    {eachItem.label}
                  </button>
                )
              })}
            </div>
            <div>{this.renderBooks()}</div>
            <Footer />
          </div>
        </div>
      </>
    )
  }
}

export default Bookshelves
