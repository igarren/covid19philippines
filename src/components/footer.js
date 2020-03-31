
import React  from "react"
import { Grid, Icon } from 'semantic-ui-react';
const Footer = () => (
  <footer
    style={{
      background: `#4FB1B1`,
    }}
  >
    
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
   
       <Grid stackable columns={2} verticalAlign='middle'>
        <Grid.Row>
            <Grid.Column>
            <strong>Sources</strong>  <br/>  
            <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public"> WHO</a>, 
            <a href="https://ncovtracker.doh.gov.ph/">DOH Philippines</a>, 
            <a href="https://coronatracker.com/">Corona Tracker</a><br/>
            Icons by  <a href="https://icons8.com/">Icons8</a>
            </Grid.Column>
            <Grid.Column>
            View this on <Icon color='white' name='github' size='large' /><a href="https://github.com/igarren/covid19philippines" target="_blank">Github</a>
            <br/>Created with  <Icon color='brown' name='coffee' size='small' /> and <Icon color='red' name='heart' size='small' /> by <a href="https://github.com/igarren/" target="_blank">@igarren</a> 
            </Grid.Column>
        </Grid.Row>
       </Grid>
        </div>
    
  </footer>
)

export default Footer
