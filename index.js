const http = require("node:http");
const port = 3000;

function requestHandler(req, res) {
  switch (req.url) {
    case "/getTimeStories":
      getTimeStoriesController(req, res);
      break;
    default:
      res.end("Home!");
      break;
  }
}

async function getTimeStoriesController(req, res) {
  const result = await getTimeStories();
  res.writeHead(200, "OK", { "content-type": "application/json" });
  return res.end(JSON.stringify(result));
}

function getTimeStories() {
  const url = "https://time.com";
  return fetch(url)
    .then((res) => res.text())
    .then((data) => {
      if (!data) throw new Error("No data available.");
      const result = [];
      const li_href =
        /<li.*?class="latest-stories__item".*?>([\s\S]*?)<\/li>/gm;
      const href_regex = /"\/(.*?)"/gm;
      const heading_href =
        /<h3.*?class="latest-stories__item-headline".*?>.*?<\/h3>/gm;
      const htag_href = /<h3.*?>|<\/?h3>/g;
      const quotes_href = /"/g;

      const lists = data.match(li_href);

      lists.forEach((item) => {
        const link = url + item.match(href_regex)[0].replace(quotes_href, "");
        const title = item.match(heading_href)[0].replace(htag_href, "");
        result.push({
          title,
          link,
        });
      });
      return result;
    })
    .catch((err) => new Error(err));
}

const server = http.createServer(requestHandler);
server.listen(port, () => console.log(`Listening on ${port}`));
