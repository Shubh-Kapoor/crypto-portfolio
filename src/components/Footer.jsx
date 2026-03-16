import { Box, Stack, Text, VStack, HStack, Link, Icon } from "@chakra-ui/react";
import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      bgColor={"blackAlpha.900"}
      color={"whiteAlpha.700"}
      minH={"48"}
      px={"16"}
      py={["16", "8"]}
    >
      <Stack direction={["column", "row"]} spacing={8} h={"full"} alignItems={"center"}>
        <VStack w={"full"} alignItems={["center", "flex-start"]} spacing={4}>
          <Text fontWeight={"bold"} fontSize={"lg"}>About Us</Text>
          <Text
            fontSize={"sm"}
            letterSpacing={"widest"}
            textAlign={["center", "left"]}
          >
            We are the best crypto portfolio management app in India, providing expert insights and tracking at affordable prices.
          </Text>
        </VStack>

        <VStack w={"full"} alignItems={["center", "flex-start"]} spacing={4}>
          <HStack spacing={4}>
            <Icon as={FaGithub} boxSize={6} color="whiteAlpha.700" />
          </HStack>
        </VStack>
      </Stack>

      <Text fontSize={"sm"} textAlign={"center"} mt={8}>
        &copy; {new Date().getFullYear()} Crypto Portfolio App. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
