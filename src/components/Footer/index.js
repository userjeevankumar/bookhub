import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <div className="footer-container">
    <div className="icons-footer">
      <FaGoogle className="contact-us-icons" />
      <FaTwitter className="contact-us-icons" />
      <FaInstagram className="contact-us-icons" />
      <FaYoutube className="contact-us-icons" />
    </div>
    <p className="contact-us-heading">Contact us</p>
  </div>
)

export default Footer
