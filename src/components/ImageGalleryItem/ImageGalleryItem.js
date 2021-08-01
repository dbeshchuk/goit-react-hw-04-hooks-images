import { memo } from "react";
import PropTypes from "prop-types";

const ImageGalleryItem = ({ webformatURL, largeImageURL }) => (
  <li className="ImageGalleryItem">
    <img
      src={webformatURL}
      alt=""
      data-image={largeImageURL}
      className="ImageGalleryItem-image"
    />
  </li>
);

ImageGalleryItem.propTypes = {
  webformatURL: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
};

export default memo(ImageGalleryItem);
