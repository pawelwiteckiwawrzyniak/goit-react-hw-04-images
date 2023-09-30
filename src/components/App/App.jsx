import css from './App.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Searchbar } from '../Searchbar/Searchbar';
import { Loader } from 'components/Loader/Loader';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';

export const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (searchQuery !== '') {
      fetchImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, currentPage]);

  const fetchImages = async () => {
    const searchParams = new URLSearchParams({
      key: '38272300-1f1fe77aa9d2a1c8673ac9f3e',
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: currentPage,
      per_page: 12,
    });

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://pixabay.com/api/?${searchParams}`
      );

      const imageList = await response.data.hits;

      if (imageList.length === 0) {
        setIsLoading(false);
        return alert(
          'There are no images left to display with this search query!'
        );
      }

      setImages([...images, ...imageList]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    const formSearchQuery = form.elements.searchQuery.value;
    if (searchQuery === formSearchQuery) {
      return;
    } else {
      setCurrentPage(1);
      setSearchQuery(formSearchQuery);
      setImages([]);
    }
  };

  const handleClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleModal = event => {
    const image = event.currentTarget.attributes.largeimage.nodeValue;
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedImage('');
  };

  return (
    <div className={css.app}>
      <Searchbar handleSubmit={handleSubmit} />
      {searchQuery !== '' && (
        <ImageGallery handleModal={handleModal} images={images} />
      )}
      {isLoading && <Loader />}
      {images.length > 0 && <Button handleClick={handleClick} />}
      {isModalOpen && <Modal image={selectedImage} handleClose={handleClose} />}
    </div>
  );
};
