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
  Label,
} from "recharts"
const loader = <Loader active inline />
const IndexPage = () => {
  const [dashboard, setDashboard] = useState({
    updated: null,
    confirmed: 0,
    deaths: 0,
    recovered: 0,
    critical: 0,
    puis: 0,
    pums: 0,
    tests: 0,
  })

  const [cityData, setCityData] = useState([])
  const [dailyDaity, setDailyData] = useState([])

  const [cityLoading, setCityLoading] = useState(true)
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    const fethchDashboard = async () => {
      await axios
        .get("https://corona-api.com/countries/PH")
        .then(({ data }) => {
          console.log(data)

          const date = new Date(data.data.updated_at)
            .toISOString()
            .slice(0, 19)
            .replace(/-/g, "/")
            .replace("T", " ")
          setDashboard({
            ...dashboard,
            critical: data.data.latest_data.critical,
            confirmed: data.data.latest_data.confirmed,
            deaths: data.data.latest_data.deaths,
            puis: data.data.latest_data.critical,
            recovered: data.data.latest_data.recovered,
            updated: date,
          })

          setDailyData(data.data.timeline.reverse())

          setDashboardLoading(false)
        })
    }
    const fetchDataByCity = async () => {
      const cityData = await axios.get(ENDPOINT.BY_CITY_ENDPOINT)
      const respCity = cityData.data.features

      setCityData(respCity)
      setCityLoading(false)
    }
    fethchDashboard()
    fetchDataByCity()
  }, [])

  let byCityData = cityLoading ? (
    loader
  ) : (
    <Table singleLine>
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
              <h2>
                <img
                  className="corona"
                  src="https://img.icons8.com/metro/26/000000/coronavirus.png"
                />
                COVID-19 Philippines
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
                  <CountUp end={dashboard.confirmed} />
                )}
              </h2>
              <p>Confirmed</p>
            </Grid.Column>
            <Grid.Column className={classes.Deaths}>
              <h2>
                <Icon name="bed" size="small" />
                {dashboardLoading ? loader : <CountUp end={dashboard.deaths} />}
              </h2>
              <p>Deaths</p>
            </Grid.Column>
            <Grid.Column className={classes.Recovered}>
              <h2>
                <Icon name="medkit" size="small" />
                {dashboardLoading ? (
                  loader
                ) : (
                  <CountUp end={dashboard.recovered} />
                )}
              </h2>
              <p>Recovered</p>
            </Grid.Column>
            <Grid.Column className={classes.Critical}>
              <h2>
                <Icon name="lightning" size="small" />
                {dashboardLoading ? (
                  loader
                ) : (
                  <CountUp end={dashboard.critical} />
                )}
              </h2>
              <p>Critical</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className={classes.Chart}>
          <h3>Outbreak Trend</h3>
          <ResponsiveContainer>
            <AreaChart
              width={500}
              height={400}
              data={dailyDaity}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="deaths"
                stackId="1"
                stroke="red"
                fill="pink"
              />
              <Area
                type="monotone"
                dataKey="recovered"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="confirmed"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
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
