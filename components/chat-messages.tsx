import Markdown from 'react-markdown';
import useAutoScroll from '@/app/hooks/use-autoscroll';
import Spinner from '@/components/spinner';
// import userIcon from '@/assets/images/user.svg';
// import errorIcon from '@/assets/images/error.svg';

function ChatMessages({ 
  messages, 
  isLoading 
}: { 
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    loading?: boolean;
    error?: boolean;
  }>; 
  isLoading: boolean 
}) {
  const scrollContentRef = useAutoScroll(isLoading);
  
  return (
    <div ref={scrollContentRef}>
      {messages.map(({ role, content, loading, error }, idx) => (
        <div key={idx}>
          {/* {role === 'user' && (
            <img src={userIcon} alt='user icon' />
          )} */}
          <div>
            <div>
              {(loading && !content) ? <Spinner />
                : (role === 'assistant')
                  ? <Markdown>{content}</Markdown>
                  : <div className='inline-block bg-blue-500 px-2 py-1 rounded'>{content}</div>
              }
            </div>
            {error && (
              <div>
                {/* <img src={errorIcon} alt='error icon' /> */}
                <span>Error generating the response</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;