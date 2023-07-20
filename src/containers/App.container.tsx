import { Route, Routes } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';

import GitHubIcon from '@mui/icons-material/GitHub';

import * as envUtils from '../utils/env.utils';

import { ThemeModeButton } from '../providers/ThemeMode.provider';
import MainPageContainer from './MainPage.container';
import ViewApplicationsContainer from './ViewApplications.container';

import VersionComponent from '../components/Version.component';
import UserUidField from '../components/UserUidField.component';
import ViewUserApplicationsContainer from './ViewUserApplications.container';

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
  return (
    <>
      <AppBar
        position="absolute"
        color="default"
        elevation={4}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap sx={{ mr: 2 }}>
            [YSTUty] <FormattedMessage id="page.main.title" />
          </Typography>
          <Divider orientation="vertical" flexItem />

          <UserUidField />

          <Typography sx={{ flex: 1 }}></Typography>
          <Divider orientation="vertical" flexItem />

          <FormControl sx={{ pl: 1 }}>
            <ThemeModeButton />
          </FormControl>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xl" sx={{ mb: 4 }}>
        <Routes>
          <Route path="/" element={<MainPageContainer />} />
          <Route path="/view/:fileName" element={<ViewApplicationsContainer />} />
          <Route path="/user/:userUid" element={<ViewUserApplicationsContainer />} />
          {/* <Route path="about" element={<About />} /> */}
        </Routes>
        <Copyright />
      </Container>
    </>
  );
};

export default App;
