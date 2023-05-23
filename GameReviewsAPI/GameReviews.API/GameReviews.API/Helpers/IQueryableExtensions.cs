using GameReviews.API.DTOs.IntermediateDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameReviews.API.Helpers
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> Paginate<T>(this IQueryable<T> queryable, PaginationDTO paginationDTO)
        {
            return queryable
                .Skip((paginationDTO.Page - 1) * paginationDTO.RecordsPerPage)  //returns results in batches
                .Take(paginationDTO.RecordsPerPage); //only return a certain amount of records
        }
    }
}
