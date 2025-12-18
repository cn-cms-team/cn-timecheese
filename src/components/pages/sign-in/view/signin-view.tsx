import SignInForm from '../signin-form';
import SignInBanner from '../signin-banner';
import { Card, CardContent } from '@/components/ui/card';

const SigninInView = () => {
  return (
    <div className="flex m-auto h-full w-full">
      <Card className="m-auto justify-center p-0 min-w-[400px] h-[500px] md:min-h-11/12">
        <CardContent className="flex h-full w-full xl:w-screen  max-w-6xl p-0">
          <div className="relative justify-center w-3/5 hidden md:flex after:content-[''] after:h-full after:w-0.5 after:bg-gray-200 after:absolute after:right-0 after:top-0">
            <SignInBanner className="flex max-h-3/4 my-auto max-w-11/12 w-full" />
          </div>
          <div className="w-full md:w-2/5 my-auto">
            <SignInForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SigninInView;
