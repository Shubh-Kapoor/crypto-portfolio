import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import {
  Button,
  Container,
  HStack,
  Radio,
  RadioGroup,
  VStack,
  Box,
  Image,
  Heading,
  Text,
  Badge,
} from "@chakra-ui/react";
import Loader from "./Loader";
import ErrorComponent from "./ErrorComponent";
import CoinCard from "./CoinCard";

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("inr");

  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  const changePage = (page) => {
    setPage(page);
    setLoading(true);
  };

  const btns = new Array(132).fill(1);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(
          `${server}/coins/markets?vs_currency=${currency}&page=${page}`
        );
        setCoins(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoins();
  }, [currency, page]);

  if (error) return <ErrorComponent message={"Error While Fetching Coins"} />;

  return (
    <Container maxW={"container.xl"} py={8}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Heading as="h1" mb={8} textAlign="center">
            Top Crypto Coins
          </Heading>
          
          <RadioGroup value={currency} onChange={setCurrency} p={"4"} mb={4}>
            <HStack spacing={"4"}>
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value={"eur"}>EUR</Radio>
            </HStack>
          </RadioGroup>

          <VStack spacing={4} align="stretch">
            <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
              {coins.map((i) => (
                <CoinCard
                  id={i.id}
                  key={i.id}
                  name={i.name}
                  price={i.current_price}
                  img={i.image}
                  symbol={i.symbol}
                  currencySymbol={currencySymbol}
                />
              ))}
            </HStack>

            <HStack w={"full"} overflowX={"auto"} p={"4"} spacing={2}>
              {btns.map((_, index) => (
                <Button
                  key={index}
                  bgColor={"teal.500"}
                  color={"white"}
                  onClick={() => changePage(index + 1)}
                  _hover={{ bgColor: "teal.600" }}
                  _active={{ bgColor: "teal.700" }}
                >
                  {index + 1}
                </Button>
              ))}
            </HStack>
          </VStack>
        </>
      )}
    </Container>
  );
};

export default Coins;
