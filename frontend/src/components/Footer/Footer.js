import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Footer.css";
import { Link } from "../../components";
import { PRIVACY_ROUTE, TERMS_ROUTE } from "../../routes";
import {
  FaInstagram,
  FaFacebook,
  FaPinterest,
  FaYoutube
} from "react-icons/fa";

class Footer extends React.Component {
  render() {
    return (
      <div className={s.footer}>
        <div className={s.leftMenu}>
          {/* <div className={s.copyright}>
            {'© 2020 Petal and Stem'}
          </div> */}
          <span>
            <Link className={s.privacyLink} to={PRIVACY_ROUTE}>
              <span
                className={s.contact}
                // href="mailto:info@PetalandStem.com"
              >
                {"Privacy Policy"}
              </span>
            </Link>
          </span>
          <span>
            <Link className={s.privacyLink} to={TERMS_ROUTE}>
              <span
                className={s.faq}
                // href="https://www.facebook.com/PetalandStem/"
              >
                {"Terms & Conditions"}
              </span>
            </Link>
          </span>
          <span>
            {/* <Link
             className={s.privacyLink} 
             to={PRIVACY_ROUTE}> */}
            <a
              className={s.contact}
              href="mailto:info@PetalandStem.com"
              target="_blank"
            >
              {"Contact Us"}
            </a>
            {/* </Link> */}
          </span>
        </div>
        <div className={s.middle}>
        </div>
        <div className={s.rightMenu}>
          <a
            href="https://www.instagram.com/blendprecisely/"
            target="_blank"
            rel="nofollow"
            className={s.Link}
          >
            <FaInstagram className={s.Icon} />
          </a>
          <a
            href="https://www.facebook.com/groups/blendprecisely/"
            target="_blank"
            rel="nofollow"
            className={s.Link}
          >
            <FaFacebook className={s.Icon} />
          </a>
          <a
            href="https://www.youtube.com/channel/UCspY_ztRZc2kMpRf2MJLyMw"
            target="_blank"
            rel="nofollow"
            className={s.Link}
          >
            <FaYoutube className={s.Icon} />
          </a>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Footer);
