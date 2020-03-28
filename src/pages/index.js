import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import axios from 'axios';
import Layout from "../components/layout"
import SEO from "../components/seo"
import * as ENDPOINT from '../../const'
import { Grid, Loader, Table, Icon, Button, Segment } from 'semantic-ui-react'
import classes from '../styles/styles.module.scss';
import CountUp from 'react-countup';
import todo2 from '../images/corona-todo-2.png';
import todo3 from '../images/corona-todo-3.png';
import todo4 from '../images/corona-todo-4.png';
import todo1 from '../images/corona-todo-1.png';

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
      <SEO title="Home" 
        description="View the current situation of corona virus in the Philippines" />
      <div className={classes.Container}>
        <h2><img className='corona' src="https://img.icons8.com/metro/26/000000/coronavirus.png" />COVID-19 Philippines</h2>

        <Grid stackable className={classes.Dashboard} textAlign='center' columns={3} >
          <Grid.Row>
            <Grid.Column>

              <h2 className={classes.Confirmed}><Icon name='hospital outline' size='small' />{dashboardLoading ? loader : <CountUp end={dashboard.confirmed} />}</h2>
              <p>Confirmed</p>
            </Grid.Column>
            <Grid.Column>
              <h2 className={classes.Deaths}><Icon name='bed' size='small' />{dashboardLoading ? loader : <CountUp end={dashboard.deaths} />}</h2>
              <p>Deaths</p>
            </Grid.Column>
            <Grid.Column>
              <h2 className={classes.Recovered}><Icon name='medkit' size='small' />{dashboardLoading ? loader : <CountUp end={dashboard.recovered} />}</h2>
              <p>Recovered</p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <h2>{dashboardLoading ? loader : <CountUp end={dashboard.tests} />}</h2>
              <p>Tests Conducted</p>
            </Grid.Column>
            <Grid.Column>
              <h2>{dashboardLoading ? loader : <CountUp end={dashboard.puis} />}</h2>
              <p>Patients under investigation</p>
            </Grid.Column>

            <Grid.Column>
              <h2>{dashboardLoading ? loader : <CountUp end={dashboard.pums} />}</h2>
              <p>People under monitoring</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid stackable verticalAlign='middle' className={classes.Dashboard} >
          <Grid.Row>
            <Grid.Column width={12}>
              <p>DOH launched the DOH COVID-19 emergency hotlines 02-894-COVID (02-894-26843) 
                and 1555 in partnership with the National Emergency Hotline of the Department 
                of Interior and Local Government (DILG), and PLDT and its wireless subsidiary 
                Smart Communications Inc.
              
                Callers can ask questions if they suspect they are infected with COVID-19, 
                or request assistance if they have symptoms and/or known exposure to confirmed 
                cases or patients under investigation. The information collected from emergency 
                calls is transmitted to the COVID-19 Emergency Operations Center and other relevant 
                agencies for immediate facilitation and response.</p>
            </Grid.Column>
            <Grid.Column width={4}>
              <a href="tel:1555"><Button fluid primary>Smart/PLDT: 1555</Button></a>
              <br/>
              <a href="tel:894-26843"><Button fluid primary>Landline: <br/> 894-26843 </Button></a>
            </Grid.Column>

          </Grid.Row>
        </Grid>
        
        <div>
          <br/>
          <h2>Residence of confirmed cases</h2>
          {byCityData}

        </div>
        <br />
        <br/>
        <h2>How to protect yourself from Corona</h2>
        <Grid stackable textAlign='center'  columns={3} >
          <Grid.Row>
            <Grid.Column>
            <img src={todo2}/>
            </Grid.Column>
            <Grid.Column>
            <img src={todo3}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
            <img src={todo4}/>
            </Grid.Column>
            <Grid.Column>
            <img src={todo1}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>

    </Layout>
  )
}

export default IndexPage