import { Tabs, TabList, TabPanels, Tab, TabPanel, Container, Text } from '@chakra-ui/react'
import Login from '../components/Login'
import Signup from '../components/Signup'

const Home = () => {
  return (
    <>
      <Container sx={{marginTop: "30px"}}>
        <Text sx={{fontSize: "40px", fontWeight: "700"}}>Chat APP</Text>
        <Tabs>
          <TabList sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Tab>Login</Tab>
            <Tab>Signup</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  )
}

export default Home
