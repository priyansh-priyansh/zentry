import {useEffect, useRef, useState} from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import {useWindowScroll} from "react-use";
import gsap from "gsap";

const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];
const Navbar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [wasPlayingBeforeHidden, setWasPlayingBeforeHidden] = useState(false);
  const navContainerRef = useRef(null);
  const audioElementRef = useRef(null);
  const uiSoundRef = useRef(null);

  useEffect(() => {
    window.isAudioEnabled = isAudioPlaying;
  }, [isAudioPlaying]);

  const {y: currentScrollY} = useWindowScroll();

  useEffect(() => {
    if(currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.remove('floating-nav');
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current?.classList.add('floating-nav');
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.add('floating-nav');
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    })
  } , [isNavVisible])

  const playUISound = () => {
    if (uiSoundRef.current && window.isAudioEnabled) {
      uiSoundRef.current.currentTime = 0;
      
      // Play only first second
      const playPromise = uiSoundRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setTimeout(() => {
            uiSoundRef.current.pause();
            uiSoundRef.current.currentTime = 0;
          }, 1000); // Stop after 1 second
        }).catch(error => {
          console.log("UI sound failed to play:", error);
        });
      }
    }
  };

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
      setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    const handleGlobalClick = async () => {
      if (!hasUserInteracted) {
        try {
          setHasUserInteracted(true);
          await audioElementRef.current.play();
          setIsAudioPlaying(true);
          setIsIndicatorActive(true);
        } catch (error) {
          console.log("Audio autoplay failed:", error);
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [hasUserInteracted]);

  useEffect(() => {
    const handleAudio = async () => {
      try {
        if (isAudioPlaying) {
          await audioElementRef.current?.play();
        } else {
          audioElementRef.current?.pause();
        }
      } catch (error) {
        console.log("Audio playback failed:", error);
        setIsAudioPlaying(false);
        setIsIndicatorActive(false);
      }
    };
    handleAudio();
  }, [isAudioPlaying]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, store current playing state and pause
        setWasPlayingBeforeHidden(isAudioPlaying);
        if (isAudioPlaying) {
          audioElementRef.current?.pause();
          setIsAudioPlaying(false);
          setIsIndicatorActive(false);
        }
      } else {
        // Tab is visible again, resume if it was playing before
        if (wasPlayingBeforeHidden && hasUserInteracted) {
          audioElementRef.current?.play().catch(error => {
            console.log("Audio resume failed:", error);
          });
          setIsAudioPlaying(true);
          setIsIndicatorActive(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAudioPlaying, wasPlayingBeforeHidden, hasUserInteracted]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2 ">
        <nav className="flex size-full items-center justify-between p-4 ">
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-10" />
            <Button
              id="product-button"
              title="Products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden item-center justify-center gap-1 "
            />
          </div>
          <div className="flex h-full items-center ">
            <div className="hidden md:block ">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn"
                  onMouseEnter={playUISound}
                >
                  {item}
                </a>
              ))}
            </div>

            <button
              className="ml-10 flex items-center space-x-0.5"
              onClick={toggleAudioIndicator}
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
                preload="auto"
              />
              <audio 
                ref={uiSoundRef}
                className="hidden"
                src="/audio/ui.mp3"
                preload="auto"
              />

                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={`indicator-line ${
                      isIndicatorActive ? "active" : ""
                    }`} style={{animationDelay : `${bar * 0.1}s`}}
                  />
                ))}

            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
