import { useEffect, useRef, useState } from "react";
import Button from "./Button.jsx";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const totalVideos = 4;
  const videoContainerRef = useRef(null);
  const currentVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const whooshSoundRef = useRef(null);

  const handelVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

  const playWhooshSound = () => {
    if (whooshSoundRef.current && window.isAudioEnabled) {
      whooshSoundRef.current.currentTime = 0;
      const playPromise = whooshSoundRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setTimeout(() => {
            whooshSoundRef.current.pause();
            whooshSoundRef.current.currentTime = 0;
          }, 1000);
        }).catch(error => {
          console.log("Whoosh sound failed to play:", error);
        });
      }
    }
  };

  const handleMiniVdClick = () => {
    if (!nextVideoRef.current || !currentVideoRef.current) return;
    
    // Play whoosh sound
    playWhooshSound();
    
    // Hide preview on mobile
    if (isMobile) {
      setShowPreview(false);
    }
    
    // Ensure next video is ready to play
    nextVideoRef.current.currentTime = 0;
    nextVideoRef.current.play().catch(() => {});
    
    setHasClicked(true);
    setCurrentIndex(upcomingVideoIndex);
  };

  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setIsLoading(false);
    }
  }, [loadedVideos]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });

        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVideoRef.current.play(),
        });

        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 40% 10%",
    });

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;
  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <audio 
          ref={whooshSoundRef}
          src="/audio/whoosh.mp3"
          preload="auto"
          className="hidden"
        />
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div
              onClick={handleMiniVdClick}
              onTouchStart={() => isMobile && setShowPreview(true)}
              onTouchEnd={() => isMobile && setShowPreview(false)}
              className={`origin-center md:hover:scale-100 md:hover:opacity-100 transition-all duration-500 ease-in ${
                isMobile 
                  ? showPreview ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  : 'scale-50 opacity-0'
              }`}
            >
              <video
                ref={nextVideoRef}
                src={getVideoSrc(upcomingVideoIndex)}
                loop
                muted
                autoPlay
                id="current-video"
                className="size-64 object-center object-cover scale-150 origin-center rounded-lg"
                onLoadedData={handelVideoLoad}
              />
            </div>
          </div>

          <video
            ref={currentVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            autoPlay
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handelVideoLoad}
          />

          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handelVideoLoad}
          />
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>a</b>ming
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full ">
          <div className="mt-24 px-5 sm:px-10 ">
            <h1 className="special-font hero-heading text-blue-100">
              redefi<b>n</b>e
            </h1>
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame <br /> Unleash the Play Economy
            </p>
            <Button
              id="watch-trailer"
              title={"Watch Trailer"}
              leftIcon={<TiLocationArrow />}
              onClick={handleMiniVdClick}
              containerClass="!bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5  text-black">
        G<b>a</b>ming
      </h1>
    </div>
  );
};

export default Hero;
