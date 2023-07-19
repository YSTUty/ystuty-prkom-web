import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import store2 from 'store2';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import * as envUtils from '../utils/env.utils';
import { IncomingsLink } from '../interfaces/prkom.interface';

import IncomingsLinkList from '../components/IncomingsLinkList.component';

const STORE_CACHED_FULL_LIST_KEY = 'CACHED_FULL_LIST';

const MainPage = () => {
  const [listData, setListData] = React.useState<IncomingsLink[]>([]);
  const [fetching, setFetching] = React.useState(false);
  const [isCached, setIsCached] = React.useState(false);

  const applyListData = React.useCallback(
    (items: IncomingsLink[] | null) => {
      if (!items) {
        items = store2.get(STORE_CACHED_FULL_LIST_KEY, null);
        if (!items) {
          return;
        }
        setIsCached(true);
      } else if (items.length > 0) {
        store2.set(STORE_CACHED_FULL_LIST_KEY, items);
        setIsCached(false);
      }

      setListData(items);
    },
    [setListData, setIsCached],
  );

  const fetchListData = React.useCallback(() => {
    if (fetching) {
      return;
    }

    setFetching(true);

    fetch(`${envUtils.apiPath}/v1/admission/incomings_list`)
      .then((response) => response.json())
      .then((response: IncomingsLink[] | { error: { error: string; message: string } }) => {
        if ('error' in response) {
          alert(response.error.message);
          console.error(response.error);
          return;
        }
        applyListData(response);
      })
      .catch((e) => {
        applyListData(null);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [fetching, setFetching, applyListData]);

  React.useEffect(() => {
    if (Math.random() > 0.6) {
      const items = store2.get(STORE_CACHED_FULL_LIST_KEY, null) as any[];
      if (items?.length > 0) {
        applyListData(null);
        return;
      }
    }
    fetchListData();
  }, []);

  return (
    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
      <Typography component="h1" variant="h4" align="center">
        <FormattedMessage id="page.main.title" />
        {isCached && (
          <Typography component={'span'} fontSize={9}>
            cache
          </Typography>
        )}
      </Typography>

      {listData.length === 0 ? (
        <>
          <Typography>Loading...</Typography>
          <LinearProgress color="secondary" />
        </>
      ) : (
        <IncomingsLinkList list={listData} />
      )}
    </Paper>
  );
};

export default MainPage;
