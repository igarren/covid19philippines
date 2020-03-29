/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Container } from 'semantic-ui-react'
import { useStaticQuery, graphql } from "gatsby"
import Header from "./header"
import "./layout.css"
import 'semantic-ui-css/semantic.min.css'

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Container>
       
        {children}
        <br/>
        <strong>Sources :</strong><br/>
        Data from <a href="https://ncovtracker.doh.gov.ph/">DOH Philippines</a>, 
        <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public"> WHO</a>,
        <a href="https://github.com/CSSEGISandData/COVID-19"> Johns Hopkins CSSE</a>
        <br/>
        Images from<a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public"> WHO</a><br/>
        Coronavirus icon by <a href="https://icons8.com/icon/10220/coronavirus">Icons8</a><br/>
        API Endpoint from <a href="https://about-corona.net/">about-corona</a><br/>
        
      
      </Container>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
