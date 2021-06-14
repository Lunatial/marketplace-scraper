import puppeteer from 'puppeteer';
import fs from 'fs';
import {autoScroll, prepareItems} from './helpers.mjs';

// config
const query = encodeURIComponent(process.env.SEARCH_QUERY);
const city = encodeURIComponent(process.env.SEARCH_CITY);
const maxPrice = process.env.MAX_PRICE;
const asd = 'ford';

const func = async () => {
    const browser = await puppeteer.launch({
        dumpio: true
    });
    const page = await browser.newPage();
    await page.goto(
        // `https://www.facebook.com/marketplace/${city}/search/?query=${query}&maxPrice=${maxPrice}`
        `https://www.facebook.com/marketplace/112617668751102/vehicles`
    );
    await autoScroll(page);

    let robiTitles = await page.evaluate(() => {
        const allElement = document.querySelectorAll('body > div > div > div:nth-child(1) > div > div > div > div > div > div > div > div > div > div > div > div > div > div > span > div > div > a > div > div:nth-child(2) > div:nth-child(2) span span span')


        const result = Array.from(
            allElement
        )
            .map(title => title.innerText.toLowerCase())
            .filter(item => item.includes('ford'))

        console.log(
            result
        )
        return result
    })

    fs.writeFile("./test.txt", JSON.stringify(robiTitles), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

    // let titles = await page.evaluate(() =>
    //   Array.from(
    //     document.querySelectorAll('[data-testid="marketplace_pdp_title"]')
    //   ).map(title => title.innerText.replace(/’|'/g, ''))
    // );
    //
    // let prices = await page.evaluate(() =>
    //   Array.from(
    //     document.querySelectorAll(
    //       '[data-testid="marketplace_feed_item"] div div:first-child div div'
    //     )
    //   ).map(price => price.innerText.replace(/\$/g, ''))
    // );
    //
    // let urls = await page.evaluate(() =>
    //   Array.from(
    //     document.querySelectorAll('[data-testid="marketplace_feed_item"]')
    //   ).map(item => item.href)
    // );
    //
    // // @TODO: get picture URLs and add onto 'items'
    // // @TODO: set up polling
    // // @TODO: generate email
    //
    // const items = await prepareItems(titles, prices, urls);
    // console.log(items)
    await browser.close();
};

func()
