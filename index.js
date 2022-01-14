"use strict";

const Bluebird = require("bluebird");
const Cheerio = require("cheerio");
const Request = Bluebird.promisify(require("request"));
const main = async () => {
  let response = await Request({
    url: "https://github.com/facebook",
    method: "GET",
    headers: { "Cache-Control": "no-cache" },
    timeout: 10000,
  });

  if (response.statusCode !== 200) {
    console.log("[parse][error]: parsing error");
    return;
  }
  console.log("[parse][success] page was fetched successfully");
  let $ = Cheerio.load(response.body);

  //My Code

  const name = $(`.pagehead h1`).text().trim();
  const location = $(`[itemprop=location]`).text();
  const url = $(`[itemprop=url]`).text();
  let reposNodes = $("[data-hovercard-type=repository]");
  let repos = [];

  for (const repoNode of reposNodes) {
    repos.push($(repoNode).text().trim());
  }

  const results = {
    name: name,
    url: url,
    location: location,
    repos: repos.map((item) => ({ name: item })),
  };

  console.log("[parse][result]", results);
};

main();