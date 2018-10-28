import axios from "axios";

const searchStackExchange = (inname) => axios.get(`https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&inname=${inname}&site=stackoverflow`).then(res => res.data)


export default searchStackExchange;