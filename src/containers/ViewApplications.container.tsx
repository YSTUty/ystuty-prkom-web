import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import store2 from 'store2';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

import * as envUtils from '../utils/env.utils';
import { AbiturientCachedInfo } from '../interfaces/prkom.interface';

import AbiturientList from '../components/AbiturientList.component';

const ViewApplications = () => {
  const { fileName } = useParams();
  const STORE_CACHED_KEY = `ABIT_INFO_${fileName!.toUpperCase()}`;

  const [listData, setListData] = React.useState<AbiturientCachedInfo>();
  const [fetching, setFetching] = React.useState(false);
  const [isCached, setIsCached] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string>();

  const applyListData = React.useCallback(
    (info: AbiturientCachedInfo | null) => {
      if (!info) {
        info = store2.get(STORE_CACHED_KEY, null);
        if (!info) {
          return;
        }
        setIsCached(true);
      } else if (info.response.list.length > 0) {
        store2.set(STORE_CACHED_KEY, info);
        setIsCached(false);
      }

      setListData(info);
    },
    [setListData, setIsCached],
  );

  const fetchListData = React.useCallback(
    (fileName: string) => {
      if (fetching) {
        return;
      }

      setFetching(true);

      fetch(`${envUtils.apiPath}/v1/admission/full_list?original=true&filename=${fileName}`)
        .then((response) => response.json())
        .then(
          (
            response:
              | ({ filename: string } & AbiturientCachedInfo)
              | { error: { code: number; error: string; message: string } },
          ) => {
            console.log('response [admission/full_list]', response);

            if ('error' in response) {
              if (response.error.code === 404) {
                setErrorMsg('Not found. [404]');
                return;
              }
              alert(response.error.message);
              console.error(response.error);
              return;
            }

            applyListData(response || null);
          },
        )
        .catch((e) => {
          applyListData(null);
        })
        .finally(() => {
          setFetching(false);
        });
    },
    [fetching, setFetching, applyListData, setErrorMsg],
  );

  React.useEffect(() => {
    fetchListData(fileName!);
  }, [fileName]);

  if (!listData?.response) {
    return (
      <Box component="main" sx={{ mt: 4, mb: 4 }}>
        <Button component={Link} to="/">
          ← <FormattedMessage id="page.incomings.list.backHere" />
        </Button>

        <Container sx={{ width: '100%', pt: 5 }}>
          {errorMsg ? (
            <Typography>{errorMsg}</Typography>
          ) : (
            <>
              <Typography>Loading...</Typography>
              <LinearProgress color="secondary" />
            </>
          )}
        </Container>
      </Box>
    );
  }

  const { response } = listData;

  return (
    <Box component="main" sx={{ mt: 4, mb: 4 }}>
      <Container component="main" sx={{ mb: 2 }}>
        <Button component={Link} to="/">
          ← <FormattedMessage id="page.incomings.list.backHere" />
        </Button>

        <Paper sx={{ my: { xs: 3, md: 4 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h6" align="center" pb={3}>
            <FormattedMessage id="page.abiturient.list.competitionGroupName" />: {response.info.competitionGroupName}
          </Typography>

          {response.originalInfo && (
            <>
              <Typography>{response.originalInfo.buildDate}</Typography>
              <Typography>{response.originalInfo.prkomDate}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>{response.originalInfo.competitionGroupName}</Typography>
              <Typography>{response.originalInfo.formTraining}</Typography>
              <Typography>{response.originalInfo.levelTraining}</Typography>
              <Typography>{response.originalInfo.directionTraining}</Typography>
              <Typography>{response.originalInfo.basisAdmission}</Typography>
              <Typography>{response.originalInfo.sourceFunding}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>{response.originalInfo.numbersInfo}</Typography>
            </>
          )}
        </Paper>
      </Container>

      <AbiturientList list={response.list} titles={response.titles} />
    </Box>
  );
};

export default ViewApplications;
