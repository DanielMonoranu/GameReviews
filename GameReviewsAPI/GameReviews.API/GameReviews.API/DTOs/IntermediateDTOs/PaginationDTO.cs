using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameReviews.API.DTOs.IntermediateDTOs
{
    public class PaginationDTO
    {
        public int Page { get; set; } = 1;
        public int recordsPerPage = 10;
        private readonly int maximumRecordsPerPage = 50;

        public int RecordsPerPage
        {
            get { return recordsPerPage; }
            set { recordsPerPage = value > maximumRecordsPerPage ? maximumRecordsPerPage : value; }
        }

    }
}
