import {TiLocationArrow} from "react-icons/ti";
import {useRef, useState, useEffect} from "react";

const BentoTilt = ({children , className = ''}) => {
    const [transformStyle, setTransformStyle] = useState('');
    const itemRef = useRef();
    const uiSoundRef = useRef(null);

    useEffect(() => {
        // Create audio element once
        const audio = new Audio('/audio/ui.mp3');
        audio.preload = 'auto';
        uiSoundRef.current = audio;
        
        return () => {
            if (uiSoundRef.current) {
                uiSoundRef.current.pause();
            }
        };
    }, []);

    const playUISound = () => {
        if (uiSoundRef.current && window.isAudioEnabled) {
            uiSoundRef.current.currentTime = 7.6; // Start at 7 seconds
            const playPromise = uiSoundRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setTimeout(() => {
                        uiSoundRef.current.pause();
                        uiSoundRef.current.currentTime = 7.6; // Reset to 7 seconds
                    }, 1000); // Play for 1 second
                }).catch(error => {
                    console.log("UI sound failed to play:", error);
                });
            }
        }
    };

    const handelMouseMove = (e) => {
        if(!itemRef.current) return;
        const {left , top , width , height} = itemRef.current.getBoundingClientRect();
        const relativeX = (e.clientX - left)/width;
        const relativeY = (e.clientY - top)/height;
        const titltX = (relativeY - 0.5) * 5;
        const titltY = (relativeX - 0.5) * -5;
        const newTransform = `perspective(700px) rotateX(${titltX}deg) rotateY(${titltY}deg) scale3d(0.98,0.98,0.98)`;
        setTransformStyle(newTransform);
    }

    const handelMouseLeave = () => {
        setTransformStyle('');
    }

    const handelMouseEnter = () => {
        playUISound();
    }

    return (
        <div 
            className={`${className} [cursor:grab]`} 
            ref={itemRef} 
            onMouseMove={handelMouseMove} 
            onMouseLeave={handelMouseLeave}
            onMouseEnter={handelMouseEnter}
            style={{transform: transformStyle}}
        >
            {children}
        </div>
    )
}

const BentoCard = ({src , title , description}) => {
    return (
        <div className="relative size-full ">
            <video
                src={src}
                loop
                muted
                autoPlay
                className="absolute left-0 top-0 size-full object-cover object-center"
            />
            <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
                <div>
                    <h1 className="bento-title special-font">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

const Features = () => {
  return (
    <section className="bg-black pb-52">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">
            Into the MetaGame Layer
          </p>

        <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
          Immerse yourself in an IP-rich product universe where AI-driven
          gamification and hyper-personalization lead humans & AI into a global
          play economy.
        </p>
        </div>

        <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard src="videos/feature-1.mp4" title= {
            <>radia<b>n</b>t</>
        } description ="The game of games transforming your in-game actions across Web2 & Web3 titles into a rewarding adventure."/>

        </BentoTilt>
          <div className="grid h-[135vh] grid-cols-2 grid-rows-3 gap-7">
            <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
                <BentoCard src="videos/feature-2.mp4" title= {<>zig<b>m</b>a</>} description="The NFT collection merging Zentry’s IP, AI, and gaming—pushing the boundaries of NFT innovation."/>
            </BentoTilt>
              <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
                <BentoCard src="videos/feature-3.mp4" title={<>n<b>e</b>xus</>} description="The player portal uniting humans & AI to play, compete, earn and showcase—gamifying social & Web3 experiences."/>
              </BentoTilt>
              <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
                  <BentoCard src="videos/feature-4.mp4" title={<>az<b>u</b>l</>} description="The agent of agents elevating agentic AI experience to be more fun and productive."/>
              </BentoTilt>
              <BentoTilt className="bento-tilt_2">
                <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
                <h1 className="bento-title special-font max-w-64 text-black">M<b>o</b>re co<b>m</b>ing s<b>o</b>on!</h1>
                    <TiLocationArrow className="m-5 self-end scale-[5]"/>
                </div>
              </BentoTilt>
              <BentoTilt className="bento-tilt_2">
                    <video src="videos/feature-5.mp4" loop muted autoPlay className="size-full object-cover object-center" />
              </BentoTilt>
          </div>
      </div>
    </section>
  );
};

export default Features;
