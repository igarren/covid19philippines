import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import axios from 'axios';
import Layout from "../components/layout"
import SEO from "../components/seo"
import * as ENDPOINT from '../../const'
import { Grid, Loader, Table, Icon } from 'semantic-ui-react'
import classes from '../styles/styles.module.scss';
import CountUp from 'react-countup';


const loader = <Loader active inline />;
const IndexPage = () => {
  const [cityData, setCityData] = useState([]);
  const [cityLoading, setCityLoading] = useState(true);

  useEffect(() => {
   
    const fetchDataByCity = async () => {

      const cityData = await axios.get(ENDPOINT.BY_CITY_ENDPOINT);
      const respCity = cityData.data.features;
      setCityData(respCity)
      setCityLoading(false);
    };
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
      <div className={classes.Container}>
      
      

      <h2>Location Breakdown</h2>
      {byCityData}
      </div>
      
    </Layout>
  )
}

export default IndexPage