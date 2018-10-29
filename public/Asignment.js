class WeatherNow extends React.Component {
    render() {
        if (this.props.value.length == 0) {
            return (<div></div>);
        }
        else {
            var Icons = "https://www.weatherbit.io/static/img/icons/" + this.props.value.weather.icon + ".png";
            var windSpeed = Math.floor(this.props.value.wind_spd);
            return (
                <div className="container padding">
                    <div className="row text-center padding">
                        <div className="col-lg-2"></div>
                        <div className="col-lg-8">
                            <h2>{this.props.CityName}, {this.props.CountryName}</h2>
                            <img src={Icons} height="90px;" width="90px;" alt="weather-icon"></img>
                            <h2>{Math.floor(this.props.value.temp)}°C</h2>
                            <h4>{this.props.value.weather.description}</h4>
                            <p>{this.props.value.valid_date}</p>
                            <div className="row">
                                <div className="col-sm-6 col-md-4">
                                    <p>Feel like: {this.props.value.app_max_temp}°C</p>
                                </div>
                                <div className="col-sm-6 col-md-4">
                                    <p>Wind Speed: {windSpeed} m/s</p>
                                </div>
                                <div className="col-sm-12 col-md-4">
                                    <p>Humidity: {this.props.value.rh}%</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-4">
                                    <p>Visibility: {Math.floor(this.props.value.vis)} km</p>
                                </div>
                                <div className="col-sm-6 col-md-4">
                                    <p>UV: {this.props.value.uv}</p>
                                </div>
                                <div className="col-sm-6 col-md-4">
                                    <p>clouds: {this.props.value.clouds}%</p>
                                </div>
                            </div>
                            
                        </div>
                        <div className="col-lg-2"></div>
                    </div>
                </div>
            )
        }
    }
}




class Weather16day extends React.Component {
    constructor(props) {
        super(props);
    }

    scrollleft() {
        var elmnt = document.getElementById("horizon");
        elmnt.scrollLeft = elmnt.scrollLeft - 70;
    }
    scrollright() {
        var elmnt = document.getElementById("horizon");
        elmnt.scrollLeft = elmnt.scrollLeft + 70;
    }

    render() {
        if (this.props.allValue.length == 0) {
            return (<div></div>);
        }
        else {
            var daily = this.props.allValue.data.map(e => {
                var icon = "https://www.weatherbit.io/static/img/icons/" + e.weather.icon + ".png";
                var date = new Date(e.valid_date);
                var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                return (
                    <Weather16dayMap data={e} date={e.valid_date} DAY={day[date.getDay()]} DATE={date.getDate()} _icon={icon} _temp={e.max_temp} _apptemp={e.app_max_temp} des={e.weather.description} />
                )
            });
            return (
                <div className="container">
                    <h4>Daily</h4>
                    <div className="row">
                        <div className="col-lg-1 text-center">
                            <img src="left-arrow.png" id="btn-left" height="20px" onClick={this.scrollleft}></img>
                        </div>
                        <div className="col-sm-12 col-lg-10">
                            <div className="live__scroll no-gutters" id="horizon">
                                <div className="row text-center justify-content-center no-gutters">
                                    {daily}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-1 text-center">
                            <img src="right-arrow.png" id="btn-right" height="20px" onClick={this.scrollright}></img>
                        </div>
                    </div>
                </div >
            )
        }
    }
}


class SearchBar extends React.Component {
    constructor(props) {
        super(props);
    }
    OnPress = (value) => {
        this.props.ConfirmSearch(value)
    }
    GetValue = (value) => {
        this.props._GetValue(value);
    }
    render() {
        return (
            <Search _input={this.GetValue} onKeyPress={this.OnPress} />
        )
    }
}

function Weather16dayMap(props) {
    return (
        <div id={props.data.valid_date} className="live__scroll--box align-self-baseline">
            <p>{props.DAY} {props.DATE}</p>
            <img src={props._icon} height="40" width="40"></img>
            <div className="row">
                <b>{props._temp}°C</b>
                <h6>{props._apptemp}°C</h6>
            </div>
            <h6>{props.des}</h6>
        </div>
    )
}

function Search(props) {
    function onKeyPressHandle(e) {
        props.onKeyPress(e.key);
    }
    function input(e) {
        props._input(e.target.value)
    }
    return (
        <nav className="navbar sticky-top" id="mainNav">
            <div className="col-sm-4 col-md-6 col-lg-8">
            </div>
            <div className="input-group col-sm-8 col-md-6 col-lg-4">
                <input className="search-box" type="search" onChange={input} onKeyPress={onKeyPressHandle} placeholder="Search" aria-label="Search" />
            </div>
        </nav>
    )
}

class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            CityNameSearch: "",
            SearchResult: "",
            WeatherNow: [],
            Weather16day: [],
        })
    }

    componentDidMount = () => {
        fetch("https://api.weatherbit.io/v2.0/forecast/daily?city=Hanoi&key=dbf137339be7440fa20a84d61d8a4428")
            .then(result => {
                result.json().then(WeatherObject => {
                    this.setState({
                        WeatherNow: WeatherObject.data[0],
                        Weather16day: WeatherObject
                    })
                })
            })

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.CityNameSearch !== prevState.CityNameSearch) {
            fetch("https://api.weatherbit.io/v2.0/forecast/daily?city=" + this.state.CityNameSearch + "&key=dbf137339be7440fa20a84d61d8a4428")
                .then(result => {
                    result.json().then(WeatherObject => {
                        this.setState({
                            WeatherNow: WeatherObject.data[0],
                            Weather16day: WeatherObject
                        });
                    })
                })
        }
    }

    onKeyPress = (value) => {
        if (value == 'Enter') {
            this.setState({
                CityNameSearch: this.state.SearchResult
            });
        }
    }
    Input = (value) => {
        this.setState({
            SearchResult: value
        })
    }

    render() {
        if (this.state.WeatherNow.length != 0) {
            var City = this.state.Weather16day.city_name;
            var Country = this.state.Weather16day.country_code;
            var IndayData = this.state.WeatherNow;
            var DailyData = this.state.Weather16day;
            return (
                <div>
                    <SearchBar ConfirmSearch={this.onKeyPress} _GetValue={this.Input}></SearchBar>
                    <WeatherNow CityName={City} CountryName={Country} value={IndayData}></WeatherNow>
                    <Weather16day allValue={DailyData}></Weather16day>
                </div>
            );
        }
        else {
            return (
                <div></div>
            )
        }
    }
}

ReactDOM.render(
    <Weather />,
    document.getElementById("root")
)