import * as React from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
// import store2 from 'store2';

import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import RefreshIcon from '@mui/icons-material/Refresh';

import YstuPrkomIcon from '@mui/icons-material/List';

import * as envUtils from '../utils/env.utils';
import { IncomingsLink } from '../interfaces/prkom.interface';

import IncomingsLinkList from '../components/IncomingsLinkList.component';
import UserUidField from '../components/UserUidField.component';

const STORE_CACHED_FULL_LIST_KEY = 'CACHED_FULL_LIST';

const MainPage = () => {
  const { formatMessage } = useIntl();
  const [listData, setListData] = React.useState<IncomingsLink[]>([]);
  const [fetching, setFetching] = React.useState(false);
  const [isCached, setIsCached] = React.useState(false);
  const [fetchedTime, setFetchedTime] = React.useState<number | null>();
  const [errorMsg, setErrorMsg] = React.useState<string | null>();

  const applyListData = React.useCallback(
    (items: IncomingsLink[] | null) => {
      // if (!items) {
      //   items = store2.get(STORE_CACHED_FULL_LIST_KEY, null);
      //   if (!items) {
      //     return;
      //   }
      //   setIsCached(true);
      // } else if (items.length > 0) {
      //   store2.set(STORE_CACHED_FULL_LIST_KEY, items);
      //   setIsCached(false);
      // }

      if (!items) {
        return;
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
      .then((response: IncomingsLink[] | { error: { code: number; error: string; message: string } }) => {
        if ('error' in response) {
          if (response.error.code === 404) {
            setErrorMsg(formatMessage({ id: 'response.error.code.404' }));
            return;
          }
          if (response.error.code === 400) {
            setErrorMsg(formatMessage({ id: 'response.error.code.400' }));
            return;
          }
          setErrorMsg(`Error: ${response.error.message}`);
          console.error(response.error);
          return;
        }

        setFetchedTime(Date.now());
        setErrorMsg(null);
        applyListData(response);
      })
      .catch((e) => {
        applyListData(null);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [fetching, setFetching, applyListData, setFetchedTime, setErrorMsg]);

  React.useEffect(() => {
    // if (Math.random() > 0.6) {
    //   const items = store2.get(STORE_CACHED_FULL_LIST_KEY, null) as any[];
    //   if (items?.length > 0) {
    //     applyListData(null);
    //     return;
    //   }
    // }
    fetchListData();
  }, []);

  return (
    <Container component="main" maxWidth="lg" sx={{ mb: 4, px: { xs: 1, sm: 3 } }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h5" align="center">
          <FormattedMessage id="page.main.title" />
        </Typography>

        <Typography align="center" py={1}>
          <Button
            component="a"
            href={envUtils.linkToYstuPrkom}
            size="small"
            color="inherit"
            sx={{ fontSize: 11 }}
            title={formatMessage({ id: 'common.button.viewOriginalList' })}
            endIcon={<YstuPrkomIcon />}
          >
            <FormattedMessage id="common.button.originalList" />
          </Button>
        </Typography>

        <Paper
          variant="elevation"
          elevation={4}
          sx={{
            my: 1,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Typography component="h3" variant="subtitle2" sx={{ mb: { xs: 1, md: 0 } }}>
            <FormattedMessage id="page.main.field.uid.label" />
          </Typography>
          <UserUidField />
        </Paper>

        {errorMsg ? (
          <Paper elevation={3} sx={{ mt: 2, py: 2, textAlign: 'center' }}>
            <Typography>{errorMsg}</Typography>
            <IconButton onClick={() => fetchListData()} disabled={fetching}>
              <RefreshIcon />
            </IconButton>
          </Paper>
        ) : listData.length === 0 ? (
          <>
            <Typography>
              <FormattedMessage id="badges.loading" />
            </Typography>
            <LinearProgress color="secondary" />
          </>
        ) : (
          <>
            <Typography fontSize={10}>
              <IconButton onClick={() => fetchListData()} disabled={fetching}>
                <RefreshIcon />
              </IconButton>
              {fetchedTime && (
                <FormattedDate value={fetchedTime} day="2-digit" hour="2-digit" minute="2-digit" second="2-digit" />
              )}
              {isCached && (
                <Typography component={'span'} pl={1} fontSize={9}>
                  cache
                </Typography>
              )}
            </Typography>
            <IncomingsLinkList list={listData} />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default MainPage;
