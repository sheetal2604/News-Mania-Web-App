import React, { useEffect, useState } from "react";
import NewsItem from "./Newsitem.js";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const NewsComponent = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizefirstletter = (word) => {
    let wordnew = word.charAt(0).toUpperCase() + word.slice(1);
    return wordnew;
  };

  const updateNews = async () => {
    props.setProgress(10);
    let url = `https://newsdata.io/api/1/news?apiKey=${props.apiKey}&country=${props.country}&category=${props.category}&page=${props.nextPage}`;
    // let url =
    // "https://newsdata.io/api/1/news?apikey=pub_989725471f9fc2297b2f3f774008128333b6&category=sports,health&language=en";
    setLoading(true);
    console.log(url);

    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();

    props.setProgress(70);

    setArticles(parsedData.results);
    setLoading(false);
    setTotalResults(parsedData.totalResults);

    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `NewsMania-${capitalizefirstletter(props.category)}`;

    updateNews();
  }, []);

  const fetchMoreData = async () => {
    let url = `https://newsdata.io/api/1/news?apiKey=${props.apiKey}&country=${
      props.country
    }&category=${props.category}&page=${page + 1}`;
    console.log("url2", url);
    setPage(page + 1);

    let data = await fetch(url);
    let parsedData = await data.json();

    setArticles(articles.concat(parsedData.results));
    setTotalResults(parsedData.results.length);
    setLoading(false);
  };

  // console.log("articles", articles);
  // console.log("TotalResults", totalResults, "articles.length", articles.length);
  // console.log("Results length", articles.results);
  return (
    <>
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        NewsMania- Top {capitalizefirstletter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={totalResults !== articles.length}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.link}>
                  <NewsItem
                    title={element.title}
                    description={element.description ? element.description : ""}
                    imageUrl={element.image_url}
                    newsUrl={element.link}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source_id}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

NewsComponent.defaultProps = {
  country: "in",
  pageSize: 20,
  category: "general",
};
NewsComponent.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default NewsComponent;
