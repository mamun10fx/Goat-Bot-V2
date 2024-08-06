const axios = require(&#39;axios&#39;);

module.exports = {
  config: {
    name: &quot;time&quot;,
    aliases: [],
    author: &quot;kshitiz&quot;,  
    version: &quot;2.0&quot;,
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: &quot;&quot;
    },
    longDescription: {
      en: &quot;know the time zone of any city&quot;
    },
    category: &quot;????&quot;,
    guide: {
      en: &quot;{p}{n} name of city&quot;
    }
  },
  onStart: async function ({ api, event, args }) {

    const cityName = args.join(&#39; &#39;);

    if (!cityName) {
      api.sendMessage(&quot;Please provide the name of a city.&quot;, event.threadID, event.messageID);
      return;
    }


    try {
      const apiKey = &#39;0Hr3RnpBTgQvQ9np4ibDrQ==CkYJq9yAT5yk6vIn&#39;; // add your own apikey
      const apiUrl = `https://api.api-ninjas.com/v1/worldtime?city=${encodeURIComponent(cityName)}`;
      const response = await axios.get(apiUrl, { headers: { &#39;X-Api-Key&#39;: apiKey } });


      const { timezone, datetime, day_of_week, year, month } = response.data;


      const currentTime = datetime.split(&#39; &#39;)[1]; 
      const message = `???????? ??: ${timezone}n??????? ????: ${currentTime}n????:${year}n?????:${month}n???: ${day_of_week}`;
      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {

      api.sendMessage(&quot;Error fetching time informationnadd your own api key in code&quot;, event.threadID, event.messageID);
    }
  },
};

/*
in future if code stop working 
add your own apikey in code there is guide
you can get apikey from ninja pai web
*/