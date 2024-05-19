using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

namespace FetchJsonApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FetchController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public FetchController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery]int page, [FromQuery]int size)
        {
            var url = $"https://portalcris.vdu.lt/server/api/discover/search/objects?sort=dc.date.issued,DESC&page={page}&size={size}&configuration=RELATION.OrgUnit.publications&scope=f3a15186-d000-4e14-a914-98581cb2db52&embed=thumbnail&embed=item%2Fthumbnail&embed=item%2Fthumbnail%2FaccessStatus";
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                return Ok(json);
            }
            else
            {
                return StatusCode((int)response.StatusCode, response.ReasonPhrase);
            }
        }
    }
}