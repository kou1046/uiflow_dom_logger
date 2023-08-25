import React, { useEffect, useState, useCallback } from "react";
import reactDom from "react-dom";
import { Slider } from "@mui/material";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { ContentType } from "./stores/contentStore";
import { indexedDBStore } from "./stores/indexedDBStore";
import { BlockCanvas } from "./components/BlockCanvas";
import { BlocksTimeLineChart } from "./components/BlocksTimeLineChart";
import { getBlockNum } from "./utils/utils";

export const Popup = () => {
  const [allData, setAllData] = useState<ContentType[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    indexedDBStore
      .getAll()
      .then((resolved: ContentType[]) => {
        setAllData(resolved);
      })
      .catch((err) => console.log(err));
  }, []);

  const deleteAll = useCallback(async () => {
    await indexedDBStore.deleteAll();
    setAllData([]);
  }, []);

  const download = useCallback(async () => {
    const blob = new Blob([JSON.stringify(allData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "blocks.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [allData]);

  return (
    <>
      <main>
        {`ブロックの数: ${
          allData.length ? getBlockNum(allData[currentIndex]) : null
        }`}
        <Box sx={{ textAlign: "center" }}>
          <Button variant="contained" onClick={download}>
            download
          </Button>
          <Button variant="contained" color="error" onClick={deleteAll}>
            delete
          </Button>
        </Box>
        <BlocksTimeLineChart
          allData={allData}
          dataOnClick={(x) => setCurrentIndex(x)}
        />
        {allData.length ? (
          <>
            <BlockCanvas contentState={allData[currentIndex]} />
          </>
        ) : null}
      </main>
    </>
  );
};

reactDom.render(<Popup />, document.querySelector("#app"));
