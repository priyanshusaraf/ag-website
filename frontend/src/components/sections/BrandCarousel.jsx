'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import api from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export default function BrandCarousel({ asBackground = false }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchImages() {
      try {
        setLoading(true);
        const res = await api.get('/gallery-images');
        if (!isMounted) return;
        const activeSorted = Array.isArray(res.data)
          ? res.data.filter(img => img?.image_url).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          : [];
        setImages(activeSorted);
        setCurrentIndex(0);
        setError('');
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load carousel images');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchImages();
    return () => { isMounted = false; };
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1 || isPaused) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, images.length, isPaused]);

  const hasImages = images.length > 0;
  const current = useMemo(() => (hasImages ? images[currentIndex] : null), [hasImages, images, currentIndex]);

  const handleTransition = (newIndex) => {
    if (isTransitioning || newIndex === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const goPrev = () => {
    if (!hasImages || isTransitioning) return;
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    handleTransition(newIndex);
  };

  const goNext = () => {
    if (!hasImages || isTransitioning) return;
    const newIndex = (currentIndex + 1) % images.length;
    handleTransition(newIndex);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="w-full h-[600px] lg:h-[700px] bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl flex items-center justify-center animate-pulse shadow-luxury">
          <div className="text-base text-gray-500 font-medium">Loading carousel...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="w-full h-[600px] lg:h-[700px] bg-red-50 border border-red-200 rounded-3xl flex items-center justify-center shadow-luxury">
          <div className="text-base text-red-600 font-medium">{error}</div>
        </div>
      </div>
    );
  }

  if (!hasImages) {
    return null;
  }

  if (asBackground) {
    return (
      <div 
        className="relative w-full h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main image container with smooth transitions */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentIndex 
                  ? 'opacity-100 transform scale-100' 
                  : 'opacity-0 transform scale-105'
              }`}
            >
              <img
                src={image.image_url}
                alt={image.title || 'Background image'}
                className="w-full h-full object-cover transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section aria-label="Brand carousel" className="pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="relative w-full h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-luxury group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main image container with smooth transitions */}
          <div className="relative w-full h-full">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentIndex 
                    ? 'opacity-100 transform scale-100' 
                    : 'opacity-0 transform scale-105'
                }`}
              >
                <img
                  src={image.image_url}
                  alt={image.title || 'Carousel image'}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            ))}
          </div>

          {/* Bottom shadow effect */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-amber-900/40 via-amber-800/20 to-transparent pointer-events-none" />
          <div 
            className="absolute inset-x-0 bottom-0 h-8 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(139,69,19,0.3) 0%, rgba(218,165,32,0.2) 30%, rgba(205,133,63,0.1) 60%, transparent 100%)'
            }}
          />

          {/* Text content overlay (no shadows) */}
          {(current?.title || current?.description) && (
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-12">
              <div className="max-w-4xl">
                {current?.title && (
                  <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-3 transform transition-all duration-500 font-display">
                    {current.title}
                  </h3>
                )}
                {current?.description && (
                  <p className="text-base md:text-lg lg:text-xl text-white leading-relaxed max-w-3xl font-medium">
                    {current.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                disabled={isTransitioning}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-amber-900/20 hover:bg-amber-800/30 backdrop-blur-md rounded-full border border-amber-600/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed group-hover:translate-x-0 -translate-x-2 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={goNext}
                disabled={isTransitioning}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-amber-900/20 hover:bg-amber-800/30 backdrop-blur-md rounded-full border border-amber-600/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed group-hover:translate-x-0 translate-x-2 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Play/Pause control */}
              <button
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
                className="absolute top-4 right-4 w-10 h-10 bg-amber-900/20 hover:bg-amber-800/30 backdrop-blur-md rounded-full border border-amber-600/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500/50 opacity-0 group-hover:opacity-100"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>
            </>
          )}

          {/* Progress indicator */}
          {images.length > 1 && isPlaying && !isPaused && (
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-900/30 rounded-t-3xl">
              <div 
                className="h-full rounded-t-3xl transition-all duration-100 ease-linear"
                style={{
                  width: '0%',
                  animation: 'progress 4s linear infinite',
                  background: 'linear-gradient(90deg, #8b4513 0%, #daa520 50%, #cd853f 100%)'
                }}
              />
            </div>
          )}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex items-center justify-center mt-6 gap-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTransition(index)}
                disabled={isTransitioning}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:cursor-not-allowed ${
                  index === currentIndex
                    ? 'w-8 h-3 shadow-lg'
                    : 'w-3 h-3 bg-amber-200/60 hover:bg-amber-300/80'
                }`}
                style={index === currentIndex ? {
                  background: 'linear-gradient(90deg, #8b4513 0%, #daa520 50%, #cd853f 100%)'
                } : {}}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}


