import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import store2 from 'store2';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import LinearProgress from '@mui/material/LinearProgress';

import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AdditionalShowIcon from '@mui/icons-material/Shower';
import AdditionalHideIcon from '@mui/icons-material/ShowerOutlined';
import CloseIcon from '@mui/icons-material/Close';

import appSlice from '../store/reducer/app.slice';
import * as envUtils from '../utils/env.utils';
import * as otherUtils from '../utils/other.util';
import { AbiturientInfoResponse, LevelTrainingType } from '../interfaces/prkom.interface';
import { RootState } from '../store';

import AbiturientList from '../components/AbiturientList.component';
import TelegramButton from '../components/TelegramButton.component';
import AbiturientListCombined from '../components/AbiturientListCombined.component';

const ViewUserApplications = () => {
  const { userUid: userUid_ } = useParams();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const {
    userUid: queryUserUid,
    showUserInfoMessage,
    showPositions,
  } = useSelector<RootState, RootState['app']>((state) => state.app);
  const userUid = userUid_?.replace(/_/, ' ') || '';
  const uidNumber = userUid.replace(/[^0-9]+/g, '');

  const STORE_CACHED_KEY = `ABIT_INFO_USER_${userUid}`;

  const [listData, setListData] = React.useState<AbiturientInfoResponse[]>([]);
  const [fetching, setFetching] = React.useState(false);
  const [isCached, setIsCached] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>();
  const [formatedUid, setFormatedUid] = React.useState<string>();

  const applyListData = React.useCallback(
    (info: AbiturientInfoResponse[] | null) => {
      if (!info) {
        info = store2.get(STORE_CACHED_KEY, null);
        if (!info) {
          setErrorMsg(formatMessage({ id: 'page.user.emptyData' }));
          return;
        }
        setIsCached(true);
      } else if (info.length > 0) {
        store2.set(STORE_CACHED_KEY, info);
        setIsCached(false);
      } else {
        setErrorMsg(formatMessage({ id: 'page.user.emptyData' }));
      }

      setListData(info);
    },
    [setListData, setIsCached],
  );

  const fetchListData = React.useCallback(
    (userUid: string) => {
      if (!userUid || fetching) {
        return;
      }

      setFetching(true);

      fetch(`${envUtils.apiPath}/v1/admission/get/${userUid}?original=true`)
        .then((response) => response.json())
        .then((response: AbiturientInfoResponse[] | { error: { code: number; error: string; message: string } }) => {
          console.log('response [admission/get/**]', response);

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

          setErrorMsg(null);
          applyListData(response);
        })
        .catch((e) => {
          applyListData(null);
        })
        .finally(() => {
          setFetching(false);
        });
    },
    [fetching, setFetching, applyListData, setErrorMsg],
  );

  const setUserUid = React.useCallback(() => {
    dispatch(appSlice.actions.setUserUid(formatedUid || ''));
  }, [formatedUid]);

  const toggleUserInfoMessage = React.useCallback(() => {
    dispatch(appSlice.actions.toggleUserInfoMessage());
  }, []);

  const toggleShowPositions = React.useCallback(() => {
    dispatch(appSlice.actions.toggleShowPositions());
  }, []);

  // * Formatting uid
  React.useEffect(() => {
    if (!uidNumber) {
      if (queryUserUid) {
        navigate(`/user/${queryUserUid}`);
        return;
      }
      setErrorMsg(`Wrong UID`);
      return;
    }

    let formatedUid = '';
    if (uidNumber.startsWith('000') || uidNumber.length < 10) {
      formatedUid = otherUtils.convertToNumericUid(uidNumber);
    } else if (!uidNumber.startsWith('0000') && uidNumber.length > 10) {
      try {
        otherUtils.validateSnils(uidNumber);
        formatedUid = otherUtils.convertToSnilsUid(uidNumber);
      } catch (err) {
        setErrorMsg(`Wrong UID: ${(err as Error).message}`);
        return;
      }
    }

    setFormatedUid(formatedUid);
  }, [queryUserUid, uidNumber, navigate, setErrorMsg]);

  React.useEffect(() => {
    fetchListData(formatedUid!);
  }, [formatedUid]);

  const levelTrainingArr = Array.from(new Set(listData.map((e) => e.info.levelTraining)));

  if (listData.length === 0) {
    return (
      <Box component="main" sx={{ mt: 4, mb: 4 }}>
        <Button component={Link} to="/">
          ← <FormattedMessage id="page.incomings.list.backHere" />
        </Button>

        <Container sx={{ width: '100%', pt: 5 }}>
          {errorMsg ? (
            <Paper elevation={3} sx={{ mt: 2, py: 2, textAlign: 'center' }}>
              <Typography color={(theme) => theme.palette.warning.main}>{errorMsg}</Typography>
              <IconButton onClick={() => fetchListData(formatedUid!)} disabled={fetching}>
                <RefreshIcon />
              </IconButton>
            </Paper>
          ) : fetching ? (
            <>
              <Typography>
                <FormattedMessage id="badges.loading" />
              </Typography>
              <LinearProgress color="secondary" />
            </>
          ) : (
            <Typography>Empty data</Typography>
          )}
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ mt: 4, mb: 4 }}>
      <Container component="main" sx={{ mb: 2 }}>
        <Button component={Link} to="/">
          ← <FormattedMessage id="page.incomings.list.backHere" />
        </Button>
      </Container>

      <Paper sx={{ my: { xs: 1, md: 2 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h6" align="center">
          <FormattedMessage id="page.user.userUid.info" />:{' '}
          <Button sx={(theme) => ({ color: theme.palette.secondary.main })} component="span" onClick={setUserUid}>
            {formatedUid}
          </Button>
        </Typography>
        <Typography align="center" py={1}>
          <TelegramButton uid={formatedUid} showText variant="contained" />
        </Typography>
        <Typography align="center">
          <FormattedMessage id="page.user.userUid.appCount" values={{ count: listData.length }} />
          {isCached && (
            <Typography component={'span'} fontSize={9} sx={{ px: 1 }}>
              cache
            </Typography>
          )}
        </Typography>
        <Typography align="center">
          <FormattedMessage id="page.abiturient.list.table.header.levelTraining" />:
          <Typography component={'span'} sx={{ px: 1 }}>
            {levelTrainingArr.map((e) => formatMessage({ id: `LevelTrainingType.${LevelTrainingType[e]}` })).join('/')}
          </Typography>
        </Typography>
        <IconButton aria-label="expand row" size="small" onClick={() => toggleUserInfoMessage()}>
          {showUserInfoMessage ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <IconButton aria-label="expand row" size="small" onClick={() => toggleShowPositions()}>
          {showPositions ? <AdditionalShowIcon /> : <AdditionalHideIcon />}
        </IconButton>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Collapse in={showUserInfoMessage} timeout="auto" unmountOnExit>
          <Paper elevation={5} sx={{ my: { xs: 2, md: 3 }, p: 3, minWidth: '40vw' }}>
            <IconButton size="small" onClick={() => toggleUserInfoMessage()}>
              <CloseIcon />
            </IconButton>
            {[1, 2, 3, 4, 5].map((num) => (
              <Typography
                component="p"
                variant={num == 1 ? 'body1' : 'body2'}
                sx={(theme) => ({
                  ...(num == 1 && { color: theme.palette.info.main }),
                  ...(num == 5 && { color: theme.palette.success.main }),
                })}
                py={1}
                key={num}
              >
                <FormattedMessage id={`page.user.infoMessage.${num}`} />
              </Typography>
            ))}
          </Paper>
        </Collapse>
      </Box>

      {listData.length > 1 ? (
        <Paper sx={{ mt: 3, p: 1 }}>
          <AbiturientListCombined listData={listData} showPositions={showPositions} />
        </Paper>
      ) : (
        listData.map((response) => (
          <Paper key={response.filename} sx={{ mt: 3, p: 1 }}>
            <Container component="main" sx={{ mt: 2 }}>
              <Paper elevation={2} sx={{ my: 2, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h6" align="center" pb={3}>
                  <FormattedMessage id="page.abiturient.list.competitionGroupName" />:{' '}
                  {response.info.competitionGroupName}
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

                <Divider sx={{ my: 1 }} />
                <Button component={Link} to={`/view/${response.filename}`}>
                  <FormattedMessage id="page.user.list.viewFull" />
                </Button>
              </Paper>
            </Container>
            <AbiturientList list={[response.item]} isPersonal />
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ViewUserApplications;
