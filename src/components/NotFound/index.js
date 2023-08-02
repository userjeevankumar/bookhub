import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <div className="not-found-img-container">
      <img
        src="https://res.cloudinary.com/dgjd6lxkk/image/upload/v1688626638/NxtWave/Min%20Projects/bookhub/Bookhub_NotFound_alpryj.png"
        alt="not found"
        className="img-not-found"
      />
      <h1>Page Not Found</h1>
      <p className="not-found-para">
        We are sorry, the page you requested could not be found, please go back
        to the homepage
      </p>
      <Link to="/">
        <button className="go-back-to-home-btn" type="button">
          Go Back to Home
        </button>
      </Link>
    </div>
  </div>
)

export default NotFound
