import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';

const trendingTopics = [
  {
    id: '1',
    topic: 'Tech',
    hashtag: '#technology',
    tweets: '120K',
  },
  {
    id: '2',
    topic: 'Sports',
    hashtag: '#sports',
    tweets: '80K',
  },
  {
    id: '3',
    topic: 'Entertainment',
    hashtag: '#entertainment',
    tweets: '150K',
  },
];

export function TrendingTopics() {
  return (
    <Card className="border rounded-2xl gap-3">
      <CardHeader className="px-4">
        <CardTitle className="text-xl font-bold">Trends for you</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {trendingTopics.map((trend) => (
          <div key={trend.id} className="mb-3 last:mb-0">
            <p className="text-xs">{trend.topic}</p>
            <p className="font-medium">{trend.hashtag}</p>
            <p className="text-xs text-muted-foreground">
              {trend.tweets} Tweets
            </p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="px-4">
        <Link href="#" className="text-sm text-sky-400 hover:underline">
          Show more
        </Link>
      </CardFooter>
    </Card>
  );
}
