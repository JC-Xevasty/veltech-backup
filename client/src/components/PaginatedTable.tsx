import { useEffect, useState } from 'react'
import Paginate from 'react-paginate'
import { faChevronLeft, faChevronRight, faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Table from './Table'

interface PaginatedTableProps {
  rowData: any
  rowsPerPage: number
  columns: string[]
  current: any
  children: any
}

const PaginatedTable = ({ rowData, rowsPerPage, columns, current, children }: PaginatedTableProps) => {
  const [pageCount, setPageCount] = useState(0)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (rowData?.length) {
      current.set(rowData.slice(offset, offset + rowsPerPage))
      setPageCount(Math.ceil(rowData.length / rowsPerPage))
    }
  }, [offset, rowsPerPage])

  useEffect(() => {
    if (rowData?.length) current.set(rowData.slice(offset, offset + rowsPerPage))
  }, [rowData])

  const handlePageChange = (evt: any) => setOffset((evt.selected * rowsPerPage) % rowData.length);

  return (
    <>
      <Table columns={ columns }>
        { 
          rowData?.length ? children : (
            <tr className='bg-[#F1F1F1]'>
              <td colSpan={ columns.length } className='text-sm text-center border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2.5 py-2'>
                There are no available records.
              </td>
            </tr>
          ) 
        }
      </Table>

      { !!rowData?.length && <div className='flex justify-between items-center w-full mt-5'>
          <span className='text-sm'>Showing { offset + 1 } to { offset + rowsPerPage < rowData?.length ? offset + rowsPerPage : rowData?.length } of { rowData?.length } entries</span>

          <Paginate
            key={ rowData }
            containerClassName='flex justify-start items-center'
            pageLinkClassName='transition ease-in-out duration-300 text-sm hover:text-white border border-accent hover:bg-accent px-2 py-1.5'
            previousLabel={
              <div className='flex items-center gap-x-1'>
                <FontAwesomeIcon icon={ faChevronLeft } size="xs" fixedWidth />

                <span className='tracking-wide'>Prev</span>
              </div>
            }
            previousClassName='flex items-center'
            previousLinkClassName='transition ease-in-out duration-300 text-sm hover:text-white rounded-l-sm border border-accent enabled:hover:bg-accent px-2 py-[0.2rem]'
            breakLabel={
              <div className='mx-2'>
                <FontAwesomeIcon icon={ faEllipsis } fixedWidth />
              </div>
            }
            nextLabel={
              <div className='flex items-center gap-x-1'>
                <span className='tracking-wide'>Next</span>
                
                <FontAwesomeIcon icon={ faChevronRight } size="xs" fixedWidth />
              </div>
            }
            nextClassName='flex items-center'
            nextLinkClassName='transition ease-in-out duration-300 text-sm hover:text-white rounded-r-sm border border-accent enabled:hover:bg-accent px-2 py-[0.2rem]'
            activeLinkClassName='bg-accent text-white'
            disabledLinkClassName='text-slate-300 border-slate-300 hover:text-slate-300 hover:bg-white hover:cursor-default'
            onPageChange={ handlePageChange }
            pageRangeDisplayed={ 3 }
            marginPagesDisplayed={ 3 }
            pageCount={ pageCount }
            renderOnZeroPageCount={ () => {} }
          />
        </div>
      }
    </>
  )
}

export default PaginatedTable