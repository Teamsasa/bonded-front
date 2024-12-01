import React from 'react';

const Home: React.FC = () => {
  const loginUrl = import.meta.env.VITE_COGNITO_LOGIN_URL;
  return (
    <div>
      <a href={loginUrl}>
        <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
          ログイン
        </button>
      </a>
    </div>
  );
};

export default Home;
