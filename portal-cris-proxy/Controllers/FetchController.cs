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
        public async Task<IActionResult> Get([FromHeader] string query)
        {
            var url = Path.Combine($"https://portalcris.vdu.lt/server/api/discover/", query);
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