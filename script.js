const puppeteer = require('puppeteer')

async function run() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  async function getPageData(pageNumber = 1) {
    await page.goto(`https://platzi.com/cursos/pensamiento-logico/opiniones/${pageNumber}/`)
    const data = await page.evaluate(() => {
      const $reviews = document.querySelectorAll('.Review')
      const data = []
      const $pagination = document.querySelectorAll('.Pagination .Pagination-number')
      const totalPages = Number($pagination[$pagination.length - 1].textContent)
      
      $reviews.forEach(($review) => {
        data.push({
          name: $review.querySelector('.Review-name').textContent,
          content: $review.querySelector('.Review-description').textContent,
        })
      })
      return {
        reviews: data,
        totalPages
      }
    })

    if (pageNumber <= data.totalPages) {
      getPageData(pageNumber + 1)
    } else {
      await browser.close()
    }
    console.log(data);
    console.log(`Escrapeando página ${pageNumber}`);
  }
  getPageData()
}

run()