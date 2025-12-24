import SignInForm from '../signin-form';
import SignInBanner from '../signin-banner';
import { Card, CardContent } from '@/components/ui/card';

const SigninInView = () => {
  return (
    <main className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="container">
        <div className="flex gap-12">
          <div className="relative justify-center w-3/5 hidden md:flex">
            <SignInBanner className="w-full max-w-lg" />
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <Card className="w-full max-w-lg shadow-md m-4 md:m-0">
              <CardContent className="my-auto px-0 md:px-6">
                <SignInForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SigninInView;
