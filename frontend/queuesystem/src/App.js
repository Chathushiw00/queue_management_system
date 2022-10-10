
import { BrowserRouter,Routes,Route,} from "react-router-dom";


import RequireAuth from './components/RequireAuth';
import UserLogin from './components/Userlogin';
import CounterLogin from './components/CounterLogin';
import IssueInput from './components/IssueInput';
import Notifications from './components/Notifications';
import ViewQueue from './components/ViewQueue';
import Counter from './components/Counter';
import CounterView from './components/CounterView';


function App() {
  // const [username, setUsername] = useState("");
  // const [user, setUser] = useState("");
  // const [socket, setSocket] = useState(null);



  return ( 

    <BrowserRouter>
    <Routes>
      <Route path="/nuser" element={<UserLogin/>} />
      <Route path="/cuser" element={<CounterLogin/>} />

      <Route element={<RequireAuth/>}>
     
          <Route path="/issueinput" element={<IssueInput/>}/>
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/queuedisplay" element={<ViewQueue/>}/>

          <Route path="/counter" element={<Counter />} />
          <Route path="/countercall/:id" element={<CounterView/>}/>

     </Route>

     </Routes>
  </BrowserRouter>
  );
}

export default App
