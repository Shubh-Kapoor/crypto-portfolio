import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import Loader from './Loader';
import ErrorComponent from './ErrorComponent';
import { server } from '../main';
import '../animations/animations.css';

const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const { data } = await axios.get(`${server}/exchanges`);
        setExchanges(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchExchanges();
  }, []);

  if (error) return <ErrorComponent message={'Error While Fetching Exchanges'} />;

  return (
    <Container maxW={'container.xl'} py={8}>
      <Heading
        as="h1"
        mb={8}
        textAlign="center"
        className="animated-heading" // Apply animation class
      >
        Top Crypto Exchanges
      </Heading>

      {loading ? (
        <Loader />
      ) : (
        <HStack wrap={'wrap'} justifyContent={'space-evenly'}>
          {exchanges.map((i) => (
            <ExchangeCard
              key={i.id}
              name={i.name}
              img={i.image}
              rank={i.trust_score_rank}
              url={i.url}
            />
          ))}
        </HStack>
      )}
    </Container>
  );
};

const ExchangeCard = ({ name, img, rank, url }) => (
  <a href={url} target={'_blank'} rel={'noopener noreferrer'}>
    <VStack
      w={'52'}
      shadow={'lg'}
      p={'8'}
      borderRadius={'lg'}
      transition={'all 0.3s'}
      m={'4'}
      bgGradient="linear(to-tl, gray.800, blackAlpha.800)"
      _hover={{
        transform: 'scale(1.05)',
        boxShadow: 'lg',
        bgGradient: 'linear(to-br, gray.700, gray.900)',
      }}
    >
      <Image
        src={img}
        w={'12'}
        h={'12'}
        objectFit={'contain'}
        alt={'Exchange'}
        mb={4}
      />
      <Heading size={'lg'} color="whiteAlpha.900" textShadow="0px 1px 3px rgba(0,0,0,0.4)">
        #{rank}
      </Heading>
      <Text color={'whiteAlpha.800'} fontSize={'md'} noOfLines={1}>
        {name}
      </Text>
    </VStack>
  </a>
);

export default Exchanges;
