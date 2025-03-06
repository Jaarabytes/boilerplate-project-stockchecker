'use strict';

module.exports = function (app) {
  let likes = {}; // Store likes outside the request handler

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      console.log('----------------------------------------');
      console.log('@GET /api/stock-prices?[stock]&[like]');
      try {
        const ip = req.headers['x-forwarded-for'] || req.ip;
        console.log(`User IP: ${ip}`);

        let stocksToSearch = req.query.stock;
        if (!stocksToSearch) {
          return res.status(400).json({ error: 'Stock parameter is required' });
        }
        if (!Array.isArray(stocksToSearch)) {
          stocksToSearch = [stocksToSearch]; // Convert to array if single stock
        }

        console.log(`Stocks to search are: ${stocksToSearch}`);
        console.log(`Likes are: ${req.query.like ? 'required' : 'NOT required'}`);

        // Update likes if req.query.like is true
        if (req.query.like) {
          stocksToSearch.forEach((stock) => {
            if (!likes[stock]) {
              likes[stock] = new Set();
            }
            likes[stock].add(ip);
          });
        }

        const stockDataPromises = stocksToSearch.map(async (stock) => {
          try {
            const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
            const data = await response.json();
            let answer = { stock: data.symbol, price: data.latestPrice };
            console.log(`Answer looks like: ${JSON.stringify(answer)}`);
            return answer;
          } catch (error) {
            console.error(`Error fetching stock ${stock}:`, error);
            return { stock: stock, error: 'Failed to fetch stock data' };
          }
        });

        const stockData = await Promise.all(stockDataPromises);

        // Add like count to ALL stocks (not just when single stock)
        stockData.forEach((stockItem) => {
          if (likes[stockItem.stock]) {
            stockItem.likes = likes[stockItem.stock].size;
            console.log(`stockItem.likes for ${stockItem.stock} looks like this ${stockItem.likes}`);
          } else {
            stockItem.likes = 0; // if no likes, set to 0.
            console.log(`stockItem.likes for ${stockItem.stock} looks like this ${stockItem.likes}`);
          }
        });

        // Calculate relative likes if two stocks are being compared
        if (stocksToSearch.length === 2) {
          // Remove the likes property and add rel_likes for comparison mode
          const stock1Likes = stockData[0].likes || 0;
          const stock2Likes = stockData[1].likes || 0;
          
          stockData[0].rel_likes = stock1Likes - stock2Likes;
          stockData[1].rel_likes = stock2Likes - stock1Likes;
          
          // Remove the likes property as it's replaced by rel_likes in comparison mode
          delete stockData[0].likes;
          delete stockData[1].likes;
          
          console.log(`${stockData[0].stock} has relative likes: ${stockData[0].rel_likes}`);
          console.log(`${stockData[1].stock} has relative likes: ${stockData[1].rel_likes}`);
        }
        
        console.log(`Likes object looks like this: ${JSON.stringify(Object.fromEntries(Object.entries(likes).map(([k, v]) => [k, Array.from(v)])))}`)
        console.log(`Stock Data to be returned is: ${JSON.stringify(stockData)}`);
        console.log('--------------------------------------');

        // Format response based on number of stocks
        if (stocksToSearch.length === 1) {
          return res.json({ stockData: stockData[0] });
        } else {
          return res.json({ stockData: stockData });
        }
      } catch (error) {
        console.log('Error received');
        console.error(`Error when processing request: ${error}`);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
};
