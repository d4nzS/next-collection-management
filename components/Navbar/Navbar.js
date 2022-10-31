import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { ColorModeContext } from '../../store/ColorModeProvider';

const NavBar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const theme = useTheme();
  const colorModeCtx = useContext(ColorModeContext);

  const [anchorElUser, setAnchorElUser] = useState(null);

  if (session === undefined) {
    return;
  }

  const openUserMenuHandler = event => {
    setAnchorElUser(event.currentTarget);
  };

  const closeUserMenuHandler = () => {
    setAnchorElUser(null);
  };

  const linkHandler = link => {
    router.push(link);

    setAnchorElUser(null);
  };

  const signOutHandler = () => {
    signOut();
  };

  const authButtons = (
    <>
      <Button color="inherit" onClick={() => linkHandler('/login')}>Sign in</Button>
      <Button color="inherit" onClick={() => linkHandler('/signup')}>Sign up</Button>
    </>
  );

  const userManagement = (
    <Box sx={{ flexGrow: 0, ml: 2 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={openUserMenuHandler} sx={{ p: 0 }}>
          <Avatar/>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={closeUserMenuHandler}
      >
        <MenuItem onClick={() => linkHandler(`/${session?.user.id}`)}>
          <Typography textAlign="center">{session?.user.email}</Typography>
        </MenuItem>
        <MenuItem onClick={signOutHandler}>
          <Typography textAlign="center">Sign out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="xl" sx={{ pl: 0, pr: 0 }}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ mr: 1, cursor: 'pointer' }}
              onClick={() => linkHandler('/')}
            >
              CM
            </Typography>
            <IconButton color="inherit" onClick={colorModeCtx.toggleColorMode}>
              {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
            </IconButton>
            <Box sx={{ flexGrow: 1 }}/>
            {session ? userManagement : authButtons}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default NavBar;