import { YMInitializer } from '@appigram/react-yandex-metrika';

const YandexMetrika = () => {
  const YM_ID = Number(process.env.REACT_APP_YM_ID);
  if (!YM_ID) return null;

  return (
    <>
      <YMInitializer
        accounts={[YM_ID]}
        options={{
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          trackHash: true,
        }}
        version="2"
      />
      <noscript>
        <div>
          <img src={`https://mc.yandex.ru/watch/${YM_ID}`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
        </div>
      </noscript>
    </>
  );
};
export default YandexMetrika;
