import { useEffect, useState, Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { useParams } from "react-router-dom"
import { faCheckCircle, faTrashCan, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useFetchSupplierQuery, useUpdateSupplierMutation } from "../../../features/api/supplier"

import HeaderGroup from "../../../components/HeaderGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import { MutationResult } from "../../../types"
import { api } from "../../../config/axios"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { selectUser } from "../../../features/auth/auth"
import { useCreateActivityMutation } from "../../../features/api/activity.log"

interface FieldValues {
  [key: string]: string
}

function EditSupplier() {
  const app = useSelector(selectApp)
  const user = useSelector(selectUser)
  const navigate = useNavigate()

  const { id } = useParams()

  const { isLoading: supplierLoading, isError: supplierError, data: supplier } = useFetchSupplierQuery({ id })

  const [contacts, setContacts] = useState<string[]>(["contact1"])

  const { register, unregister, handleSubmit, watch, reset, formState: { errors } } = useForm<FieldValues>({
    mode: "onChange"
  })

  useEffect(() => {
    console.log(supplier)

    if (supplier) {
      let defaults = {
        name: supplier.name,
        phone: supplier.phone,
        landline: supplier.landline,
        street: supplier.address.street,
        apartment: supplier.address.suite,
        city: supplier.address.city,
        province: supplier.address.province,
        zipCode: supplier.address.zipCode,
        note: supplier.note
      }

      let contacts = supplier.contacts.map((_: any, index: number) => `contact${ index + 1 }`)

      contacts.forEach((value: string, index: number) => {
        defaults = { ...defaults,
          [`${ value }FirstName`]: supplier.contacts[index].firstName,
          [`${ value }LastName`]: supplier.contacts[index].lastName,
          [`${ value }EmailAddress`]: supplier.contacts[index].emailAddress,
          [`${ value }ContactNumber`]: supplier.contacts[index].phone
        }
      })

      setContacts(contacts)

      reset(defaults)
    }
  }, [supplier, reset])

  const [primaryEmailAddress, primaryContactNumber] = watch(["contact1EmailAddress", "contact1ContactNumber"])

  const validation = {
    name: {
      required: { value: true, message: "Supplier name is required." },
      maxLength: { value: 50, message: "Supplier name must not exceed 50 characters." },
      validate: async (name: string) => {
        const res = await api.post(`/suppliers/exists/name`, {
          name: name.trim()
        })
        return name.trim() === supplier?.name || !res.data.exists || "Supplier already exists."
      }
    },
    phone: {
      required: { value: true, message: "Supplier phone number is required." },
      maxLength: { value: 50, message: "Supplier phone number must not exceed 50 characters." },
      pattern: { value: /^[0-9\)\(\+-\s]+$/, message: "Supplier phone number is invalid." },
      validate: async (phone: string) => {
        const res = await api.post(`/suppliers/exists/company/phone`, {
          phone: phone.trim()
        })
        return phone.trim() === supplier?.phone || !res.data.exists || "Supplier phone number already exists."
      }
    },
    landline: {
      required: { value: true, message: "Supplier landline number is required." },
      maxLength: { value: 50, message: "Supplier landline number must not exceed 50 characters." },
      pattern: { value:/^[0-9\)\(\+-\s]+$/, message: "Supplier landline number is invalid." },
      validate: async (landline: string) => {
        const res = await api.post(`/suppliers/exists/company/landline`, {
          landline: landline.trim()
        })
        return landline.trim() === supplier?.landline || !res.data.exists || "Supplier landline number already exists."
      }
    },
    primaryAddressEmailAddress: {
      required: { value: true, message: "Supplier contact e-mail address is required." },
      maxLength: { value: 50, message: "Supplier contact e-mail address must not exceed 50 characters." },
      pattern: { value: /^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/, message: "Supplier contact e-mail address is invalid." },
      validate: async (emailAddress: string) => {
        const res = await api.post(`/suppliers/exists/contact/email-address`, {
          emailAddress: emailAddress.trim()
        })
        return emailAddress.trim() === supplier?.contacts[0]?.emailAddress || !res.data.exists || "Contact e-mail address already exists."
      }
    },
    primaryAddressPhone: {
      required: { value: true, message: "Supplier contact phone number is required." },
      maxLength: { value: 50, message: "Supplier contact phone number must not exceed 50 characters." },
      pattern: { value: /^[0-9\)\(\+-\s]+$/, message: "Supplier contact phone number is invalid." },
      validate: async (phone: string) => {
        const res = await api.post(`/suppliers/exists/contact/phone`, {
          phone: phone.trim()
        })
        return phone.trim() === supplier?.contacts[0]?.phone || !res.data.exists || "Contact phone number already exists."
      }
    },
    secondaryAddressEmailAddress: {
      required: { value: true, message: "Supplier contact e-mail address is required." },
      maxLength: { value: 50, message: "Supplier contact e-mail address must not exceed 50 characters." },
      pattern: { value: /^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/, message: "Supplier contact e-mail address is invalid." },
      validate: async (emailAddress: string) => {
        const res = await api.post(`/suppliers/exists/contact/email-address`, {
          emailAddress: emailAddress.trim()
        })

        return emailAddress.trim() === supplier?.contacts[1]?.emailAddress || !res.data.exists ? emailAddress.trim() !== primaryEmailAddress.trim() || "Alternative e-mail address cannot be the same as the primary e-mail address." : "Contact e-mail address already exists."
      }
    },
    secondaryAddressPhone: {
      required: { value: true, message: "Supplier contact number is required." },
      maxLength: { value: 50, message: "Supplier contact number must not exceed 50 characters." },
      pattern: { value: /^[0-9\)\(\+-\s]+$/, message: "Supplier contact phone number is invalid." },
      validate: async (phone: string) => {
        const res = await api.post(`/suppliers/exists/contact/phone`, {
          phone: phone.trim()
        })
        
        return phone.trim() === supplier?.contacts[1]?.phone || !res.data.exists ? phone.trim() !== primaryContactNumber.trim() || "Alternative contact number cannot be the same as the primary contact number." : "Contact number already exists."
      }
    },
    firstName: {
      required: { value: true, message: "Contact person first name is required." },
      maxLength: { value: 50, message: "Contact person first name must not exceed 50 characters." },
      pattern: { value: /^([a-zA-Zñ\s]){2,50}$/gm, message: "First Name is invalid." }
    },
    lastName: {
      required: { value: true, message: "Contact person last name is required." },
      maxLength: { value: 50, message: "Contact person last name must not exceed 50 characters." },
      pattern: { value: /^([a-zA-Zñ\s]){2,50}$/gm, message: "First Name is invalid." }
    },
    street: {
      required: { value: true, message: "Street is required." },
      maxLength: { value: 50, message: "Street must not exceed 50 characters." }
    },
    apartment: {
      required: { value: true, message: "Apartment/Suite is required." },
      maxLength: { value: 50, message: "Apartment/Suite must not exceed 50 characters." }
    },
    city: {
      required: { value: true, message: "City is required." },
      maxLength: { value: 50, message: "City must not exceed 50 characters." }
    },
    province: {
      required: { value: true, message: "Province is required." },
      maxLength: { value: 50, message: "Province must not exceed 50 characters." }
    },
    zipCode: {
      required: { value: true, message: "Zip Code is required." },
      maxLength: { value: 25, message: "Zip Code must not exceed 25 characters." },
      pattern: { value: /^[1-9][0-9]*$/, message: "Zip Code is invalid."}
    },
    note: {
      maxLength: { value: 255, message: "City must not exceed 255 characters." }
    }
  }

  const handleAddContact = () => {
    setContacts((contacts) => {
      const max = Math.max(...contacts.map((contact) => +contact.charAt(contact.length - 1)))

      return [...contacts, `contact${ max + 1 }`]
    })
  }

  const handleDeleteContact = (key: string) => {
    setContacts((contacts) => contacts.filter((contact) => contact !== key))

    unregister([`${ key }FirstName`, `${ key }LastName`, `${ key }EmailAddress`, `${ key }ContactNumber`])
  }

  const [updateSupplierMutation] = useUpdateSupplierMutation()
  
  const [createActivityMutation] = useCreateActivityMutation();

  const handleEdit: SubmitHandler<FieldValues> = async (values) => {
    let contactList = {
      contact1: {},
      contact2: {}
    }

    console.log(values)
    console.log(id)

    contacts.forEach((key, index) => {
      contactList = { ...contactList,
        [`contact${ index + 1 }`]: {
          [`firstName${ index + 1 }`]: values[`${ key }FirstName`],
          [`lastName${ index + 1 }`]: values[`${ key }LastName`],
          [`emailAddress${ index + 1 }`]: values[`${ key }EmailAddress`],
          [`contactNumber${ index + 1 }`]: values[`${ key }ContactNumber`],
        }
      }
    })

    let address = {
      street: values.street,
      suite: values.apartment,
      city: values.city,
      province: values.province,
      zipCode: values.zipCode
    }

    const updateSupplier: MutationResult<any> = await updateSupplierMutation({
      id,
      name: values.name,
      phone: values.phone,
      landline: values.landline,
      address: address,
      contact1: contactList.contact1,
      contact2: contactList.contact2,
      note: values.note
    })

    await createActivityMutation({
      userRole: user.type,
      entry: `${ user.username }-update-supplier`,
      module: "EDIT-SUPPLIER",
      category: "CREATE",
      status: (updateSupplier?.data!.id ? "SUCCEEDED" : "FAILED")
    });

    if (updateSupplier?.data!.id) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Successfully created new supplier!</h1>
        </div>,
        {
          toastId: "log-in-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )

      navigate("/accounting/suppliers", {
        replace: true
      })
    }

    if (updateSupplier?.data!?.message || updateSupplier?.error) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to create new supplier!</h1>
        </div>,
        {
          toastId: "log-in-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }

  return (
    <Fragment>
      <Helmet>
        <title>{`${app?.appName || "Veltech Inc."} | Edit Supplier ${ supplier?.name }`}</title>
      </Helmet>
      
      <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-20 py-10">
        <HeaderGroup text={ `Edit Supplier ${ supplier?.name }` } link="/accounting/suppliers" />

        <form className="flex flex-col gap-y-3 w-full" onSubmit={ handleSubmit(handleEdit) }>
          <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
            Supplier Basic Information
          </div>

          <div className="grid grid-cols-4 gap-x-5 py-7">
            <InputGroup
              id="supplier-name"
              label="Supplier Name *"
              { ...register("name", validation.name) }
              error={ errors.name }
            />
          
            <InputGroup
              id="company-phone"
              label="Company Phone Number *"
              { ...register("phone", validation.phone) }
              error={ errors.phone }
            />
          
            <InputGroup
              id="company-landline"
              label="Company Landline *"
              { ...register("landline", validation.landline) }
              error={ errors.landline }
            />
          </div>

          <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
            Supplier Contact Information
          </div>

          <div className="flex flex-col items-start justify-start gap-y-3 my-7 w-full">
            {
              contacts.map((value, index) => (
                <div className="grid grid-cols-4 gap-x-5 w-full" key={ value }>
                  <InputGroup
                    id="first-name"
                    label={ index < 1 ? "First Name: *" : "First Name:" }
                    { ...register(`${ value }FirstName`, validation.firstName) }
                    error={ errors[`${ value }FirstName`] }
                  />
                  
                  <InputGroup
                    id="last-name" 
                    label={ index < 1 ? "Last Name: *" : "Last Name:" }
                    { ...register(`${ value }LastName`, validation.lastName) }
                    error={ errors[`${ value }LastName`] }
                  />
                  
                  <InputGroup
                    id="email"
                    label={ index < 1 ? "Email Address: *" : "Email Address:" }
                    { ...register(`${ value }EmailAddress`, index === 0 ? validation.primaryAddressEmailAddress : validation.secondaryAddressEmailAddress) }
                    error={ errors[`${ value }EmailAddress`] }
                  />

                  <InputGroup
                    id="phone"
                    label={ index < 1 ? "Phone: *" : "Phone:" }
                    { ...register(`${ value }ContactNumber`, index === 0 ? validation.primaryAddressPhone : validation.secondaryAddressPhone) }
                    error={ errors[`${ value }ContactNumber`] }
                  />

                  {
                    index >= 1 && contacts.length > 1 && (
                      <div className="col-start-5 mt-7">
                        <button type="button" onClick={ () => handleDeleteContact(value) }>
                          <FontAwesomeIcon className="transition-all ease-in-out duration-300 text-[#B1C2DE] hover:text-[#DE2B2B]" icon={ faTrashCan } fixedWidth />
                        </button>
                      </div>
                    )
                  }
                </div>
              ))
            }

            {
              contacts && contacts?.length <= 1 && (
                <button className="self-start transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 mt-3 hover:scale-105" type="button" onClick={ handleAddContact }>Add Second Contact</button>
              )
            }
          </div>

          <div className="grid grid-cols gap-x-5 w-full">
            <div className="col-start-1 flex flex-col gap-y-5">
              <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                Supplier Address
              </div>
                
              <div className="grid grid-cols-3 gap-x-5 py-7">
                <div className="flex flex-col w-full gap-y-3">
                  <InputGroup id="apartment" label="Apartment/Suite *" {...register("apartment", validation.apartment) } error={ errors.apartment } />
                  
                  <InputGroup id="province" label="State/Province *" {...register("province", validation.province) } error={ errors.province } />
                </div>

                <div className="flex flex-col w-full gap-y-3">
                  <InputGroup id="street" label="Street *" {...register("street", validation.street) } error={ errors.street } />
                  
                  <InputGroup id="supplier-name" label="Zip Code *" {...register("zipCode", validation.zipCode) } error={ errors.zipCode } />
                </div>

                <div className="flex flex-col w-full gap-y-3">
                  <InputGroup id="city" label="City/Municipality *" {...register("city", validation.city) } error={ errors.city } />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols gap-x-5 w-full">
            <div className="col-start-1 flex flex-col gap-y-5">
                <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                  Others
                </div>
                <div className="grid grid-cols-3 gap-x-2.5 py-7">
                  <div className="flex flex-col w-full gap-y-3">
                    <InputGroup id="note"label="Note"{...register("note")}/>
                  </div>
                </div>
            </div>
          </div>

          <menu className="self-start flex flex-row justify-start items-center gap-x-5">
            <button className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" type="submit">Submit</button>
            <button className="transition-all ease-in-out duration-300 text-[#333333] tracking-wide rounded-sm bg-[#EBEBEB] px-3 py-1.5 hover:scale-105" type="button" onClick={ () => navigate("/accounting/suppliers") }>Cancel</button>
          </menu>
        </form>
      </main>
    </Fragment>
  )
}

export default EditSupplier