"use client";
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Container,
  Stack,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/navigation";

// Add icons
import FlashOnIcon from "@mui/icons-material/FlashOn";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import DevicesIcon from "@mui/icons-material/Devices";

// Add some transitions
const theme = createTheme({
  typography: {
    fontFamily: "Arial, sans-serif",
    h2: { fontWeight: "bold" },
    h5: { fontWeight: "normal" },
    body1: { color: "#555" },
  },
  palette: {
    primary: {
      main: "#1e88e5", // Blue accent
    },
    secondary: {
      main: "#f50057", // Red accent for contrast
    },
  },
  transitions: {
    duration: {
      shortest: 250,
    },
  },
});

export default function Home() {
  const router = useRouter();
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    });
    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Head>
          <meta name="description" content="create flashcards from your text" />
          <title>AI FlashCards</title>
        </Head>

        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              AI FlashCards
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Login
              </Button>
              <Button color="inherit" href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        {/* Add a welcoming hero section with background */}
        <Box
          sx={{
            textAlign: "center",
            my: 6,
            p: 4,
            background:
              "url('/path-to-background-image.jpg') center center/cover",
            borderRadius: 3,
          }}
        >
          <Typography variant="h2" gutterBottom>
            Welcome to AI FlashCards
          </Typography>
          <Typography variant="h5" gutterBottom>
            Create flashcards instantly with AI
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2, transition: "all 0.3s ease-in-out" }}
            href="/generate"
          >
            Get Started
          </Button>
        </Box>

        {/* Feature section with icons */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" gutterBottom align="center">
            Features
          </Typography>
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <FlashOnIcon fontSize="large" color="primary" />
                  <Typography variant="h6" gutterBottom>
                    Easy Text Input
                  </Typography>
                  <Typography variant="body1">
                    Simply input your text and let our software create
                    flashcards automatically.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <AccessibilityNewIcon fontSize="large" color="secondary" />
                  <Typography variant="h6" gutterBottom>
                    Smart Flashcards
                  </Typography>
                  <Typography variant="body1">
                    Generate flashcards in seconds using advanced AI technology.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <DevicesIcon fontSize="large" color="primary" />
                  <Typography variant="h6" gutterBottom>
                    Accessible Anywhere
                  </Typography>
                  <Typography variant="body1">
                    Access your flashcards from any device, anytime.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Pricing section with modern card layout */}
        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Pricing
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Basic
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $0 / month
                </Typography>
                <Typography>
                  Access basic flashcard features and limited storage.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Choose Basic
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Pro
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $10 / month
                </Typography>
                <Typography>
                  Access to unlimited flashcards, storage, and priority support.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleSubmit}
                >
                  Choose Pro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
