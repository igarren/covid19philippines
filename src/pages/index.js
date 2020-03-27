import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import axios from 'axios';
import Layout from "../components/layout"
import SEO from "../components/seo"
import * as ENDPOINT from '../../const'
import { Grid, Loader, Table, Divider } from 'semantic-ui-react'
import classes from '../styles/styles.module.scss';

const loader = <Loader active inline />;
const IndexPage = () => {


  const [dashboard, setDashboard] = useState({
    confirmed: 0,
    deaths: 0,
    puis: 0,
    pums: 0,
    tests: 0,
    recovered: 0,
  });
  const [cityData, setCityData] = useState([]);

  const [cityLoading, setCityLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    const fethchDashboard = async () => {

      const confirmed = axios.get(ENDPOINT.GET_COMMON_CONST_ENDPOINT('confirmed'));
      const deaths = axios.get(ENDPOINT.GET_COMMON_CONST_ENDPOINT('deaths'));
      const puis = axios.get(ENDPOINT.GET_COMMON_CONST_ENDPOINT('PUMs'));
      const pums = axios.get(ENDPOINT.GET_COMMON_CONST_ENDPOINT('PUIs'));
      const tests = axios.get(ENDPOINT.GET_COMMON_CONST_ENDPOINT('tests'));
      const recovered = axios.get(ENDPOINT.GET_COMMON_CONST_ENDPOINT('recovered'));

      axios.all(
        [confirmed,
          deaths,
          puis,
          pums,
          tests,
          recovered
        ])
        .then(axios.spread((...responses) => {
          const respConfirm = Object.assign(...responses[0].data.features)
          const respDeath = Object.assign(...responses[1].data.features)
          const respPUI = Object.assign(...responses[2].data.features)
          const respPUM = Object.assign(...responses[3].data.features)
          const respTests = Object.assign(...responses[4].data.features)
          const respRecovered = Object.assign(...responses[5].data.features)
          setDashboard({
            ...dashboard,
            confirmed: respConfirm.attributes.value,
            deaths: respDeath.attributes.value,
            puis: respPUI.attributes.value,
            pums: respPUM.attributes.value,
            tests: respTests.attributes.value,
            recovered: respRecovered.attributes.value,
          })

          setDashboardLoading(false);
          // use/access the results 
        })).catch(errors => {
          // react on errors.
        })

    };
    const fetchDataByCity = async () => {

      const cityData = await axios.get(ENDPOINT.BY_CITY_ENDPOINT);
      const respCity = cityData.data.features;
      setCityData(respCity)
      setCityLoading(false);
    };
    fethchDashboard();
    fetchDataByCity();
  }, []);

  let byCityData = cityLoading ? loader : (
    <Table singleLine >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>City</Table.HeaderCell>
          <Table.HeaderCell>Number of Cases</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {cityData.map((city, i) => (
          <Table.Row key={i}>
            <Table.Cell>{city.attributes.residence}</Table.Cell>
            <Table.Cell>{city.attributes.value}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );

  return (
    <Layout>
      <SEO title="Home" />
      <Loader content='Loading' />
      <Grid className={classes.Dashboard} textAlign='center' columns={3} >
        <Grid.Row>
          <Grid.Column>

            <h2 className={classes.Confirmed}>{dashboardLoading ? loader : dashboard.confirmed}</h2>
            <p>Confirmed</p>
          </Grid.Column>
          <Grid.Column>
            <h2 className={classes.Deaths}>{dashboardLoading ? loader : dashboard.deaths}</h2>
            <p>Deaths</p>
          </Grid.Column>
          <Grid.Column>
            <h2 className={classes.Recovered}>{dashboardLoading ? loader : dashboard.recovered}</h2>
            <p>Recovered</p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <h2>{dashboardLoading ? loader : dashboard.tests}</h2>
            <p>Tests Conducted</p>
          </Grid.Column>
          <Grid.Column>
            <h2>{dashboardLoading ? loader : dashboard.puis}</h2>
            <p>Person under investigation</p>
          </Grid.Column>

          <Grid.Column>
            <h2>{dashboardLoading ? loader : dashboard.pums}</h2>
            <p>Person under monitoring</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div className={classes.CityData}>
      <h2>Location Breakdown</h2>
      {byCityData}
      </div>
      
    </Layout>
  )
}

export default IndexPage
