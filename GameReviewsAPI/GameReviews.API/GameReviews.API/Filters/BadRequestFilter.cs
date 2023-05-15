using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameReviews.API.Filters
{
    public class BadRequestFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context) { }
        public void OnActionExecuted(ActionExecutedContext context)
        {
            var result = context.Result as IStatusCodeActionResult;
            if (result == null) return;
            var statusCode = result.StatusCode;
            if (statusCode == 400)
            {
                var response = new List<string>();
                var badRequestsObjectResult = context.Result as BadRequestObjectResult;
                if (badRequestsObjectResult?.Value is string)
                {
                    response.Add(badRequestsObjectResult.ToString());
                }
                else if (badRequestsObjectResult.Value is IEnumerable<IdentityError> errors) //pt erori de idntitate
                {
                    foreach (var error in errors)
                    {
                        response.Add(error.Description);
                    }
                }
                else  //     pt un obiect cu mai multe erori
                {
                    foreach (var key in context.ModelState.Keys)
                    {
                        foreach (var error in context.ModelState[key].Errors)
                        {
                            response.Add($"{key}:{error.ErrorMessage}");
                        }
                    }
                    context.Result = new BadRequestObjectResult(response);
                }
            }
        }
    }
}
