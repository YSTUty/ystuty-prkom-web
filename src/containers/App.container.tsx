import { useIntl } from 'react-intl';

import VersionComponent from '../components/Version.component';

function App() {
  const { formatMessage } = useIntl();

  return (
    <section>
      <h2>{formatMessage({ id: 'page.main.title' })}</h2>
      <div>App content</div>
      <hr />
      <VersionComponent />
    </section>
  );
}

export default App;

