import { useEffect, useState, Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useFetchSupplierQuery } from "../../../features/api/supplier"

import HeaderGroup from "../../../components/HeaderGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import LoadingScreen from "../../misc/LoadingScreen"
import PageError from "../../misc/PageError"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

interface FieldValues {
  [key: string]: string
}

function ViewSupplier() {
  const app = useSelector(selectApp)
  const { id } = useParams()

  const { isLoading: supplierLoading, isError: supplierError, data: supplier } = useFetchSupplierQuery({ id })

  const [contacts, setContacts] = useState<string[]>(["contact1"])

  const { register, reset } = useForm<FieldValues>({})

  useEffect(() => {
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

  return (
    supplierLoading ? <LoadingScreen /> :
    supplierError ? <PageError /> :
    <Fragment>
      <Helmet>
      <title>{`${app?.appName || "Veltech Inc."} | View Supplier ${ supplier?.name }`}</title>
      </Helmet>

      <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-20 py-10">
        <HeaderGroup text={ `View Supplier ${ supplier?.name }` } link="/accounting/suppliers" />

        <form className="flex flex-col gap-y-3 w-full">
          <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
            Supplier Basic Information
          </div>

          <div className="grid grid-cols-4 gap-x-2.5 py-7">
            <div className="flex flex-col w-full gap-y-3">
              <InputGroup id="supplier-name" label="Supplier Name:*" { ...register("name") } readOnly />
            </div>

            <div className="flex flex-col w-full gap-y-3">
              <InputGroup id="company-phone" label="Company Phone Number*" { ...register("phone") } readOnly />
            </div>

            <div className="flex flex-col w-full gap-y-3">
                <InputGroup id="company-landline" label="Company Landline*" { ...register("landline") } readOnly />
            </div>
          </div>

          <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
            Supplier Contact Information
          </div>

          <div className="flex flex-col items-start justify-start gap-y-3 my-7 w-full">
          {
            contacts!.map((value: string, index: number) => (
              <div className="grid grid-cols-4 gap-x-5 w-full" key={ value }>
                <InputGroup
                  id="first-name"
                  label={ index < 1 ? "First Name: *" : "First Name:" }
                  { ...register(`${ value }FirstName`) }
                  readOnly
                />
                
                <InputGroup
                  id="last-name" 
                  label={ index < 1 ? "Last Name: *" : "Last Name:" }
                  { ...register(`${ value }LastName`) }
                  readOnly
                />
                
                <InputGroup
                  id="email"
                  label={ index < 1 ? "Email Address: *" : "Email Address:" }
                  { ...register(`${ value }EmailAddress`) }
                  readOnly
                />

                <InputGroup
                  id="phone"
                  label={ index < 1 ? "Phone: *" : "Phone:" }
                  { ...register(`${ value }ContactNumber`) }
                  readOnly
                />
              </div>
            ))
          }
        </div>
            
            <div className="grid grid-cols gap-x-5 w-full">
              <div className="col-start-1 flex flex-col gap-y-5">
                <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                  Supplier Address
                </div>
                
                <div className="grid grid-cols-3 gap-x-2.5 my-7">
                  <div className="flex flex-col w-full gap-y-3">
                    <InputGroup id="apartment" label="Apartment/Suite *" {...register("apartment")} readOnly />
                    
                    <InputGroup id="province" label="State/Province" {...register("province")} readOnly />
                  </div>

                  <div className="flex flex-col w-full gap-y-3">
                    <InputGroup id="street" label="Street" {...register("street")} readOnly />

                    <InputGroup id="supplier-name" label="Postal Code" {...register("zipCode")} readOnly />
                  </div>

                  <div className="flex flex-col w-full gap-y-3">
                    <InputGroup id="city" label="City*" {...register("city")} readOnly />
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
                      <InputGroup id="note"label="Note"{...register("note")} readOnly />
                    </div>
                  </div>
              </div>
            </div>
        </form>
      </main>
    </Fragment>
  )
}

export default ViewSupplier