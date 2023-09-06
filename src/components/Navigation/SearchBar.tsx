import { ChangeEvent, useEffect, useRef, useState } from "react";
import axios from "axios";

import SearchResult from "./SearchResult";
import Alert from "../Alert";
import LoadingSpinner from "../LoadingSpinner";
import { BASE_URL } from "../../util/util";

type Props = {};

interface SearchResults {
  symbol: string;
  name: string;
  type: string;
}

const SearchBar = (props: Props) => {
  const [resultList, setResultList] = useState<SearchResults[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const selectedStockRef = useRef<any>("");

  // close error
  const closeError = () => {
    setError(null);
  };

  //Search stock
  const searchStock = async (keyword: string) => {
    closeError();
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL + "/api/stock_symbols/", {
        params: {
          q: keyword,
        },
      });
      const modifiedResults = response.data?.result?.map((result: any) => {
        // console.log(response);
        setLoading(false);
        return {
          symbol: result.symbol,
          name: result.description,
          // type: result.type,
        };
      });
      setResultList(modifiedResults || []);
      setShowResult(true);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearchStock = (e: ChangeEvent<HTMLInputElement>) => {
    selectedStockRef.current = e.target.value;

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (e.target.value === "") {
      setResultList([]);
      return;
    }

    const timer = setTimeout(() => {
      searchStock(selectedStockRef.current);
    }, 500);

    setTypingTimeout(timer);
  };
  const handleClick = () => {
    if (selectedStockRef.current.value === "" || resultList.length === 0) {
      return;
    }
    setShowResult(true);
  };
  return (
    <>
      <form
        className="search-box-form-container relative mt-2 md:mt-0"
        //   onSubmit={}
      >
        <label aria-hidden="true" className="hidden" htmlFor="search-stock">
          Search Stock
        </label>
        <input
          type="search"
          name="search-stock"
          id="search-stock"
          placeholder="Search Stock..."
          aria-label="Search for stocks"
          className="px-4 rounded py-2 md:w-[400px] inline-block mb-2"
          onChange={handleSearchStock}
          onClick={handleClick}
          value={selectedStockRef.current.value}
          pattern="[\w.]+"
          title="Please only use letters or numbers"
        />
        {/* Loading spinner */}
        {loading && (
          <div
            role="status"
            className="absolute right-8 top-[50%] translate-y-[-60%]"
          >
            <LoadingSpinner />
          </div>
        )}
        {resultList.length > 0 && showResult && (
          <ul className="grid gap-y-2 w-full bg-slate-300 px-4 py-2 rounded absolute left-1/2 transform -translate-x-1/2 max-h-60 overflow-scroll">
            {resultList
              .slice(0, 7)
              .map((result: { symbol: string; name: string; type: string }) => {
                return (
                  <SearchResult
                    key={result.symbol}
                    data={result}
                    close={() => {
                      setShowResult(false);
                    }}
                  />
                );
              })}
          </ul>
        )}
        {error && <Alert message={error!} close={closeError} />}
      </form>
    </>
  );
};

export default SearchBar;
