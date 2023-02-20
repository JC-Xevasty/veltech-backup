import React from 'react'

interface Props {
    columns: string[]
    children: any
    
  }

const Table = ({ columns, children }: Props) => {
  return (
    <table className='table border border-x-0 w-full'>
      <thead>
        <tr>
          {
            columns.map(column => {
              return (
                <th className='text-left font-normal text-[#737373] text-sm border border-x-0 px-1.5 py-2' key={ column }>{ column }</th>
              )
            })
          }
        </tr>
      </thead>
      
      <tbody>
        {
          children
        }
      </tbody>
    </table>
  )
}

export default Table