import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Modal from "./components/Modal/Modal";
import Button from "./components/Button/Button";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import Searchbar from "./components/Searchbar/Searchbar";
import searchApi from "./services/searchApi";

const App = () => {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [isLoaderOn, setIsLoaderOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  useEffect(() => {
    if (images.length > 12) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [images]);

  useEffect(() => {
    if (searchPage > 1) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchPage]);

  const searchSubmit = async (e) => {
    e.preventDefault();

    if (!searchQuery) {
      return;
    }

    setIsLoaderOn(true);

    await searchApi(searchQuery, searchPage)
      .then((data) => {
        setImages(data);
        setSearchPage(1);
      })
      .catch((error) => {
        toast.error(`${error.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

    setIsLoaderOn(false);
  };

  const loadMore = async () => {
    setIsLoaderOn(true);

    await searchApi(searchQuery, searchPage).then((data) =>
      setImages([...images, ...data])
    );

    setIsLoaderOn(false);
  };

  const inputChange = ({ target }) => {
    const { value } = target;

    setSearchQuery(value);
  };

  const openModal = async ({ target }) => {
    if (target.nodeName !== "IMG") {
      return;
    }

    await setModalImage(target.dataset.image);
    toggleModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="App">
      <Searchbar
        onSubmit={searchSubmit}
        value={searchQuery}
        onChange={inputChange}
      />

      <ImageGallery onClick={openModal} images={images} />

      {isLoaderOn && (
        <Loader type="Oval" color="#3f51b5" height={40} width={40} />
      )}

      {images.length > 0 && !isLoaderOn && (
        <Button onClick={() => setSearchPage(searchPage + 1)} />
      )}

      {isModalOpen && (
        <Modal image={modalImage} onClose={closeModal}>
          <img src={modalImage} alt="Modal IMG" />
        </Modal>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
