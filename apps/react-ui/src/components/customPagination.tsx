import React from 'react'
import { CustomPagination } from 'sunrise-ui-plus'
// 使用完整组件
export function Pagination() {
    const [currentPage, setCurrentPage] = React.useState(1)
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }
    return (
        <CustomPagination
            currentPage={ currentPage }
            totalPages={ 10 }
            onPageChange={ handlePageChange }
        />
    )
}

// // 或使用基础组件自行组合
// function ManualExample() {
//     return (
//         <Pagination>
//             <PaginationContent>
//                 <PaginationItem>
//                     <PaginationPrevious onClick={ () => { } } />
//                 </PaginationItem>
//                 <PaginationItem>
//                     <PaginationLink isActive>1</PaginationLink>
//                 </PaginationItem>
//                 <PaginationItem>
//                     <PaginationLink>2</PaginationLink>
//                 </PaginationItem>
//                 <PaginationItem>
//                     <PaginationEllipsis />
//                 </PaginationItem>
//                 <PaginationItem>
//                     <PaginationNext onClick={ () => { } } />
//                 </PaginationItem>
//             </PaginationContent>
//         </Pagination>
//     )
// }