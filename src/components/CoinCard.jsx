import React from 'react';
import { Heading, Image, Text, VStack, Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CoinCard = ({ id, name, img, symbol, price, currencySymbol = '₹' }) => (
  <Link to={`/coin/${id}`}>
    <VStack
      w={'52'}
      shadow={'lg'}
      p={'8'}
      borderRadius={'lg'}
      transition={'all 0.3s'}
      m={'4'}
      bg={'white'}
      _hover={{ transform: 'scale(1.05)', shadow: 'xl' }} // Slightly less aggressive scaling
    >
      <Box
        w={'10'}
        h={'10'}
        overflow="hidden"
        borderRadius="full" // Make image circular
        borderWidth={2}
        borderColor="teal.400"
      >
        <Image src={img} alt={`${name} (${symbol})`} objectFit={'contain'} />
      </Box>
      <Heading size={'md'} noOfLines={1}>
        {symbol}
      </Heading>
      <Text noOfLines={1} fontWeight="semibold" color="teal.600">
        {name}
      </Text>
      <Text noOfLines={1} fontSize="lg" fontWeight="bold" color="teal.500">
        {price ? `${currencySymbol}${price}` : 'NA'}
      </Text>
    </VStack>
  </Link>
);

export default CoinCard;
