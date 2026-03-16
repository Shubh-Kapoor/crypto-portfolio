import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import btcSrc from "../assets/btc.gif";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <Box w={"full"} h={"85vh"} overflow={"hidden"}>
      <motion.div
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1, // to keep it behind the content
        }}
        animate={{
          background: [
            "linear-gradient(135deg, #000000, #2d2d2d)", // start with black
            "linear-gradient(135deg, #1c1c1c, #3a3a3a)", // transition to dark gray
            "linear-gradient(135deg, #2d2d2d, #000000)", // transition back to black
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <motion.div
        style={{
          height: "80vh",
        }}
        animate={{
          translateY: "20px",
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Image
          w={"full"}
          h={"full"}
          objectFit={"contain"}
          src={btcSrc}
        />
      </motion.div>

      <Text
        fontSize={"6xl"}
        textAlign={"center"}
        fontWeight={"thin"}
        color={"whiteAlpha.700"}
        mt={"-20"}
      >
        Xcrypto
      </Text>
    </Box>
  );
};

export default Home;
