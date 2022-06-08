const express = require("express");
const app = express();
const axios = require("axios").default;
const port = 3000;

app.get("/getTimeStories", async (req, res) => {
  const result = await getTimeStories();
  return res.json(result);
});

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

// return axios
//   .get(url)
//   .then(({ data }) => {
//     if (!data) throw new Error("No data available.");
//     const result = [];
//     const li_href = /<li.*?class="latest-stories__item".*?>([\s\S]*?)<\/li>/gm;
//     const href_regex = /"\/(.*?)"/gm;
//     const heading_href =
//       /<h3.*?class="latest-stories__item-headline".*?>.*?<\/h3>/gm;
//     const htag_href = /<h3.*?>|<\/?h3>/g;
//     const quotes_href = /"/g;

//     const lists = data.match(li_href);

//     lists.forEach((item) => {
//       const link = url + item.match(href_regex)[0].replace(quotes_href, "");
//       const title = item.match(heading_href)[0].replace(htag_href, "");
//       result.push({
//         title,
//         link,
//       });
//     });
//     return result;
//   })
//   .catch((err) => new Error(err));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
