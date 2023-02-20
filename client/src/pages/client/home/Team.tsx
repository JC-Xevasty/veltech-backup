import { useCallback, useLayoutEffect, useState } from "react"
import { Navigation } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"

import ButtonPrev from "../../../assets/home/Team-Carousel-Button-Prev.png"
import ButtonNext from "../../../assets/home/Team-Carousel-Button-Next.png"

interface Props {
  members: {
    src: any
    name: string
    title: string
  }[]
}

function Team({ members }: Props) {
  const [isLargeScreen, setLargeScreen] = useState<boolean>(window.innerWidth >= 1024)

  const resize = useCallback((evt: any) => {
    setLargeScreen(evt.target!.innerWidth >= 1024)
  }, [])

  useLayoutEffect(() => {
    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [resize])

  return (
    <>
      <div className="flex flex-col items-start gap-y-5 px-10 lg:px-36 pb-5 lg:pb-20" id="team">
        <h1 className="text-5xl text-primary font-grandview-bold">Our Team</h1>
        <h3 className="text-3xl font-grandview-bold">We have the best people here.</h3>
        <h6 className="text-xl">Our specialists are enthusiastic people with technical knowledge, strategists that think beyond the box, and professionals who stick to their vision.</h6>

        <div className="flex items-center gap-x-10 w-4/5 mx-auto mt-5">
          <button className="swiper-button-prev-unique">
            <img className="h-[50px] w-[75px] lg:h-auto lg:w-[50px]" src={ ButtonPrev } alt="Button Previous" />
          </button>

          <Swiper
            modules={ [Navigation] }
            spaceBetween={ 50 }
            centeredSlides
            loop
            navigation={{
              prevEl: ".swiper-button-prev-unique",
              nextEl: ".swiper-button-next-unique"
            }}
            allowTouchMove={ false }
            slidesPerView={ isLargeScreen ? 3 : 1 }
          >
            {
              members.map((member, index) => (
                <SwiperSlide key={ `member-${ index }` }>
                  <div className="flex flex-col justify-center">
                    <img className="object-cover select-none" src={ member.src } alt={ `${ member.name }` } draggable={ false } />
                    
                    <div className="rounded bg-white -translate-y-1/2 w-5/6 pr-5 py-5 z-[100]">
                      <div className="flex flex-col gap-y-1.5 border-l-4 border-l-accent">
                        <span className="text-primary font-grandview-bold ml-3">{ member.name }</span>
                        <span className="text-xs text-accent ml-3">{ member.title }</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            }
          </Swiper>

          <button className="swiper-button-next-unique">
            <img className="h-[50px] w-[75px] lg:h-auto lg:w-[50px]" src={ ButtonNext } alt="Button Next" />
          </button>
        </div>
      </div>
    </>
  )
}

export default Team