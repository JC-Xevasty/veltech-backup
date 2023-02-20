import { Helmet } from "react-helmet-async"

import Banner from "./Banner"
import Services from "./Services"
import Opportunities from "./Opportunities"
import Story from "./Story"
import Team from "./Team"
import Testimonials from "./Testimonials"

import BannerImage1 from "../../../assets/home/Banner-Image-1.png"
import BannerImage2 from "../../../assets/home/Banner-Image-2.png"

import RebiscoBrand from "../../../assets/brands/Rebisco.png"
import RusiBrand from "../../../assets/brands/Rusi.png"
import JollibeeBrand from "../../../assets/brands/Jollibee.png"
import MangInasalBrand from "../../../assets/brands/MangInasal.png"
import TexasInstrumentsBrand from "../../../assets/brands/TexasInstruments.png"
import ChowkingBrand from "../../../assets/brands/Chowking.png"

import TeamMember1 from "../../../assets/team/Member-1.png"
import TeamMember2 from "../../../assets/team/Member-2.png"
import TeamMember3 from "../../../assets/team/Member-3.png"

import GalleryImage1 from "../../../assets/home/Gallery-Image-1.png"
import GalleryImage2 from "../../../assets/home/Gallery-Image-2.png"
import GalleryImage3 from "../../../assets/home/Gallery-Image-3.png"

import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

const bannerSlides = [
  {
    src: BannerImage1,
    start: "Positive Results from a fast growing Industrial and Business Worldwide.",
    main: "Safety and Security Solutions with quality service!",
    end: "We generate excellent outcomes from our ever-expanding industrial and manufacturing estates, and we have formed a corporate mandate to uphold strong core principles."
  },
  {
    src: BannerImage2,
    start: "Positive Results from a fast growing Industrial and Business Worldwide.",
    main: "Safety and Security Solutions with quality service!",
    end: "We generate excellent outcomes from our ever-expanding industrial and manufacturing estates, and we have formed a corporate mandate to uphold strong core principles."
  }
]

const brandList = [
  {
    src: RebiscoBrand,
    name: "Rebisco"
  },
  {
    src: RusiBrand,
    name: "Rusi"
  },
  {
    src: JollibeeBrand,
    name: "Jollibee"
  },
  {
    src: MangInasalBrand,
    name: "MangInasal"
  },
  {
    src: TexasInstrumentsBrand,
    name: "TexasInstruments"
  },
  {
    src: ChowkingBrand,
    name: "Chowking"
  }
]

const teamMembers = [
  {
    src: TeamMember1,
    name: "Merle Velasco",
    title: "General Manager"
  },
  {
    src: TeamMember2,
    name: "Jhonson Velasco",
    title: "Operations Officer"
  }
]

const subjects = [
  "Schedule Appointment",
  "Suggestion",
  "Service Related Inquiry",
  "Partnership/Collaboration",
  "Job Opportunities"
]

const gallery = [
  {
    src: GalleryImage1
  },
  {
    src: GalleryImage2
  },
  {
    src: GalleryImage3
  },
  {
    src: GalleryImage3
  },
  {
    src: GalleryImage2
  },
  {
    src: GalleryImage1
  }
]

function Home() {
  const app = useSelector(selectApp)

  return (
    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Home` }</title>
      </Helmet>
      
      <div className="grow flex flex-col w-full">
        <Banner slides={ bannerSlides } />

        <Services />

        <Opportunities />

        <Story />

        {/* <Clients brands={ brandList } /> */}

        <Team members={ teamMembers } />

        <Testimonials subjects={ subjects } />
      </div>
    </>
  )
}

export default Home