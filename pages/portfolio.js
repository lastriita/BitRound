import React, { Component } from "react";
import Layout from "../components/Layout";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../components/theme.js";
import theme2 from "../components/theme2.js";
import { Typography, Tabs, Tab, Box } from "@mui/material";
import Header from "../components/Header";
import { Container } from "semantic-ui-react";

class Portfolio extends Component {
  constructor() {
    super();
    this.state = {
      tabValue: 0,
    };
  }

  handleChange(event, newValue) {
    this.setState({ tabValue: newValue });
  }

  render() {
    const { tabValue } = this.state;

    const TabPanel = (props) => {
      const { children, value, index } = props;
      return (
        <div role="tabpanel" hidden={value !== index}>
          {value === index && <Box>{children}</Box>}
        </div>
      );
    };

    return (
      <ThemeProvider theme={theme}>
        <Layout>
          <Container>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemeProvider theme={theme2}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  style={{ marginBottom: "1rem" }}
                >
                  Portfolio
                </Typography>
              </ThemeProvider>
            </div>
            
            <Tabs
              value={tabValue}
              onChange={(event, newValue) => this.handleChange(event, newValue)}
            >
              <Tab label="Invested Bitrounds" />
              <Tab label="Created Bitrounds" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              {/* Render invested bitrounds */}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Header />
            </TabPanel>
          </Container>
        </Layout>
      </ThemeProvider>
    );
  }
}

export default Portfolio;
