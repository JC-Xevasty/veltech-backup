import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate, useOutletContext } from "react-router-dom"
import { faUpload } from "@fortawesome/free-solid-svg-icons"
import { MutationResult, OutletContext } from "../../../../types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faXmarkCircle, faWarning } from "@fortawesome/free-solid-svg-icons"
import InputGroup from "../../../../components/accounting/InputGroup"
import TextGroup from "../../../../components/TextGroup"
import ButtonOutline from "../../../../components/ButtonOutline"
import { useForm, SubmitHandler } from "react-hook-form"
import HeaderGroup from "../../../../components/HeaderGroup"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useUploadCarouselImageMutation, useCreateCarouselEntryMutation } from "../../../../features/api/carousel.api"
import { useSelector } from "react-redux"
import { selectApp } from "../../../../features/app/app"
import { selectUser } from "../../../../features/auth/auth"
import { useCreateActivityMutation } from "../../../../features/api/activity.log"

interface Fields {
  title: string
  description: string
  imgPath: FileList
}

function CreateCarousel() {
  const app = useSelector(selectApp)

  const auth = useSelector(selectUser)

  const { offset } = useOutletContext() as OutletContext

  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Fields>()

  const validation = {
    title: {
      required: {
        value: true,
        message: "Title is required."
      },
      maxLength: {
        value: 255,
        message: "Title cannot exceed 255 characters."
      }
    },
    description: {
      required: {
        value: true,
        message: "Description is required."
      },
      maxLength: {
        value: 255,
        message: "Description cannot exceed 255 characters."
      }
    },
    imgPath: {
      required: {
        value: true,
        message: "Cover image is required."
      },
      validate: {
        size: (image: FileList) => image[0].size <= 10000000 || "Cover image max size is 10MB."
      }
    }
  }

  const [uploadImage] = useUploadCarouselImageMutation()

  const [createEntry] = useCreateCarouselEntryMutation()

  const [createActivityMutation] = useCreateActivityMutation();

  const handleCreateEntry: SubmitHandler<Fields> = async (fields) => {
    const { title, description, imgPath } = fields

    const image = new FormData()
    image.append("image", imgPath[0])

    const upload: MutationResult<any> = await uploadImage(image)

    await createActivityMutation({
      userRole: auth.type,
      entry: `${ auth.username }-upload-carousel-entry-assets`,
      module: "CREATE-CAROUSEL",
      category: "CREATE",
      status: (upload?.data!.fileName ? "SUCCEEDED" : "FAILED")
    });

    if (upload?.data!.fileName) {
      const create: MutationResult<any> = await createEntry({
        title,
        description,
        imgPath: upload.data.fileName
      })

      await createActivityMutation({
        userRole: auth.type,
        entry: `${ auth.username }-create-carousel-entry`,
        module: "CREATE-CAROUSEL",
        category: "CREATE",
        status: (create?.data!.id ? "SUCCEEDED" : "FAILED")
      });

      if (create?.data!.id) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
             <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
             <h1 className="text-white font-grandview-bold">Successfully created carousel entry!</h1>
          </div>,
          {
             toastId: "failed-create-toast",
             theme: "colored",
             className: "!bg-primary !rounded",
             progressClassName: "!bg-white"
          }
        )

        navigate("/admin/management/carousel", {
          replace: true
        })
      } else {
        toast(
          <div className="flex justify-center items-center gap-x-3">
             <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
             <h1 className="text-white font-grandview-bold">Failed to create carousel entry!</h1>
          </div>,
          {
             toastId: "failed-create-toast",
             theme: "colored",
             className: "!bg-primary !rounded",
             progressClassName: "!bg-white"
          }
        )
      }
    } else {
      toast(
        <div className="flex justify-center items-center gap-x-3">
           <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
           <h1 className="text-white font-grandview-bold">Failed to create carousel entry!</h1>
        </div>,
        {
           toastId: "failed-upload-toast",
           theme: "colored",
           className: "!bg-primary !rounded",
           progressClassName: "!bg-white"
        }
      )
    }
  }

  return (
    <Fragment>
      <Helmet>
        <title>{`${app?.appName || "Veltech Inc."} | Create Carousel Entry`}</title>
      </Helmet>

      <main className={`${offset}`}>
      <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-5">
        <HeaderGroup text="Create Carousel Entry" link="/admin/management/carousel" />

        <form className="flex flex-col gap-y-5" onSubmit={ handleSubmit(handleCreateEntry) }>
          <h4 className="text-lg mt-4 bg-[#F3F1F1] text-[#000] p-2">
            Carousel Information
          </h4>

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5 w-full">
            <div className="w-[35vw] font-grandview-light">
              <InputGroup id="title" { ...register("title", validation.title) } error={ errors.title } label={ "Title" } />

              <div className="pt-4 font-grandview-light ">
                <TextGroup { ...register("description", validation.description) } error={ errors.description } label={ "Description" } />
              </div>
            </div>

            <div className="flex flex-col justify-start items-start gap-y-5 w-full mt-7">
              {
                watch("imgPath") && watch("imgPath").length ? (
                  <img className="object-cover object-center w-full h-[250px]" src={ URL.createObjectURL(watch("imgPath")[0]) } alt="Preview" />
                ) : <Fragment />
              }
              
              <label className="hover:cursor-pointer w-full" htmlFor="imgPath">
                <input className="hidden" type="file" accept=".png, .jpg, .jpeg" { ...register("imgPath", validation.imgPath) } id="imgPath" />

                <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed w-full py-5">
                  <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                  <span className="text-lg text-[#B1C2DE]">Click here to upload image</span>
                </div>
              </label>

              {
                errors?.imgPath && (
                  <div className="flex flex-row justify-start items-center gap-x-3">
                      <FontAwesomeIcon className="text-xs text-[#DE2B2B]" icon={ faWarning } fixedWidth />

                      <span className="text-xs text-[#DE2B2B]">{ errors.imgPath.message }</span>
                  </div>
                )
              }

              <p className="text-[#a9a9a9]">
                (*.jpg *.jpeg *.png) 10MB max 500x500 pixels recommended
              </p>
            </div>
          </div>

          <div className="flex flex-col-2 gap-5">
            <div className="bg-[#00BDB3] text-[#fff]">
              <ButtonOutline
                text={"Save Changes"}
                textColorClass={""}
                textHoverColorClass={""}
                borderColorClass={""}
                borderHoverFillClass={""}
                type={"submit"}
              />
            </div>

            <div className="bg-[#EBEBEB] ">
              <ButtonOutline
                text={"Cancel"}
                textColorClass={""}
                textHoverColorClass={""}
                borderColorClass={""}
                borderHoverFillClass={""}
                type={"button"}
                onClick={ () => navigate("/admin/management/carousel", {
                  replace: true
                }) }
              />
            </div>
          </div>
        </form>
        </main>
      </main>
    </Fragment>
  )
}

export default CreateCarousel
