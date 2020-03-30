import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import axios from "axios"
import Layout from "../components/layout"
import SEO from "../components/seo"
import * as ENDPOINT from "../../const"
import { Grid, Loader, Table, Icon, Button, Segment } from "semantic-ui-react"
import classes from "../styles/styles.module.scss"
import CountUp from "react-countup"
import todo2 from "../images/corona-todo-2.png"
import todo3 from "../images/corona-todo-3.png"
import todo4 from "../images/corona-todo-4.png"
import todo1 from "../images/corona-todo-1.png"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { toDateString, toDateTimeString } from "../components/util"
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

  const [cityLoading, setCityLoading] = useState(true)
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    const fethchDashboard = async () => {
      await axios
        .get(
          "https://api.coronatracker.com/v3/stats/worldometer/country?countryCode=PH"
        )
        .then(({ data }) => {
          console.log(data.length)
          console.log(data[0])
          if (data && data.length > 0) {
            const date = toDateTimeString(data[0].lastUpdated)

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
      const firstDay = toDateString(
        new Date(date.getFullYear(), date.getMonth(), 1)
      )
      const lastDay = toDateString(
        new Date(date.getFullYear(), date.getMonth() + 1, 0)
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
        title="Home"
        description="View the current situation of corona virus in the Philippines"
      />

      <div className={classes.Container}>
        <Grid textAlign="center" columns={2}>
          <Grid.Row>
            <Grid.Column>
              <h2 className={classes.Title}>
                <img
                  className="corona"
                  src="https://img.icons8.com/metro/26/000000/coronavirus.png"
                />
                COVID-19 Philippines Tracker
              </h2>
              <p>Data as of {dashboard.updated}</p>
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
                    </span>{" "}
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
              data={dailyData.reverse()}
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
              <Legend align="center" />
             
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
        <div className={classes.Hotline}>
          <Grid stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={12}>
                <p>
                  DOH launched the DOH COVID-19 emergency hotlines 02-894-COVID
                  (02-894-26843) and 1555 in partnership with the National
                  Emergency Hotline of the Department of Interior and Local
                  Government (DILG), and PLDT and its wireless subsidiary Smart
                  Communications Inc. Callers can ask questions if they suspect
                  they are infected with COVID-19, or request assistance if they
                  have symptoms and/or known exposure to confirmed cases or
                  patients under investigation.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <a href="tel:1555">
                  <Button className={classes.Button} fluid primary>
                    Smart/PLDT: 1555
                  </Button>
                </a>
                <br />
                <a href="tel:894-26843">
                  <Button className={classes.Button} fluid primary>
                    Landline: <br /> 894-26843{" "}
                  </Button>
                </a>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div>
          <br />
          <h2>Residence of confirmed cases</h2>
          {byCityData}
        </div>
        <br />
        <br />
        <h2>Protect yourself and others</h2>
        <Grid stackable textAlign="center" columns={3}>
          <Grid.Row>
            <Grid.Column>
              <img src={todo2} />
            </Grid.Column>
            <Grid.Column>
              <img src={todo3} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <img src={todo4} />
            </Grid.Column>
            <Grid.Column>
              <img src={todo1} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </Layout>
  )
}

export default IndexPage
