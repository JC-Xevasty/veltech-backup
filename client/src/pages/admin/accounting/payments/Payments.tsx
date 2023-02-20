import { useRef, useState, Fragment, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { debounce } from "lodash"
import { faCancel, faCheck, faCheckDouble, faEye, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import HeaderGroup from "../../../../components/HeaderGroup"
import SearchInput from "../../../../components/SearchInput"
import AddButton from "../../../../components/AddButton"
import PaginatedTable from "../../../../components/PaginatedTable"
import TableAction from "../../../../components/TableAction"
import TableLinkBlank from "../../../../components/TableLinkBlank"
import Modal from "../../../../components/Modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAcceptPaymentMutation, useFetchPaymentsQuery, useRejectPaymentMutation, useUpdateBalanceMutation } from "../../../../features/api/payment"
import { MutationResult, Payment, Project, User } from "../../../../types"
import { toast } from "react-toastify"
import { useCreateNotificationMutation } from "../../../../features/api/notification.api"
import { useCreateActivityMutation } from "../../../../features/api/activity.log"
import { selectApp } from "../../../../features/app/app"
import { selectUser } from "../../../../features/auth/auth"

interface FieldValues {
  query: string
}

function Payments() {
  const [createNotificationMutation] = useCreateNotificationMutation()

  const [createActivityMutation] = useCreateActivityMutation();

  const app = useSelector(selectApp)

  const user = useSelector(selectUser)

  const { offset } = useOutletContext() as { offset: string }

  const navigate = useNavigate()

  const acceptModalRef = useRef<HTMLDialogElement>(null)

  const rejectModalRef = useRef<HTMLDialogElement>(null)

  const [modalTarget, setModalTarget] = useState<any>({})

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>()

  const [filter, setFilter] = useState<{ query: string }>({ query: "" })

  const [filters, setFilters] = useState<{ status: "" | "PENDING" | "ACCEPTED" | "REJECTED" }>({
    status: ""
  })
  const { isLoading, isError, data: queryPayments } = useFetchPaymentsQuery({ query: filter.query, paymentStatus: filters.status });

  const [currentPayments, setCurrentPayments] = useState<typeof queryPayments>([])

  const [rejectPaymentMutation] = useRejectPaymentMutation();
  const [acceptPaymentMutation] = useAcceptPaymentMutation();
  const [updateBalanceMutation] = useUpdateBalanceMutation();


  const handleSearch: SubmitHandler<FieldValues> = (fields) => {
    const { query } = fields;
    setFilter({ query })
  }

  const handleSetStatus = async (status: string, payment: Payment) => {
    if (status === "REJECTED") {
      const rejectPayment: MutationResult<Payment> = await rejectPaymentMutation({
        id: payment.id
      })

      if (rejectPayment?.data!?.id) {
        console.log("Payment Rejected");
      }

      await createActivityMutation({
        userRole: user.type,
        entry: `${ user.username }-reject-payment`,
        module: "PAYMENTS",
        category: "OTHERS",
        status: (rejectPayment?.data!?.id ? "SUCCEEDED" : "FAILED")
      });

      if (rejectPayment?.data!?.message || rejectPayment?.error) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Failed to reject payment!</h1>
          </div>,
          {
            toastId: "register-failed-toast",
            theme: "colored",
            className: "!bg-red-700 !rounded",
            progressClassName: "!bg-white"
          }
        )
      }
    } else if (status === 'ACCEPTED') {
      const acceptPayment: MutationResult<Payment> = await acceptPaymentMutation({
        id: payment.id
      })

      await createActivityMutation({
        userRole: user.type,
        entry: `${ user.username }-accept-payment`,
        module: "PAYMENTS",
        category: "OTHERS",
        status: (acceptPayment?.data!?.id ? "SUCCEEDED" : "FAILED")
      });

      if (acceptPayment?.data!?.id) {
        const updatedBalance: MutationResult<Project> = await updateBalanceMutation({
          projectId: payment.projectId,
          remainingBalance: payment.project.remainingBalance,
          amount: payment.amount,
          category: payment.category,
          milestoneNo: payment.milestoneNo
        });

        if (acceptPayment.data.category === "DOWNPAYMENT") {
          await createNotificationMutation({
            title: "Paid Down Payment",
            body: "We received your down payment for the project. Thank you.\nYou can always monitor the status of the project at the ‘projects tab’ under your profile.",
            projectId: acceptPayment.data.projectId,
            origin: "PROJECT",
            userId: acceptPayment.data.userId
          })
        } else {
          await createNotificationMutation({
            title: `Paid Progress Billing ${acceptPayment.data.milestoneNo}`,
            body: `We received your payment for Milestone ${acceptPayment.data.milestoneNo}. Thank you.`,
            projectId: acceptPayment.data.projectId,
            origin: "PROJECT",
            userId: acceptPayment.data.userId
          })
        }


        if (updatedBalance?.data!?.id) {
          console.log("Updated Balance");
        }
      }

      if (acceptPayment?.data!?.message || acceptPayment?.error) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Failed to accept payment!</h1>
          </div>,
          {
            toastId: "register-failed-toast",
            theme: "colored",
            className: "!bg-red-700 !rounded",
            progressClassName: "!bg-white"
          }
        )
      }
    }
    setFilters((prev) => prev)
  }

  const getClientName = (u: User): string => {
    if (u) {
      let clientName = u.firstName
      clientName = clientName + ((u.middleName) ? ` ${u.middleName.charAt(0)}. ` : " ")
      clientName = clientName + u.lastName
      clientName = clientName + ((u.suffix) ? ` ${u.suffix}` : "")
      return clientName
    }
    return "-"
  }

  const stringToPrice = (val: number): string => {
    if (!val) return "PHP -"
    return `PHP ${parseFloat(val.toString()).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  }

  return (
    <Fragment>
      <Helmet>
        <title>{`${app?.appName || "Veltech Inc."} | Payments`}</title>
      </Helmet>

      <main className={`${offset}`}>
        <div className="flex flex-col justify-start items-start gap-y-5 p-5">
          <HeaderGroup text="Payments" />
          <div className="flex flex-row justify-start items-center gap-x-5">
            <form onSubmit={(e) => e.preventDefault()} onChange={debounce(handleSubmit(handleSearch), 300)}>
              <SearchInput placeholder="Search by client name" {...register("query")} />
            </form>
            <AddButton text="Add New Payment" onClick={() => navigate("/admin/accounting/payments/create")} />
          </div>

          <span className="text-lg">Payments List</span>

          <div className="flex flex-row justify-start items-center gap-x-5">
            <button className={`text-lg ${filters.status === "" && "underline decoration-4 decoration-[#35408F] underline-offset-8"}`} type="button" onClick={() => setFilters({ status: "" })}>All</button>

            <button className={`text-lg ${filters.status === "PENDING" && "underline decoration-4 decoration-[#35408F] underline-offset-8"}`} type="button" onClick={() => setFilters({ status: "PENDING" })}>Pending</button>

            <button className={`text-lg ${filters.status === "ACCEPTED" && "underline decoration-4 decoration-[#35408F] underline-offset-8"}`} type="button" onClick={() => setFilters({ status: "ACCEPTED" })}>Accepted</button>

            <button className={`text-lg ${filters.status === "REJECTED" && "underline decoration-4 decoration-[#35408F] underline-offset-8"}`} type="button" onClick={() => setFilters({ status: "REJECTED" })}>Rejected</button>
          </div>

          <PaginatedTable
            columns={[
              "No.",
              "Client Name",
              "Company Name",
              "Payment Designation",
              "Amount",
              "Current Balance",
              "Status",
              "Actions"
            ]}
            rowData={queryPayments}
            rowsPerPage={10}
            current={{ set: setCurrentPayments }}
          >
            {
              currentPayments?.map((payment: Payment, index: number) => (
                <tr key={`${payment}-${payment.id}`}>
                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[12ch] px-2 py-2">
                    {payment.id}
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[12ch] px-2 py-2">
                    {getClientName(payment.user)}
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[12ch] px-2 py-2">
                    {payment.user.companyName}
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[12ch] px-2 py-2">
                    {payment.category === 'DOWNPAYMENT' ? 'Downpayment' :
                      payment.category === 'MILESTONE' ? `Progress Billing ${payment.milestoneNo}` : "Others"
                    }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[12ch] px-2 py-2">
                    {stringToPrice(+payment.amount)}
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[12ch] px-2 py-2">
                    {stringToPrice(payment.currentBalance)}
                  </td>

                  {/* Unrender if status is pending, accepted, or rejected*/}
                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[12ch] px-2 py-2">
                    <StatusBadge status={payment.paymentStatus} />
                  </td>

                  <td colSpan={10} className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[35ch] px-2 py-2">
                    <div className="flex flex-row justify-start items-center">
                      <TableLinkBlank
                        text="View Receipt"
                        icon={faEye}
                        textHoverColor="hover:text-white"
                        backgroundHoverColor="hover:bg-[#EE9D00]"
                        to={`${process.env.REACT_APP_API_URL}/uploads/${payment.imageFileName}`}
                      />
                      {!['ACCEPTED', 'REJECTED'].includes(payment.paymentStatus) &&
                        <TableAction
                          text="Accept"
                          icon={faCheck}
                          textHoverColor="hover:text-white"
                          backgroundHoverColor="hover:bg-[#00BDB3]"
                          onClick={() => {
                            setModalTarget({
                              payment: payment,
                              client: getClientName(payment.user),
                              designation: `${payment.category === 'DOWNPAYMENT' ? 'Downpayment' :
                                payment.category === 'MILESTONE' ? `Progress Billing ${payment.milestoneNo}` : "Others"
                                }`
                            });
                            rejectModalRef.current!.close()
                            acceptModalRef.current!.show()
                          }} />
                      }
                      {!['ACCEPTED', 'REJECTED'].includes(payment.paymentStatus) &&
                        <TableAction
                          text="Reject"
                          icon={faXmark}
                          textHoverColor="hover:text-white"
                          backgroundHoverColor="hover:bg-primary"
                          onClick={() => {
                            setModalTarget({
                              payment: payment,
                              client: getClientName(payment.user),
                              designation: `${payment.category === 'DOWNPAYMENT' ? 'Downpayment' :
                                payment.category === 'MILESTONE' ? `Progress Billing ${payment.milestoneNo}` : "Others"
                                }`
                            });
                            acceptModalRef.current!.close()
                            rejectModalRef.current!.show()
                          }} />
                      }
                    </div>
                  </td>
                </tr>
              ))}
          </PaginatedTable>
        </div>
      </main>

      <Modal ref={rejectModalRef} padless>
        <div className="h-[10px] bg-[#800000] w-full" />

        <div className="grid grid-cols-3 gap-8 border-b max-w-[400px] p-5">
          <div className="col-span-1 flex flex-row justify-center items-start">
            <FontAwesomeIcon icon={faCancel} color="#B00000" size="4x" fixedWidth />
          </div>

          <div className="col-span-2 flex flex-col justify-start items-start gap-y-2.5">
            <p className="text-lg font-grandview-bold">Reject Payment?</p>

            <p className="text-sm">Reject payment from <span className="font-grandview-bold">{modalTarget?.client}</span> for <span className="font-grandview-bold">{modalTarget?.designation}?</span></p>

            <p className="text-sm">You can't undo this action.</p>
          </div>
        </div>

        <menu className="flex flex-row justify-end items-center gap-x-3 px-5 py-3">
          <button className="text-white font-grandview-bold rounded-sm bg-[#B00000] px-2.5 py-1" type="button" onClick={() => { handleSetStatus('REJECTED', modalTarget?.payment); rejectModalRef.current!.close() }}>Confirm</button>

          <button className="text-white font-grandview-bold rounded-sm bg-[#D9D9D9] px-2.5 py-1" type="button" onClick={() => rejectModalRef.current!.close()}>Cancel</button>
        </menu>
      </Modal>

      <Modal ref={acceptModalRef} padless>
        <div className="h-[10px] bg-[#00BDB3] w-full" />

        <div className="grid grid-cols-3 gap-8 border-b max-w-[400px] p-5">
          <div className="col-span-1 flex flex-row justify-center items-start">
            <FontAwesomeIcon icon={faCheckDouble} color="#00BDB3" size="4x" fixedWidth />
          </div>

          <div className="col-span-2 flex flex-col justify-start items-start gap-y-2.5">
            <p className="text-lg font-grandview-bold">Accept Payment?</p>

            <p className="text-sm">Accept payment from <span className="font-grandview-bold">{modalTarget?.client}</span> for <span className="font-grandview-bold">{modalTarget?.designation}?</span></p>

            <p className="text-sm">You can't undo this action.</p>
          </div>
        </div>

        <menu className="flex flex-row justify-end items-center gap-x-3 px-5 py-3">
          <button className="text-white font-grandview-bold rounded-sm bg-[#00BDB3] px-2.5 py-1" type="button" onClick={() => { handleSetStatus('ACCEPTED', modalTarget?.payment); acceptModalRef.current!.close(); }}>Confirm</button>

          <button className="text-white font-grandview-bold rounded-sm bg-[#D9D9D9] px-2.5 py-1" type="button" onClick={() => acceptModalRef.current!.close()}>Cancel</button>
        </menu>
      </Modal>
    </Fragment>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <div className="flex flex-row justify-start items-center gap-x-2">
      {
        status === "PENDING" ? (
          <Fragment>
            <div className="rounded-full bg-[#FF9900] w-[8px] h-[8px]" />

            <span className="text-sm">Pending</span>
          </Fragment>
        ) : status === "ACCEPTED" ? (
          <Fragment>
            <div className="rounded-full bg-[#53B45A] w-[8px] h-[8px]" />

            <span className="text-sm">Accepted</span>
          </Fragment>
        ) : status === "REJECTED" ? (
          <Fragment>
            <div className="rounded-full bg-[#D12B2E] w-[8px] h-[8px]" />

            <span className="text-sm">Rejected</span>
          </Fragment>
        ) : (
          <Fragment />
        )
      }
    </div>
  )
}

export default Payments