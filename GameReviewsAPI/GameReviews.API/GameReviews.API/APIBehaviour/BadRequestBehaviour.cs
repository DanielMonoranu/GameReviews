using Azure;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameReviews.API.APIBehaviour
{
    public class BadRequestBehaviour
    {
        public static void Parse(ApiBehaviorOptions options)
        {
            options.InvalidModelStateResponseFactory = (context) =>
            {
                var response = new List<string>();
                foreach (var key in context.ModelState.Keys)
                {
                    foreach (var error in context.ModelState[key].Errors)
                    {
                        response.Add($"{key}:{error.ErrorMessage}");
                    }
                }
                return new BadRequestObjectResult(response);
            };
        }
    }
}
