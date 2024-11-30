import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignInOptions from '../components/sign-in-options';

export default function LoginPage(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[380px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">
            Welcome to SimpleTimes
          </CardTitle>
          <CardDescription className="text-center">
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SignInOptions />
        </CardContent>
      </Card>
    </div>
  );
}
