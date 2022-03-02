import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import needle from "needle";

export default function Home() {
  let reply = "";
  const token = "Token";

  const endpointURL = "https://api.twitter.com/2/tweets?ids=";

  async function getRequest() {
    // These are the parameters for the API request
    // specify Tweet IDs to fetch, and any additional fields that are required
    // by default, only the Tweet ID and text are returned
    const params = {
      ids: "1498802041740746752", // Edit Tweet IDs to look up
      "tweet.fields": "lang,author_id", // Edit optional query parameters here
      "user.fields": "created_at", // Edit optional query parameters here
    };

    // this is the HTTP header that adds bearer token authentication
    const res = await needle("get", endpointURL, params, {
      headers: {
        "User-Agent": "v2TweetLookupJS",
        authorization: `Bearer ${token}`,
      },
    });

    if (res.body) {
      return res.body;
    } else {
      throw new Error("Unsuccessful request");
    }
  }

  (async () => {
    try {
      // Make request
      const response = await getRequest();
      console.dir(response, {
        depth: null,
      });
      console.log(response.data[0].text);
      reply = response.data[0].text;
    } catch (e) {
      console.log(e);
      process.exit(-1);
    }
    process.exit();
  })();

  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ animal: reply }),
      // console.log(reply),
    });
    const data = await response.json();
    setResult(data.result);
    setAnimalInput("");
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Name my pet</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
