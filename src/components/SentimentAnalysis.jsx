import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Badge,
  Spinner,
  Divider,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  Icon,
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiRefreshCw } from 'react-icons/fi';

const SentimentAnalysis = ({ coin, currency }) => {
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSentiment = async () => {
    setLoading(true);
    setError(null);
    setSentiment(null);

    const marketData = coin.market_data;
    const prompt = `You are a professional crypto market analyst. Analyze the following market data for ${coin.name} (${coin.symbol?.toUpperCase()}) and provide a sentiment analysis.

Market Data:
- Current Price (USD): $${marketData.current_price?.usd}
- 24h Price Change: ${marketData.price_change_percentage_24h?.toFixed(2)}%
- 7d Price Change: ${marketData.price_change_percentage_7d?.toFixed(2)}%
- 30d Price Change: ${marketData.price_change_percentage_30d?.toFixed(2)}%
- Market Cap Rank: #${coin.market_cap_rank}
- Market Cap (USD): $${marketData.market_cap?.usd?.toLocaleString()}
- All Time High (USD): $${marketData.ath?.usd}
- % from ATH: ${marketData.ath_change_percentage?.usd?.toFixed(2)}%
- All Time Low (USD): $${marketData.atl?.usd}
- % from ATL: ${marketData.atl_change_percentage?.usd?.toFixed(2)}%
- Circulating Supply: ${marketData.circulating_supply?.toLocaleString()}
- Max Supply: ${marketData.max_supply ? marketData.max_supply.toLocaleString() : 'Unlimited'}
- 24h Trading Volume (USD): $${marketData.total_volume?.usd?.toLocaleString()}
- Community Score: ${coin.community_score ?? 'N/A'}
- Developer Score: ${coin.developer_score ?? 'N/A'}

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "verdict": "Bullish" | "Bearish" | "Neutral",
  "score": <number from 0 to 100 where 0=extremely bearish, 50=neutral, 100=extremely bullish>,
  "summary": "<2-3 sentence plain-English summary of the sentiment>",
  "signals": {
    "positive": ["<signal 1>", "<signal 2>"],
    "negative": ["<signal 1>", "<signal 2>"],
    "neutral": ["<signal 1>"]
  },
  "risk": "Low" | "Medium" | "High"
}`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const rawText = data.content?.map((b) => b.text || '').join('');
      const clean = rawText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setSentiment(parsed);
    } catch (err) {
      setError('Failed to analyze sentiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coin?.market_data) fetchSentiment();
  }, [coin?.id]);

  const verdictColor = {
    Bullish: 'green',
    Bearish: 'red',
    Neutral: 'yellow',
  };

  const riskColor = {
    Low: 'green',
    Medium: 'orange',
    High: 'red',
  };

  const VerdictIcon = {
    Bullish: FiTrendingUp,
    Bearish: FiTrendingDown,
    Neutral: FiMinus,
  };

  const scoreColor = (score) => {
    if (score >= 65) return 'green.400';
    if (score <= 35) return 'red.400';
    return 'yellow.400';
  };

  return (
    <Box
      w="full"
      mt={8}
      p={6}
      bgGradient="linear(to-br, gray.900, blackAlpha.900)"
      borderRadius="xl"
      borderWidth={1}
      borderColor="whiteAlpha.200"
    >
      <HStack justify="space-between" mb={4} flexWrap="wrap" gap={2}>
        <Heading size="md" color="whiteAlpha.900" letterSpacing="wide">
          🧠 AI Sentiment Analysis
        </Heading>
        <Button
          size="sm"
          leftIcon={<FiRefreshCw />}
          colorScheme="teal"
          variant="outline"
          onClick={fetchSentiment}
          isLoading={loading}
          loadingText="Analyzing..."
        >
          Refresh
        </Button>
      </HStack>

      <Divider borderColor="whiteAlpha.200" mb={5} />

      {loading && (
        <VStack py={8} spacing={3}>
          <Spinner size="xl" color="teal.400" thickness="4px" />
          <Text color="whiteAlpha.600" fontSize="sm">
            Claude is analyzing {coin.name} market data…
          </Text>
        </VStack>
      )}

      {error && (
        <Text color="red.400" textAlign="center" py={4}>
          {error}
        </Text>
      )}

      {sentiment && !loading && (
        <VStack spacing={5} align="stretch">
          {/* Score + Verdict Row */}
          <HStack spacing={6} justify="center" flexWrap="wrap" gap={4}>
            <CircularProgress
              value={sentiment.score}
              color={scoreColor(sentiment.score)}
              trackColor="whiteAlpha.100"
              size="100px"
              thickness="10px"
            >
              <CircularProgressLabel color="whiteAlpha.900" fontSize="lg" fontWeight="bold">
                {sentiment.score}
              </CircularProgressLabel>
            </CircularProgress>

            <VStack align="flex-start" spacing={2}>
              <HStack>
                <Icon
                  as={VerdictIcon[sentiment.verdict]}
                  color={`${verdictColor[sentiment.verdict]}.400`}
                  boxSize={6}
                />
                <Badge
                  fontSize="lg"
                  px={3}
                  py={1}
                  borderRadius="md"
                  colorScheme={verdictColor[sentiment.verdict]}
                >
                  {sentiment.verdict}
                </Badge>
              </HStack>
              <HStack>
                <Text color="whiteAlpha.600" fontSize="sm">
                  Risk Level:
                </Text>
                <Badge colorScheme={riskColor[sentiment.risk]} fontSize="sm">
                  {sentiment.risk}
                </Badge>
              </HStack>
            </VStack>
          </HStack>

          {/* Summary */}
          <Box
            bg="whiteAlpha.50"
            borderRadius="md"
            p={4}
            borderLeft="3px solid"
            borderColor={`${verdictColor[sentiment.verdict]}.400`}
          >
            <Text color="whiteAlpha.800" fontSize="sm" lineHeight="tall">
              {sentiment.summary}
            </Text>
          </Box>

          {/* Signals */}
          <HStack align="flex-start" spacing={4} flexWrap="wrap">
            {sentiment.signals.positive?.length > 0 && (
              <Box flex={1} minW="140px">
                <Text color="green.400" fontSize="xs" fontWeight="bold" mb={2} textTransform="uppercase" letterSpacing="wider">
                  ✅ Positive Signals
                </Text>
                <VStack align="flex-start" spacing={1}>
                  {sentiment.signals.positive.map((s, i) => (
                    <Text key={i} color="whiteAlpha.700" fontSize="xs">
                      • {s}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}

            {sentiment.signals.negative?.length > 0 && (
              <Box flex={1} minW="140px">
                <Text color="red.400" fontSize="xs" fontWeight="bold" mb={2} textTransform="uppercase" letterSpacing="wider">
                  ❌ Negative Signals
                </Text>
                <VStack align="flex-start" spacing={1}>
                  {sentiment.signals.negative.map((s, i) => (
                    <Text key={i} color="whiteAlpha.700" fontSize="xs">
                      • {s}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}

            {sentiment.signals.neutral?.length > 0 && (
              <Box flex={1} minW="140px">
                <Text color="yellow.400" fontSize="xs" fontWeight="bold" mb={2} textTransform="uppercase" letterSpacing="wider">
                  ⚖️ Neutral Signals
                </Text>
                <VStack align="flex-start" spacing={1}>
                  {sentiment.signals.neutral.map((s, i) => (
                    <Text key={i} color="whiteAlpha.700" fontSize="xs">
                      • {s}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}
          </HStack>

          <Text color="whiteAlpha.400" fontSize="2xs" textAlign="center" mt={2}>
            ⚠️ This is AI-generated analysis for informational purposes only. Not financial advice.
          </Text>
        </VStack>
      )}
    </Box>
  );
};

export default SentimentAnalysis;
