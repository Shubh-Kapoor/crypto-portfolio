import { Button, HStack } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <HStack
      p={"4"}
      shadow={"lg"}
      bgGradient="linear(to-r, blackAlpha.900, gray.800)"
      spacing={8}
      justify={"center"}
      align={"center"}
    >
      <Button
        variant={"ghost"}
        color={"whiteAlpha.900"}
        fontSize={"xl"}
        _hover={{
          color: "cyan.400",
          transform: "scale(1.1)",
          transition: "0.2s ease-in-out",
        }}
      >
        <Link to="/">Home</Link>
      </Button>
      <Button
        variant={"ghost"}
        color={"whiteAlpha.900"}
        fontSize={"xl"}
        _hover={{
          color: "cyan.400",
          transform: "scale(1.1)",
          transition: "0.2s ease-in-out",
        }}
      >
        <Link to="/exchanges">Exchanges</Link>
      </Button>
      <Button
        variant={"ghost"}
        color={"whiteAlpha.900"}
        fontSize={"xl"}
        _hover={{
          color: "cyan.400",
          transform: "scale(1.1)",
          transition: "0.2s ease-in-out",
        }}
      >
        <Link to="/coins">Coins</Link>
      </Button>
    </HStack>
  );
};

export default Header;
