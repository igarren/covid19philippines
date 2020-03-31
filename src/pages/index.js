import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout";
import SEO from "../components/seo";
import * as ENDPOINT from "../../lib/const";
import { toDateString } from "../../lib/util"
import { Grid, Loader, Table, Icon, Button } from "semantic-ui-react";
import classes from "../styles/styles.module.scss";
import CountUp from "react-countup";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart ,
  Bar 
} from "recharts"


const loader = <Loader active inline />
const IndexPage = () => {
  const [dashboard, setDashboard] = useState({
    updated: null,
    confirmed: 0,
    deaths: 0,
    recovered: 0,
    activeCases: 0,
  })

  const [newData, setNewData] = useState({
    newConfirmed: 0,
    newDeaths: 0,
    newRecovered: 0,
  });

  const [cityData, setCityData] = useState([])
  const [dailyData, setDailyData] = useState([])

  const [increasePerDay, setIncreasePerDay] = useState([])

  const [cityLoading, setCityLoading] = useState(true)
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    const fethchDashboard = async () => {
      await axios
        .get(
          "https://api.coronatracker.com/v3/stats/worldometer/country?countryCode=PH"
        )
        .then(({ data }) => {
          if (data && data.length > 0) {
            const currDate = new Date();
            const lastUpdated = currDate - new Date(data[0].lastUpdated);
            let date = Math.round(lastUpdated / 60000);

            if(date > 60) {
              date =  Math.round(date / 60).toString() + ' hour(s) ago';
            } else{
              date =  date.toString() + ' minute(s) ago';
            }

            setDashboard({
              ...dashboard,
              activeCases: data[0].activeCases,
              confirmed: data[0].totalConfirmed,
              deaths: data[0].totalDeaths,
              recovered: data[0].totalRecovered,
              updated: date,
            })
          }
          setDashboardLoading(false)
        })
    }
    const fetchDaily = async () => {
      const date = new Date()
      var today = new Date();
      const lastDay = toDateString(
        new Date(date.getFullYear(), date.getMonth() + 1, date.getDay() +1)
      )
      await axios
        .get(
          `https://api.coronatracker.com/v3/analytics/trend/country?countryCode=PH&startDate=2020-01-23&endDate=${lastDay}`
        )
        .then(({ data }) => {
          if (date && data.length > 1) {
            const reverseData = data.reverse()
            setNewData({
              ...newData,
              newDeaths:
                reverseData[0].total_deaths - reverseData[1].total_deaths,
              newConfirmed:
                reverseData[0].total_confirmed - reverseData[1].total_confirmed,
              newRecovered:
                reverseData[0].total_recovered - reverseData[1].total_recovered
            })

            const increasePerDay = [];
            
            let prevConfirmed  = 0;
            data.reverse().forEach((day,i) => {

              increasePerDay.push({date : day.last_updated.split('T')[0], 
                                  dailyConfirmed : day.total_confirmed - prevConfirmed});

              prevConfirmed = day.total_confirmed;

            });
            const lastFifteenDays = increasePerDay.reverse().slice(0, 15);
            setIncreasePerDay(lastFifteenDays.reverse());
          }
          setDailyData(data)
        })
    }
    const fetchDataByCity = async () => {
      await axios.get(ENDPOINT.BY_CITY_ENDPOINT).then(({ data }) => {
        setCityData(data.features)
        setCityLoading(false)
      })
    }
    fethchDashboard()
    fetchDataByCity()
    fetchDaily()
  }, [])

  let byCityData = cityLoading ? (
    loader
  ) : (
    <Table striped singleLine>
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
  )

  let newActive = newData.newConfirmed - newData.newRecovered - newData.newDeaths;

  return (
    <Layout>
      <SEO
        title="Covid 19 Tracker Philippines"
        description="Covid 19 Tracker Philippines [Coronavirus]. View the current situation of corona virus in the Philippines"
      />
      <div className={classes.Container}>
        <Grid textAlign="center" columns='equal'>
          <Grid.Row>
            <Grid.Column>
              <h2 className={classes.Title}>
                <img
                  className="corona"
                  src="https://img.icons8.com/metro/26/000000/coronavirus.png"
                />
                COVID-19  <br className={classes.Sp}/>
                Philippines Tracker
              </h2>
              <p>Last updated {dashboard.updated}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid
          doubling
          className={classes.Dashboard}
          textAlign="center"
          columns={4}
        >
          <Grid.Row>
            <Grid.Column className={classes.Confirmed}>
              <h2>
                <Icon name="hospital outline" size="small" />
                {dashboardLoading ? (
                  loader
                ) : (
                  <>
                    <CountUp end={dashboard.confirmed} />
                    <span className={classes.Addition}>
                      (+
                      <CountUp end={newData.newConfirmed} />)
                    </span>
                  </>
                )}
              </h2>
              <p>Confirmed</p>
            </Grid.Column>
            <Grid.Column className={classes.Active}>
              <h2>
                <Icon name="group" size="small" />
                {dashboardLoading ? (
                  loader
                ) : (
                  <>
                    <CountUp end={dashboard.activeCases} />
                    <span className={classes.Addition}>
                      (+
                      <CountUp end={newActive} />)
                    </span>
                  </>
                )}
              </h2>
              <p>Active</p>
            </Grid.Column>
            <Grid.Column className={classes.Deaths}>
              <h2>
                <Icon name="bed" size="small" />
                {dashboardLoading ? (
                  loader
                ) : (
                  <>
                    <CountUp end={dashboard.deaths} />
                    <span className={classes.Addition}>
                      (+
                      <CountUp end={newData.newDeaths} />)
                    </span>
                  </>
                )}
              </h2>
              <p>Deaths</p>
            </Grid.Column>
            <Grid.Column className={classes.Recovered}>
              <h2>
                <Icon name="medkit" size="small" />
                {dashboardLoading ? (
                  loader
                ) : (
                  <>
                    <CountUp end={dashboard.recovered} />
                    <span className={classes.Addition}>
                      (+
                      <CountUp end={newData.newRecovered} />)
                    </span>
                  </>
                )}
              </h2>
              <p>Recovered</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className={classes.Chart}>
          <h3>Outbreak Trend</h3>
          <ResponsiveContainer>
            <AreaChart
              width={500}
              height={400}
              data={dailyData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={"last_updated"}
                tickFormatter={tick => {
                  const holder = tick.split("T")[0].split('-');
                  return holder[1] + '/' + holder[2];
                }}
              />
              <YAxis />
              <Tooltip />
              <Legend align="right"  />
             
              <Area
                name="Recovered"
                type="monotone"
                dataKey="total_recovered"
                stackId="3"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
               <Area
                name="Deaths"
                type="monotone"
                dataKey="total_deaths"
                stackId="1"
                stroke="red"
                fill="pink"
              />
              <Area
                name="Confirmed"
                type="monotone"
                dataKey="total_confirmed"
                stackId="1"
                stroke="teal"
                fill="#25aeae"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={classes.Chart}>
          <h3>Daily Increase (Last 15 days)</h3>
          <ResponsiveContainer>
          <BarChart
            width={500}
            height={400}
            data={increasePerDay}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date"
            tickFormatter={tick => {
              const holder = tick.split("T")[0].split('-');
              return holder[1] + '/' + holder[2];
            }} />
            <YAxis />
            <Tooltip />
            <Bar name="Confirmed" dataKey="dailyConfirmed" fill="#25aeae" />
          </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={classes.Hotline}>
          <Grid stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={12}>
                <h3> Emergency hotlines</h3>
                <p>
                  Callers can ask questions if they suspect
                  they are infected with COVID-19, or request assistance if they
                  have symptoms and/or known exposure to confirmed cases or
                  patients under investigation.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <a className={classes.Button} href="tel:1555">
                  <Button  fluid primary>
                    Smart/PLDT <br />
                    <Icon name="phone" size="small" /> 1555
                  </Button>
                </a>
                <a  className={classes.Button} href="tel:894-26843">
                  <Button  fluid primary>
                    Landline <br /> 
                    <Icon name="phone" size="small" />894-26843
                  </Button>
                </a>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div>
          <br />
          <h3>Residence of confirmed cases</h3>
          <div className={classes.Table}> 
            {byCityData}
          </div>
        </div>
        
        <br/>
        <h3>Protect yourself and others</h3>
        <Grid doubling columns='equal' textAlign="center"  >
            <Grid.Column mobile={8} tablet={8} computer={5}>
              <img src="https://img.icons8.com/clouds/100/000000/wash-your-hands.png"/>
                <p>Wash your hands with <br/> soap and water</p>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} computer={5}>
              <img src="https://img.icons8.com/clouds/100/000000/crowd.png"/>
              <p>Avoid close contact when  <br/>  experiencing cough or fever</p>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} computer={5}>
              <img src="https://img.icons8.com/clouds/100/000000/doctors-bag.png"/> 
              <p>Seek medical attention  <br/> if you have symptoms</p>
              
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} computer={5}>
            <img src="https://img.icons8.com/color/96/000000/coughing--v2.png"/>
            <p>Cover your nose and mouth  <br/>  when sneezing or coughing</p>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} computer={5}>
            <img src="https://img.icons8.com/color/96/000000/protection-mask.png"/>
            <p>Use face mask</p>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} computer={5}>
            <img src="https://img.icons8.com/plasticine/100/000000/delete.png"/>
            <p>Throw tissue into a <br/> closed trash can</p>
            </Grid.Column>
        </Grid>
      </div>
    </Layout>
  )
}

export default IndexPage
