import { isRedirectError } from 'next/dist/client/components/redirect-error';

type Options<T> = {
  actionFn: () => Promise<{ id?: string } & T>;
  successMessage?: string;
};

const ExecuteAction = async <T>({
  actionFn,
  successMessage = 'The actions was successful',
}: Options<T>): Promise<{
  id?: string;
  success: boolean;
  message: string;
  code?: string;
}> => {
  try {
    const result = await actionFn(); // Ensure actionFn resolves to an object with an optional 'id' property

    return {
      success: true,
      message: successMessage,
      ...result,
    };
  } catch (error) {
    console.error('executeAction', error);
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: 'An error has occurred during executing the action',
    };
  }
};

export { ExecuteAction };
