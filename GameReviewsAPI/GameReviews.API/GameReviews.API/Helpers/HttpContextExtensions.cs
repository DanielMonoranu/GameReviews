using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace GameReviews.API.Helpers
{
    public static class HttpContextExtensions
    {

        //o metoda care pune in header o variabila cu nr total de records
        public async static Task InsertParametersPaginationInHeader<T>(this HttpContext httpContext,
            IQueryable<T> queryable)
        {
            if (httpContext == null) { throw new ArgumentNullException(nameof(httpContext)); }
            double count = 0.0;
            if (queryable.Provider is IAsyncQueryProvider)
            {
                count = await queryable.CountAsync();
            }
            else
            {
                count = queryable.Count();
            }
            httpContext.Response.Headers.Add("totalAmountOfRecords", count.ToString());
        }
    }
}

