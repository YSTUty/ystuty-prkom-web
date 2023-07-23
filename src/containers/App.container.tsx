import { Route, Routes } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import GitHubIcon from '@mui/icons-material/GitHub';
import YstuPrkomIcon from '@mui/icons-material/List';

import * as envUtils from '../utils/env.utils';

import { ThemeModeButton } from '../providers/ThemeMode.provider';
import MainPageContainer from './MainPage.container';
import ViewApplicationsContainer from './ViewApplications.container';
import ViewUserApplicationsContainer from './ViewUserApplications.container';

import VersionComponent from '../components/Version.component';
import UserUidField from '../components/UserUidField.component';
import ScrollToTop from '../components/ScrollToTop.component';

const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 1 }}>
      {'Copyright © '}
      2018-{new Date().getFullYear()}{' '}
      {envUtils.linkYSTUty ? (
        <Link href={envUtils.linkYSTUty} color="inherit">
          YSTUty
        </Link>
      ) : (
        'YSTUty'
      )}
      {'.'}
      {envUtils.linkToGitHub && (
        <Link href={envUtils.linkToGitHub} target="_blank" color="inherit" sx={{ ml: 1 }}>
          <GitHubIcon fontSize="small" />
        </Link>
      )}
      <br />
      <VersionComponent />
    </Typography>
  );
};

const App = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollTrigger = useScrollTrigger({ target: window });

  return (
    <>
      <Slide appear={false} direction="down" in={!scrollTrigger}>
        <AppBar
          position="sticky"
          color="default"
          elevation={4}
          sx={{
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Toolbar variant="dense" sx={{ px: { xs: 1, sm: 3 } }}>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              sx={(theme) => ({
                mr: { xs: 1, sm: 2 },
                fontSize: { xs: 14, sm: theme.typography.h6.fontSize },
                minWidth: 95,
              })}
            >
              {!isSmallScreen ? (
                <>
                  [YSTUty] <FormattedMessage id="page.main.title" />
                </>
              ) : (
                <FormattedMessage id="page.main.title.short" />
              )}
            </Typography>
            <Divider orientation="vertical" flexItem />

            <UserUidField />

            <Typography sx={{ flex: 1 }}></Typography>
            <Divider orientation="vertical" flexItem />

            {envUtils.linkToYstuPrkom && !isSmallScreen && (
              <FormControl sx={{ px: 0.5 }}>
                <IconButton
                  size="small"
                  component="a"
                  color="secondary"
                  href={envUtils.linkToYstuPrkom}
                  title={formatMessage({ id: 'common.button.viewOriginalList' })}
                >
                  <YstuPrkomIcon />
                </IconButton>
              </FormControl>
            )}
            <Divider orientation="vertical" flexItem />
            <FormControl size="small" sx={{ pl: 1 }}>
              <ThemeModeButton />
            </FormControl>
          </Toolbar>
        </AppBar>
      </Slide>
      <Box id="back-to-top-anchor" />
      <Container component="main" maxWidth={false} sx={{ mb: 4, px: { xs: 1, sm: 3 } }}>
        <Routes>
          <Route path="/" element={<MainPageContainer />} />
          <Route path="/view/:fileName" element={<ViewApplicationsContainer />} />
          <Route path="/user/:userUid" element={<ViewUserApplicationsContainer />} />
          {/* <Route path="about" element={<About />} /> */}
        </Routes>
        <Copyright />
      </Container>
      <ScrollToTop />
    </>
  );
};

export default App;
