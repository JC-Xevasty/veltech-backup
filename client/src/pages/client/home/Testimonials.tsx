import { Link } from "react-router-dom"
import { faQuoteRightAlt, faArrowLeft, faArrowRight, faPhone, faEnvelope, faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { faFacebookSquare, faInstagramSquare } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SwiperCore, { EffectCoverflow, Navigation } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/navigation"

import InputGroup from "../../../components/InputGroup2"
import SelectionGroup from "../../../components/SelectionGroup"
import TextGroup from "../../../components/TextGroup"

import TestimonialImage from "../../../assets/home/Testimonial-Image.png"
import CEOImage1 from "../../../assets/home/CEO-Image-1.png"

import { useForm, RegisterOptions, SubmitHandler } from "react-hook-form"
import { Inquiry, useCreateInquiryMutation } from "../../../features/api/inquiry.api"
import { MutationResult } from "../../../types"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

interface Props {
  subjects: string[]
}

interface Fields {
  [key: string]: string
}

interface Validation {
  [key: string]: RegisterOptions
}

function Testimonials({ subjects }: Props) {
  SwiperCore.use([EffectCoverflow, Navigation])

  const app = useSelector(selectApp)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Fields>()

  const [createInquiry] = useCreateInquiryMutation()

  const validation: Validation = {
    subject: {
      required: {
        value: true,
        message: "Please choose a subject."
      }
    },
    fullName: {
      required: {
        value: true,
        message: "Please specify your full name."
      },
      maxLength: {
        value: 255,
        message: "Specified full name must not exceed 255 characters."
      }
    },
    companyName: {
      required: {
        value: true,
        message: "Please specify your company name."
      },
      maxLength: {
        value: 255,
        message: "Specified company name must not exceed 255 characters."
      }
    },
    emailAddress: {
      required: {
        value: true,
        message: "Please specify your e-mail address."
      },
      maxLength: {
        value: 320,
        message: "Specified e-mail address must not exceed 320 characters."
      },
      pattern: {
        value: /^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/,
        message: "Specified e-mail address is invalid."
      }
    },
    message: {
      required: {
        value: true,
        message: "Please add inquiry message."
      },
      maxLength: {
        value: 2048,
        message: "Inquiry message must not exceed 2048 characters."
      },
    }
  }

  const handleSubmitInquiry: SubmitHandler<Fields> = async (fields) => {
    const { subject, fullName, companyName, emailAddress, message } = fields

    const create: MutationResult<Inquiry> = await createInquiry({
      subject, fullName, companyName, emailAddress, message
    })

    if (create?.data?.id) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
           <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
           <h1 className="text-white font-grandview-bold">Successfully sent inquiry!</h1>
        </div>,
        {
           toastId: "send-inquiry-succeded-toast",
           theme: "colored",
           className: "!bg-primary !rounded",
           progressClassName: "!bg-white"
        }
     )

      reset()
    }

    if (!create?.data?.id  || create?.error) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
           <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
           <h1 className="text-white font-grandview-bold">Failed to send inquiry!</h1>
        </div>,
        {
           toastId: "send-inquiry-failed-toast",
           theme: "colored",
           className: "!bg-red-700 !rounded",
           progressClassName: "!bg-white"
        }
     )
    }
  }

  return (
    <div className="bg-[url('./assets/home/Testimonial-Image.png')] bg-no-repeat bg-cover relative flex flex-col-reverse lg:grid lg:grid-cols-2 gap-x-10 px-10 lg:px-36 py-0 pb-8 lg:py-16 mb-10" id="contact">
      <div className="lg:col-start-1 lg:col-end-2 z-50 w-full lg:w-[450px] mt-10 lg:mt-0 mx-auto">
        <form className="flex flex-col gap-y-2.5 rounded bg-white drop-shadow-[0_0_15px_#00000044] px-10 py-8" onSubmit={ handleSubmit(handleSubmitInquiry) }>
          <h1 className="text-accent text-3xl font-grandview-bold">Let's get in touch!</h1>
          <h6 className="text-accent text-lg">Our company would like to hear from you!</h6>

          <SelectionGroup
            { ...register("subject", validation.subject) }
            error={ errors.subject }
            options={ ["Schedule Appointment", "Suggestion", "Service Related Inquiry", "Partnership/Collaboration", "Job Opportunities"] }
            values={ ["SCHEDULE_APPOINTMENT", "SUGGESTION", "SERVICE_RELATED_INQUIRY", "PARTNERSHIP_COLLABORATION", "JOB_OPPORTUNITIES"] }
            label="Subject *"
          />

          <InputGroup
            { ...register("fullName", validation.fullName) }
            error={ errors.fullName }
            type="text"
            label="Full Name *"
          />

          <InputGroup
            { ...register("companyName", validation.companyName) }
            error={ errors.companyName }
            type="text"
            label="Company Name *"
          />

          <InputGroup
            { ...register("emailAddress", validation.emailAddress) }
            error={ errors.emailAddress }
            type="text"
            label="E-mail Address *"
          />

          <TextGroup
            { ...register("message", validation.message) }
            error={ errors.message }
            label="Message *"
          />

          <button className="text-white bg-accent font-grandview-bold w-fit px-24 py-1.5" type="submit">
            Submit
          </button>
        </form>
      </div>

      <div className="lg:col-start-2 lg:col-end-3 z-50 w-full lg:w-[350px] mr-auto mt-16">
        <h3 className="text-lg text-white font-grandview-bold mb-2">Client Testimonials</h3>

        <Swiper
          modules={ [EffectCoverflow, Navigation] }
          effect="coverflow"
          centeredSlides
          loop
          navigation={{
            prevEl: ".swiper-button-prev-testimonials",
            nextEl: ".swiper-button-next-testimonials"
          }}
          allowTouchMove={ false }
          slidesPerView={ 1 }
        >
          <SwiperSlide>
            <div className="flex flex-col items-start gap-y-5 text-white">
              <p>I’ve seen great companies serving safety and security solutions in my career but not to the point where you feel that comfort and trust that we get with Veltech.</p>
          
              <div className="flex flex-col gap-y-3 border-l-2 border-l-white">
                <div className="flex gap-x-2 items-end">
                  <img className="select-none w-[70px] ml-5" src={ CEOImage1 } alt="CEO 1" draggable={ false } />
                  <FontAwesomeIcon icon={ faQuoteRightAlt } fixedWidth />
                </div>
                
                <div className="flex flex-col items-start">
                  <span className="font-grandview-bold ml-5">Kenneth Gunay</span>
                  <span className="text-sm ml-5">Rebisco</span>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="flex flex-col items-start gap-y-5 text-white">
              <p>I’ve seen great companies serving safety and security solutions in my career but not to the point where you feel that comfort and trust that we get with Veltech.</p>
          
              <div className="flex flex-col gap-y-3 border-l-2 border-l-white">
                <div className="flex gap-x-2 items-end">
                  <img className="select-none w-[70px] ml-5" src={ CEOImage1 } alt="CEO 1" draggable={ false } />
                  <FontAwesomeIcon icon={ faQuoteRightAlt } fixedWidth />
                </div>
                
                <div className="flex flex-col items-start">
                  <span className="font-grandview-bold ml-5">Aiken Gunay</span>
                  <span className="text-sm ml-5">Apple Inc.</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <menu className="flex items-center gap-x-3 float-left lg:float-right mt-5">
          <button className="swiper-button-prev-testimonials transition-all ease-in-out duration-300 text-white hover:text-white border-[1.5px] border-white hover:border-white lg:hover:border-accent bg-transparent hover:bg-accent px-2">
            <FontAwesomeIcon icon={ faArrowLeft } fixedWidth />
          </button>
          
          <button className="swiper-button-next-testimonials transition-all ease-in-out duration-300 text-white hover:text-white border-[1.5px] border-white hover:border-white lg:hover:border-accent bg-transparent hover:bg-accent px-2">
            <FontAwesomeIcon icon={ faArrowRight } fixedWidth />
          </button>
        </menu>

        <div className="flex items-center justify-center gap-x-5 ml-20 mt-20">
          <div className="transition-all ease-in-out duration-300 flex items-center gap-x-3 text-white border-2 border-white px-2 py-1">
            <FontAwesomeIcon icon={ faPhone } fixedWidth />
            
            <div className="flex flex-col">
              <span>CALL US</span>
              <span className="font-grandview-bold whitespace-nowrap">{ app?.companyContactNumber }</span>
            </div>
          </div>
          
          <div className="transition-all ease-in-out duration-300 flex items-center gap-x-3 text-white border-2 border-white hover:border-accent hover:bg-accent px-2 py-1">
            <FontAwesomeIcon icon={ faEnvelope } fixedWidth />
            
            <div className="flex flex-col">
              <span>EMAIL US</span>
              <a href={ `mailto:${ app?.companyEmailAddress }` } className="font-grandview-bold whitespace-nowrap">{ app?.companyEmailAddress }</a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-start gap-x-2.5 text-white mt-5">
          <span>FOLLOW US:</span>

          <a className="transition-all ease-in-out duration-300 hover:text-accent" href="https://www.facebook.com/profile.php?id=100086709789324" target="_blank" rel="noreferrer" onClick={ () => window.scrollTo(0, 0) }>
            <FontAwesomeIcon icon={ faFacebookSquare } size="lg" fixedWidth />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Testimonials