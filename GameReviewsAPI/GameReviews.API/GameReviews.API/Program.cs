

using GameReviews.API;
using GameReviews.API.APIBehaviour;
using GameReviews.API.AutoMapper;
using GameReviews.API.Filters;
using GameReviews.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options =>  //for filters
{
    options.Filters.Add(typeof(ExceptionFilter));
    // options.Filters.Add(typeof(BadRequestFilter));
}).ConfigureApiBehaviorOptions(BadRequestBehaviour.Parse).AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

//autoMapper:
builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

builder.Services.AddScoped<IFileStorageService, AzureStorageService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => //pt validarea jwtokens
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            //trebuie sa caut astea ce sunt
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,  //verify through signin key
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["jwtkey"])),
            ClockSkew = TimeSpan.Zero
        };

    });

builder.Services.AddCors(options =>   //pt a putea face call-uri in frontend
{
    var frontendURL = builder.Configuration.GetValue<string>("frontend_url");
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(frontendURL).AllowAnyMethod().AllowAnyHeader()
            .WithExposedHeaders(new string[] { "totalAmountOfRecords" });
    });
});

builder.Services.AddResponseCaching(); //pt sistem de cache
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseResponseCaching();//nu cred ca il prea folosesc sincer

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
