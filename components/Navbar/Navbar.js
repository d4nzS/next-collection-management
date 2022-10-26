import { useState } from 'react';
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
  Typography
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: 0,
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('xs')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const NavBar = () => {
  const { data: session } = useSession();
  const router = useRouter();

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
        <Container maxWidth="xl" sx={{pl: 0, pr: 0}}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ mr: 2, cursor: 'pointer' }}
              onClick={() => linkHandler('/')}
            >
              CM
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon/>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }}/>
            {session ? userManagement : authButtons}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default NavBar;