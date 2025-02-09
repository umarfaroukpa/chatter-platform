import '../styles/globals.css';
import { AppProps } from 'next/app';
import MetaHead from 'components/MetaHeader';

import Header from '../components/Header';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <MetaHead />
            <Header />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
