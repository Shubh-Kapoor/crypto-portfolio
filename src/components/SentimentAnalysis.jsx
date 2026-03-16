import React, { useEffect, useState } from 'react';
import {
  Box, Button, HStack, Text, VStack, Badge, Spinner, Divider,
  CircularProgress, CircularProgressLabel, Heading, Icon,
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiRefreshCw } from 'react-icons/fi';

const generateSentiment = (coin) => {
  const md = coin.market_data;
  const change24h = md.price_change_percentage_24h || 0;
  const change7d = md.price_change_percentage_7d || 0;
  const change30d = md.price_change_percentage_30d || 0;
  const athChange = md.ath_change_percentage?.usd || 0;

  let score = 50;
  score += change24h * 1.5;
  score += change7d * 1.0;
  score += change30d * 0.5;
  if (athChange > -20) score += 10;
  score = Math.min(95, Math.max(5, Math.round(score)));

  const verdict = score >= 60 ? 'Bullish' : score <= 40 ? 'Bearish' : 'Neutral';
  const risk = score >= 70 || score <= 30 ? 'High' : score >= 55 || score <= 45 ? 'Medium' : 'Low';

  const positiveSignals = [];
  const negativeSignals = [];
  const neutralSignals = [];

  if (change24h > 0) positiveSignals.push(`Up ${change24h.toFixed(2)}% in the last 24 hours`);
  else negativeSignals.push(`Down ${Math.abs(change24h).toFixed(2)}% in the last 24 hours`);

  if (change7d > 0) positiveSignals.push(`Strong 7-day momentum of +${change7d.toFixed(2)}%`);
  else negativeSignals.push(`Weak 7-day performance at ${change7d.toFixed(2)}%`);

  if (change30d > 0) positiveSignals.push(`Positive 30-day trend of +${change30d.toFixed(2)}%`);
  else negativeSignals.push(`Declining 30-day trend at ${change30d.toFixed(2)}%`);

  if (athChange > -30) positiveSignals.push(`Trading close to all-time high levels`);
  else neutralSignals.push(`Currently ${Math.abs(athChange).toFixed(0)}% below all-time high`);

  if (md.max_supply) neutralSignals.push(`Fixed max supply of ${md.max_supply.toLocaleString()} coins`);
  else neutralSignals.push(`No maximum supply cap`);

  neutralSignals.push(`Market cap rank #${coin.market_cap_rank}`);

  const summaries = {
    Bullish: `${coin.name} is showing strong bullish momentum with positive price action across multiple timeframes. Market sentiment appears favorable with increasing buying pressure. Investors are showing confidence in the asset's near-term outlook.`,
    Bearish: `${coin.name} is currently facing bearish pressure with declining price action across key timeframes. Market sentiment remains cautious as selling pressure outweighs buying interest. Investors should watch for key support levels.`,
    Neutral: `${coin.name} is consolidating with mixed signals across timeframes. The market is in a wait-and-see mode with neither strong buying nor selling pressure dominating. A breakout in either direction could define the next trend.`,
  };

  return { verdict, score, risk, summary: summaries[verdict], signals: { positive: positiveSignals, negative: negativeSignals, neutral: neutralSignals } };
};

const SentimentAnalysis = ({ coin }) => {
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = () => {
    setLoading(true);
    setSentiment(null);
    setTimeout(() => { setSentiment(generateSentiment(coin)); setLoading(false); }, 1500);
  };

  useEffect(() => { if (coin?.market_data) analyze(); }, [coin?.id]);

  const verdictColor = { Bullish: 'green', Bearish: 'red', Neutral: 'yellow' };
  const riskColor = { Low: 'green', Medium: 'orange', High: 'red' };
  const VerdictIcon = { Bullish: FiTrendingUp, Bearish: FiTrendingDown, Neutral: FiMinus };
  const scoreColor = (s) => s >= 65 ? 'green.400' : s <= 35 ? 'red.400' : 'yellow.400';

  return (
    <Box w="full" mt={8} p={6} bgGradient="linear(to-br, gray.900, blackAlpha.900)" borderRadius="xl" borderWidth={1} borderColor="whiteAlpha.200">
      <HStack justify="space-between" mb={4}>
        <Heading size="md" color="whiteAlpha.900">🧠 AI Sentiment Analysis</Heading>
        <Button size="sm" leftIcon={<FiRefreshCw />} colorScheme="teal" variant="outline" onClick={analyze} isLoading={loading} loadingText="Analyzing...">Refresh</Button>
      </HStack>
      <Divider borderColor="whiteAlpha.200" mb={5} />
      {loading && (<VStack py={8} spacing={3}><Spinner size="xl" color="teal.400" thickness="4px" /><Text color="whiteAlpha.600" fontSize="sm">Analyzing {coin.name} market data…</Text></VStack>)}
      {sentiment && !loading && (
        <VStack spacing={5} align="stretch">
          <HStack spacing={6} justify="center" flexWrap="wrap" gap={4}>
            <CircularProgress value={sentiment.score} color={scoreColor(sentiment.score)} trackColor="whiteAlpha.100" size="100px" thickness="10px">
              <CircularProgressLabel color="whiteAlpha.900" fontSize="lg" fontWeight="bold">{sentiment.score}</CircularProgressLabel>
            </CircularProgress>
            <VStack align="flex-start" spacing={2}>
              <HStack>
                <Icon as={VerdictIcon[sentiment.verdict]} color={`${verdictColor[sentiment.verdict]}.400`} boxSize={6} />
                <Badge fontSize="lg" px={3} py={1} borderRadius="md" colorScheme={verdictColor[sentiment.verdict]}>{sentiment.verdict}</Badge>
              </HStack>
              <HStack>
                <Text color="whiteAlpha.600" fontSize="sm">Risk Level:</Text>
                <Badge colorScheme={riskColor[sentiment.risk]} fontSize="sm">{sentiment.risk}</Badge>
              </HStack>
            </VStack>
          </HStack>
          <Box bg="whiteAlpha.50" borderRadius="md" p={4} borderLeft="3px solid" borderColor={`${verdictColor[sentiment.verdict]}.400`}>
            <Text color="whiteAlpha.800" fontSize="sm" lineHeight="tall">{sentiment.summary}</Text>
          </Box>
          <HStack align="flex-start" spacing={4} flexWrap="wrap">
            {sentiment.signals.positive?.length > 0 && (
              <Box flex={1} minW="140px">
                <Text color="green.400" fontSize="xs" fontWeight="bold" mb={2} textTransform="uppercase">✅ Positive Signals</Text>
                <VStack align="flex-start" spacing={1}>{sentiment.signals.positive.map((s, i) => <Text key={i} color="whiteAlpha.700" fontSize="xs">• {s}</Text>)}</VStack>
              </Box>
            )}
            {sentiment.signals.negative?.length > 0 && (
              <Box flex={1} minW="140px">
                <Text color="red.400" fontSize="xs" fontWeight="bold" mb={2} textTransform="uppercase">❌ Negative Signals</Text>
                <VStack align="flex-start" spacing={1}>{sentiment.signals.negative.map((s, i) => <Text key={i} color="whiteAlpha.700" fontSize="xs">• {s}</Text>)}</VStack>
              </Box>
            )}
            {sentiment.signals.neutral?.length > 0 && (
              <Box flex={1} minW="140px">
                <Text color="yellow.400" fontSize="xs" fontWeight="bold" mb={2} textTransform="uppercase">⚖️ Neutral Signals</Text>
                <VStack align="flex-start" spacing={1}>{sentiment.signals.neutral.map((s, i) => <Text key={i} color="whiteAlpha.700" fontSize="xs">• {s}</Text>)}</VStack>
              </Box>
            )}
          </HStack>
          <Text color="whiteAlpha.400" fontSize="2xs" textAlign="center" mt={2}>⚠️ This analysis is for informational purposes only. Not financial advice.</Text>
        </VStack>
      )}
    </Box>
  );
};

export default SentimentAnalysis;