import { Link } from "react-router-dom"
import { v4 } from "uuid"
import { EffectFade, Navigation, Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { useFetchCarouselEntriesQuery } from "../../../features/api/carousel.api"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/navigation"
import "swiper/css/pagination"

import MiniImage1 from "../../../assets/home/Mini-Image-1.png"
import LoadingScreen from "../../misc/LoadingScreen"
import PageError from "../../misc/PageError"

interface Props {
  slides: {
    src: any
    start: string
    main: string
    end: string
  }[]
}

const Banner = ({ slides }: Props) => {
  const { isLoading: entriesLoading, isError: entriesError, data: entries } = useFetchCarouselEntriesQuery()

  return (
    entriesLoading ? <LoadingScreen /> :
    entriesError ? <PageError /> :
    <div className="relative hidden lg:block z-10" id="banner">
      <div className="z-10 w-full">
        <Swiper
          modules={ [EffectFade, Navigation] }
          effect="fade"
          centeredSlides
          loop
          navigation
          grabCursor
          slidesPerView={ 1 }
          className="home-carousel-slider"
        >
          {
            entries?.filter(entry => entry.status === "ACTIVE").length ? entries?.filter(entry => entry.status === "ACTIVE").map((entry) => (
              <SwiperSlide key={ v4() }>
                <div className="relative">
                  <img className="object-cover select-none w-full h-[650px]" src={ `${ process.env.REACT_APP_API_URL }/uploads/${ entry.imgPath }` } draggable={ false } alt=""/>
                  
                  <div className="absolute top-0 left-60 right-60 flex flex-col gap-y-5 justify-center h-full">
                    <h1 className="text-[4.25rem] leading-tight text-white font-grandview-bold select-none line-clamp-3 text-ellipsis">{ entry.title }</h1>
                    <h4 className="text-[1.15rem] text-white font-grandview-bold select-none line-clamp-2 text-ellipsis">{ entry.description }</h4>

                    <menu className="bottom-0 flex items-center gap-x-8 mt-5">
                      <Link className="transition-all ease-in-out duration-300 text-white hover:text-primary font-grandview-bold tracking-wide rounded border-2 border-white bg-transparent hover:bg-white hover:scale-105 px-5 py-3.5" to="/quotation">
                        Request a Quote
                      </Link>
                    </menu>
                  </div>
                </div>
              </SwiperSlide>
            )) : slides.map(slide => (
              <SwiperSlide key={ v4() }>
                <div className="relative">
                  <img className="object-cover select-none w-full h-[650px]" src={ slide.src } draggable={ false } alt=""/>
                  
                  <div className="absolute top-0 left-60 right-60 flex flex-col gap-y-5 justify-center h-full">
                    <h4 className="text-[1.15rem] text-white font-grandview-bold select-none line-clamp-2 text-ellipsis">{ slide.start }</h4>
                    <h1 className="text-[4.25rem] leading-tight text-white font-grandview-bold select-none line-clamp-3 text-ellipsis">{ slide.main }</h1>
                    <h4 className="text-[1.15rem] text-white font-grandview-bold select-none line-clamp-2 text-ellipsis">{ slide.end }</h4>

                    {/* <menu className="bottom-0 flex items-center gap-x-8 mt-5">
                      <Link className="transition-all ease-in-out duration-300 text-white hover:text-primary font-grandview-bold tracking-wide rounded border-2 border-white bg-transparent hover:bg-white hover:scale-105 px-5 py-3.5" to="/quotation">
                        Request a Quote
                      </Link>
                    </menu> */}
                  </div>
                </div>
              </SwiperSlide>
            )) 
          }
        </Swiper>
      </div>

      <div className="absolute bottom-0 right-[250px] translate-y-1/2 bg-primary z-50 w-[350px]">
        <Swiper
          modules={ [Pagination] }
          centeredSlides
          pagination={{
            clickable: true,
            enabled: true,
            clickableClass: "mini-carousel-bullets"
          }}
          slidesPerView={ 1 }
          grabCursor
          className="mini-carousel-slider"
        >
          <SwiperSlide>
            <div className="grid grid-cols-7 select-none">
              <div className="col-start-1 col-end-5 flex flex-col gap-y-2.5 px-5 py-3">
                <span className="text-white font-grandview-bold text-[0.95rem]">Let’s keep your establishment fire free!</span>
                <span className="text-white text-[0.65rem]">Provides the highest quality of fire protection tools and equipment.</span>
              </div>

              <div className="col-start-5 col-end-8">
                <img src={ MiniImage1 } alt=""/>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="grid grid-cols-7 select-none">
              <div className="col-start-1 col-end-5 flex flex-col gap-y-2.5 px-5 py-3">
                <span className="text-white font-grandview-bold text-[0.95rem]">Let’s keep your establishment fire free!</span>
                <span className="text-white text-[0.65rem]">With the utmost quality service that the company provides for better safety and security.</span>
              </div>

              <div className="col-start-5 col-end-8">
                <img src={ MiniImage1 } alt=""/>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  )
}

export default Banner